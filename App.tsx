
import React, { useState, useEffect, useRef } from 'react';
import { SimulationState, CarSpecs, CrashParams, AnalysisResult, AppSettings } from './types';
import { getCarSpecifications, analyzeSurvival, searchBrands, getModelsByBrand } from './services/geminiService';
import PhysicsInputs from './components/PhysicsInputs';
import ResultsDashboard from './components/ResultsDashboard';
import AboutModal from './components/AboutModal';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>(SimulationState.IDLE);
  const [brand, setBrand] = useState('Tesla');
  const [model, setModel] = useState('Model 3');
  const [year, setYear] = useState(2023);
  const [carSpecs, setCarSpecs] = useState<CarSpecs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Expanded Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    aiModel: 'gemini-3-pro-preview',
    units: 'metric',
    analysisDepth: 'Standard',
    occupantCount: 1,
    roadCondition: 'Dry',
    timeOfDay: 'Day',
    verbosity: 'Technical',
    showPhysicsEquations: true,
    // New
    occupantAge: 'Adult',
    brakingEfficiency: 0,
    seatPositioning: 'Upright',
    tireStatus: 'New',
    airbagTech: 'Modern',
    cargoMassKg: 0,
    impactMaterial: 'Concrete',
  });

  // Suggestions state
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [modelSuggestions, setModelSuggestions] = useState<{series: string, model: string}[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const brandRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const [crashParams, setCrashParams] = useState<CrashParams>({
    speedKph: 60,
    impactAngle: 90,
    objectOfImpact: 'Vehicle',
    seatbeltUsed: true,
    airbagStatus: 'Optimal',
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);

  const isDropdownActive = showBrandDropdown || showModelDropdown;

  // Apply theme to body
  useEffect(() => {
    if (settings.theme === 'light') {
      document.body.classList.add('bg-slate-50', 'text-slate-900');
      document.body.classList.remove('bg-[#0f172a]', 'text-slate-100');
    } else {
      document.body.classList.add('bg-[#0f172a]', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    }
  }, [settings.theme]);

  // Clear analysis results when any input changes to ensure the dashboard doesn't show stale data
  useEffect(() => {
    if (result && state === SimulationState.COMPLETED) {
      setResult(null);
      setState(SimulationState.IDLE);
    }
  }, [brand, model, year, crashParams, settings]);

  // Clear car specs when vehicle identity changes
  useEffect(() => {
    if (carSpecs) {
      setCarSpecs(null);
    }
  }, [brand, model, year]);

  // Simulated progress logic for loading states
  useEffect(() => {
    let interval: number;
    if (state === SimulationState.FETCHING_CAR) {
      setProgress(0);
      interval = window.setInterval(() => {
        setProgress(prev => (prev < 40 ? prev + 2 : prev));
      }, 100);
    } else if (state === SimulationState.ANALYZING) {
      interval = window.setInterval(() => {
        setProgress(prev => (prev < 95 ? prev + 1 : prev));
      }, 200);
    } else if (state === SimulationState.COMPLETED) {
      setProgress(100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) setShowBrandDropdown(false);
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) setShowModelDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch brand suggestions when user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (brand.length > 1 && !brandSuggestions.includes(brand)) {
        setIsFetchingSuggestions(true);
        const brands = await searchBrands(brand);
        setBrandSuggestions(brands);
        setIsFetchingSuggestions(false);
        if (brands.length > 0) setShowBrandDropdown(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [brand]);

  // Fetch models automatically when brand is selected
  const fetchModels = async (selectedBrand: string) => {
    setIsFetchingSuggestions(true);
    const models = await getModelsByBrand(selectedBrand, year);
    setModelSuggestions(models);
    setIsFetchingSuggestions(false);
    if (models.length > 0) setShowModelDropdown(true);
  };

  const handleRunAnalysis = async () => {
    try {
      setResult(null);
      setError(null);
      setState(SimulationState.FETCHING_CAR);
      
      const specs = await getCarSpecifications(brand, model, year);
      setCarSpecs(specs);
      
      setState(SimulationState.ANALYZING);
      
      // Inject all advanced settings into the analysis
      const fullParams: CrashParams = {
        ...crashParams,
        ...settings, // Pass all settings to include new ones like occupantAge, brakingEfficiency, etc.
      };

      const data = await analyzeSurvival(specs, fullParams, settings.aiModel);
      setResult(data);
      
      setState(SimulationState.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Failed to process simulation. Please verify car details or try again later.");
      setState(SimulationState.ERROR);
    }
  };

  const isLoading = state === SimulationState.FETCHING_CAR || state === SimulationState.ANALYZING;

  // Theme-aware styles
  const isLight = settings.theme === 'light';
  const glassStyle = isLight ? 'bg-white shadow-xl border-slate-200' : 'glass';
  const textColor = isLight ? 'text-slate-900' : 'text-slate-100';
  const mutedText = isLight ? 'text-slate-500' : 'text-slate-500';

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 md:p-8 flex flex-col items-center ${textColor}`}>
      
      <header className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent`}>
              AeroSafety <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Pro</span>
            </h1>
            <p className={`${mutedText} mt-1 text-sm font-medium`}>Forensic Vehicular Impact Forecaster</p>
          </div>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            ⚙️ Config
          </button>
          <button 
            onClick={() => setIsAboutModalOpen(true)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
          >
            ℹ️ About
          </button>
          <div className={`px-4 py-2 rounded-full text-xs font-black border transition-colors tracking-tighter uppercase ${
            state === SimulationState.COMPLETED ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' :
            state === SimulationState.IDLE ? (isLight ? 'bg-slate-100 border-slate-300 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-500') :
            state === SimulationState.ERROR ? 'bg-red-500/10 border-red-500 text-red-500' :
            'bg-blue-500/10 border-blue-500 text-blue-500 animate-pulse'
          }`}>
            {state.replace('_', ' ')}
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full space-y-8">
        
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative">
          
          <div className={`${glassStyle} p-8 rounded-3xl relative overflow-visible group transition-all duration-300 ${isDropdownActive ? 'z-[100]' : 'z-10'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-500">01</span> Vehicular Input
            </h2>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2 sm:col-span-1 relative" ref={brandRef}>
                <label className={`block text-[10px] font-black ${mutedText} mb-1 uppercase tracking-widest`}>Manufacturer</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={brand} 
                    onChange={(e) => {
                      setBrand(e.target.value);
                      setShowBrandDropdown(true);
                    }}
                    onFocus={() => setShowBrandDropdown(true)}
                    placeholder="e.g. Volvo, BMW"
                    className={`w-full ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/50 border-slate-700'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium`}
                  />
                  {isFetchingSuggestions && brand.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  )}
                </div>
                {showBrandDropdown && brandSuggestions.length > 0 && (
                  <div className={`absolute z-[110] left-0 right-0 mt-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'} border rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto`}>
                    {brandSuggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setBrand(s);
                          setShowBrandDropdown(false);
                          fetchModels(s);
                        }}
                        className={`w-full text-left px-4 py-3 ${isLight ? 'hover:bg-slate-50 border-slate-100' : 'hover:bg-slate-800 border-slate-800'} transition-colors text-sm border-b last:border-0`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={`block text-[10px] font-black ${mutedText} mb-1 uppercase tracking-widest`}>Model Year</label>
                <input 
                  type="number" 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className={`w-full ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/50 border-slate-700'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium`}
                />
              </div>

              <div className="col-span-2 relative" ref={modelRef}>
                <label className={`block text-[10px] font-black ${mutedText} mb-1 uppercase tracking-widest`}>Model Selection</label>
                <input 
                  type="text" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  onFocus={() => { if(modelSuggestions.length > 0) setShowModelDropdown(true) }}
                  placeholder="e.g. XC90, M3 Competition"
                  className={`w-full ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/50 border-slate-700'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium`}
                />
                {showModelDropdown && modelSuggestions.length > 0 && (
                  <div className={`absolute z-[110] left-0 right-0 mt-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'} border rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto`}>
                    {modelSuggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setModel(s.model);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 ${isLight ? 'hover:bg-slate-50 border-slate-100' : 'hover:bg-slate-800 border-slate-800'} transition-colors text-sm border-b last:border-0 group`}
                      >
                        <span className="font-bold">{s.model}</span>
                        <span className="ml-2 text-slate-500 text-xs italic">{s.series}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {carSpecs && (
              <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="text-2xl">⚡</div>
                <div>
                  <p className={`font-black ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{carSpecs.brand} {carSpecs.model} ({carSpecs.year})</p>
                  <p className="text-xs font-bold text-slate-400">{carSpecs.weightKg}kg • {carSpecs.safetyRating}</p>
                </div>
              </div>
            )}
          </div>

          <div className={`${glassStyle} p-8 rounded-3xl relative overflow-hidden group z-0`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-emerald-500">02</span> Simulation Mechanics
            </h2>
            <PhysicsInputs 
              params={crashParams} 
              onChange={(upd) => setCrashParams(prev => ({ ...prev, ...upd }))}
              disabled={isLoading}
            />
          </div>

        </section>

        <div className="flex flex-col items-center gap-4 py-4 relative z-0">
          {error && <p className="text-red-400 text-sm font-black animate-pulse">{error}</p>}
          
          <div className="w-full max-w-md space-y-4">
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className={`
                w-full px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95
                ${isLoading
                  ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white hover:shadow-blue-500/25 ring-offset-2 ring-offset-[#0f172a] hover:ring-2 ring-blue-500'
                }
              `}
            >
              {state === SimulationState.FETCHING_CAR ? 'Accessing Data...' :
               state === SimulationState.ANALYZING ? 'Processing Trauma Data...' :
               'INITIATE CRASH ANALYSIS'}
            </button>

            {isLoading && (
              <div className="space-y-3 animate-in fade-in duration-500">
                <div className={`flex justify-between text-[10px] font-black ${mutedText} uppercase tracking-widest`}>
                  <span>{state === SimulationState.FETCHING_CAR ? 'Retrieving Safety Specs' : 'Analyzing Trauma Vectors'}</span>
                  <span>{progress}%</span>
                </div>
                <div className={`h-2.5 w-full ${isLight ? 'bg-slate-200' : 'bg-slate-800'} rounded-full overflow-hidden border ${isLight ? 'border-slate-300' : 'border-slate-700/50'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className={`text-[10px] text-center font-bold ${mutedText} animate-pulse italic`}>
                  Engaging {settings.aiModel === 'gemini-3-pro-preview' ? 'Pro-Level' : 'Flash-Level'} Reasoning Engine...
                </p>
              </div>
            )}
          </div>
        </div>

        {result && <ResultsDashboard result={result} />}

      </main>

      <footer className={`mt-20 py-10 w-full max-w-6xl border-t ${isLight ? 'border-slate-200' : 'border-slate-800'} flex flex-col md:flex-row justify-between ${mutedText} text-sm gap-4`}>
        <p className="font-medium">© 2024 AeroSafety Pro Dynamics. Experimental Forensic Tool.</p>
        <div className="flex gap-6 text-xs md:text-sm font-bold">
          <button onClick={() => setIsSettingsModalOpen(true)} className="hover:text-blue-500 transition-colors">Advanced Config</button>
          <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-blue-500 transition-colors">Manual</button>
          <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
        </div>
      </footer>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        settings={settings}
        onUpdate={(upd) => setSettings(prev => ({ ...prev, ...upd }))}
      />
    </div>
  );
};

export default App;

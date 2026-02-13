
import React from 'react';
import { AppSettings, AIModelType, ThemeMode, UnitSystem, RoadCondition, OccupantAge, SeatPosition, TireCondition } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  const isLight = settings.theme === 'light';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-fade" role="dialog">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative ${isLight ? 'bg-white' : 'glass'} w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-modal ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
        <div className={`p-6 md:p-8 border-b ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'} flex justify-between items-center`}>
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Advanced Simulation Config
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-10">
          {/* Core System */}
          <section>
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 border-l-4 border-blue-500 pl-3">Interface & Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">UI Theme</label>
                <div className={`flex rounded-xl p-1 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  {(['dark', 'light'] as ThemeMode[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => onUpdate({ theme: t })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.theme === t ? 'bg-blue-600 text-white shadow-lg' : 'opacity-50'}`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">AI Brain</label>
                <select 
                  value={settings.aiModel}
                  onChange={(e) => onUpdate({ aiModel: e.target.value as AIModelType })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'}`}
                >
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Detailed)</option>
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                </select>
              </div>
            </div>
          </section>

          {/* New Biological Settings */}
          <section>
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-3">Biological Variables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">Primary Occupant Age</label>
                <div className={`flex rounded-xl p-1 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  {(['Adult', 'Child', 'Senior'] as OccupantAge[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => onUpdate({ occupantAge: a })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.occupantAge === a ? 'bg-emerald-600 text-white shadow-lg' : 'opacity-50'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">Seating Posture</label>
                <div className={`flex rounded-xl p-1 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  {(['Upright', 'Reclined'] as SeatPosition[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => onUpdate({ seatPositioning: p })}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.seatPositioning === p ? 'bg-emerald-600 text-white shadow-lg' : 'opacity-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* New Physical Variables */}
          <section>
            <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 border-l-4 border-orange-500 pl-3">Physics Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="flex justify-between text-sm font-medium mb-2 opacity-70">
                  <span>Braking Efficiency (Pre-Impact Intervention)</span>
                  <span className="font-bold text-orange-500">{settings.brakingEfficiency}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={settings.brakingEfficiency}
                  onChange={(e) => onUpdate({ brakingEfficiency: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-500 bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">Tire Condition</label>
                <select 
                  value={settings.tireStatus}
                  onChange={(e) => onUpdate({ tireStatus: e.target.value as TireCondition })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'}`}
                >
                  {['New', 'Worn', 'Bald'].map(t => <option key={t} value={t}>{t} Tread</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">Impact Material</label>
                <select 
                  value={settings.impactMaterial}
                  onChange={(e) => onUpdate({ impactMaterial: e.target.value as any })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'}`}
                >
                  {['Concrete', 'Steel', 'Wood', 'Earth'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* New Vehicle Tech Variables */}
          <section>
            <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4 border-l-4 border-purple-500 pl-3">Vehicle Technology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">Airbag Generation</label>
                <select 
                  value={settings.airbagTech}
                  onChange={(e) => onUpdate({ airbagTech: e.target.value as any })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'}`}
                >
                  <option value="Legacy">Legacy (Single Stage)</option>
                  <option value="Modern">Modern (Dual Stage)</option>
                  <option value="Adaptive">Next-Gen (Adaptive Force)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">Additional Cargo (kg)</label>
                <input 
                  type="number" 
                  value={settings.cargoMassKg}
                  onChange={(e) => onUpdate({ cargoMassKg: parseInt(e.target.value) })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'}`}
                />
              </div>
            </div>
          </section>
        </div>

        <div className={`p-6 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-900/50'} flex justify-end gap-3`}>
           <button onClick={onClose} className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all">
             Apply Advanced Config
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

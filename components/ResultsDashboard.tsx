
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  result: AnalysisResult;
}

const ResultsDashboard: React.FC<Props> = ({ result }) => {
  const survivalData = [
    { name: 'Survival', value: result.survivalProbability },
    { name: 'Fatality Risk', value: 100 - result.survivalProbability },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  const injuryData = [
    { area: 'Head', risk: result.injuryRiskBreakdown.head.includes('Low') ? 20 : result.injuryRiskBreakdown.head.includes('High') ? 80 : 50 },
    { area: 'Chest', risk: result.injuryRiskBreakdown.chest.includes('Low') ? 20 : result.injuryRiskBreakdown.chest.includes('High') ? 80 : 50 },
    { area: 'Legs', risk: result.injuryRiskBreakdown.legs.includes('Low') ? 20 : result.injuryRiskBreakdown.legs.includes('High') ? 80 : 50 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getInjuryIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('brain') || l.includes('concussion')) return '🧠';
    if (l.includes('bone') || l.includes('fracture')) return '🦴';
    if (l.includes('organ') || l.includes('internal')) return '🩸';
    return '🩹';
  };

  return (
    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Survival Gauge */}
        <div className="glass p-6 rounded-2xl flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">Survival Probability</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={survivalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                >
                  {survivalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <span className="text-5xl font-black text-emerald-400">{result.survivalProbability}%</span>
            <p className="text-slate-500 text-sm mt-2">Likelihood of avoiding fatal injuries</p>
          </div>
        </div>

        {/* Physics Data */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Collision Physics</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Kinetic Energy</p>
                <p className="text-2xl font-bold mono text-blue-400">{Math.round(result.kineticEnergyKJ).toLocaleString()} kJ</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400">⚡</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Peak G-Force</p>
                <p className="text-2xl font-bold mono text-orange-400">{result.estimatedGForce} G</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-400">⚠️</span>
              </div>
            </div>

            <div className="p-4 border border-slate-700 rounded-xl">
              <h4 className="text-sm font-semibold mb-3 text-slate-300">Regional Injury Assessment</h4>
              <div className="w-full h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={injuryData} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="area" type="category" width={60} stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="risk" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning & Evidence */}
        <div className="glass p-6 rounded-2xl flex flex-col h-full">
          <h3 className="text-lg font-bold mb-4">Scientific Analysis</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-slate-300 leading-relaxed custom-scrollbar max-h-[400px]">
            <p>{result.reasoning}</p>
            
            {result.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Grounding Data</h4>
                <ul className="space-y-1">
                  {result.sources.map((s, idx) => (
                    <li key={idx}>
                      <a href={s.uri} target="_blank" rel="noopener" className="text-blue-400 hover:underline flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        {s.title.slice(0, 30)}...
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medical Prognosis Section */}
      <div className="glass p-8 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl">🩺</div>
        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
          <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">🏥</span>
          Clinical Trauma Prognosis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {result.specificInjuries.map((injury, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl hover:border-slate-500/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{getInjuryIcon(injury.label)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter border ${getSeverityColor(injury.severity)}`}>
                  {injury.severity}
                </span>
              </div>
              <h4 className="font-bold text-slate-200 mb-1">{injury.label}</h4>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${injury.chance > 70 ? 'bg-red-500' : injury.chance > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${injury.chance}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400">{injury.chance}%</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 group-hover:line-clamp-none transition-all">{injury.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;

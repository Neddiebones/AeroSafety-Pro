
import React from 'react';
import { CrashParams, AirbagStatus } from '../types';

interface Props {
  params: CrashParams;
  onChange: (updates: Partial<CrashParams>) => void;
  disabled: boolean;
}

const PhysicsInputs: React.FC<Props> = ({ params, onChange, disabled }) => {
  const airbagOptions: { value: AirbagStatus; label: string; color: string; desc: string }[] = [
    { value: 'None', label: 'None', color: 'bg-red-500', desc: 'Disabled/Failed' },
    { value: 'Partial', label: 'Partial', color: 'bg-orange-500', desc: 'Late/Partial' },
    { value: 'Optimal', label: 'Optimal', color: 'bg-emerald-500', desc: 'Full Safety' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Speed (km/h)</label>
          <input
            type="range"
            min="0"
            max="250"
            value={params.speedKph}
            onChange={(e) => onChange({ speedKph: parseInt(e.target.value) })}
            disabled={disabled}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-2">
            <span className="mono text-xl font-bold text-blue-400">{params.speedKph}</span>
            <span className="text-xs text-slate-500">Max: 250 km/h</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Impact Angle (°)</label>
          <input
            type="range"
            min="0"
            max="90"
            value={params.impactAngle}
            onChange={(e) => onChange({ impactAngle: parseInt(e.target.value) })}
            disabled={disabled}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between mt-2">
            <span className="mono text-xl font-bold text-teal-400">{params.impactAngle}°</span>
            <span className="text-xs text-slate-500">0=Side | 90=Head-on</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Impact Object</label>
          <select
            value={params.objectOfImpact}
            onChange={(e) => onChange({ objectOfImpact: e.target.value as any })}
            disabled={disabled}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="Vehicle">Other Vehicle (Crumple Zones)</option>
            <option value="Wall">Concrete Wall (Fixed)</option>
            <option value="Tree/Pole">Tree or Pole (Narrow Impact)</option>
            <option value="Ditch">Soft Ground / Ditch</option>
          </select>
        </div>

        <div className="flex items-center pt-2">
           <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={params.seatbeltUsed}
              onChange={(e) => onChange({ seatbeltUsed: e.target.checked })}
              disabled={disabled}
              className="w-6 h-6 rounded border-slate-700 bg-slate-800 checked:bg-blue-500 transition-all cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Seatbelt Restraint</span>
              <p className="text-[10px] text-slate-500 uppercase">Primary safety system</p>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm font-medium text-slate-400 mb-3">Airbag Deployment Scenario</label>
        <div className="grid grid-cols-3 gap-2">
          {airbagOptions.map((opt) => (
            <button
              key={opt.value}
              disabled={disabled}
              onClick={() => onChange({ airbagStatus: opt.value })}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                ${params.airbagStatus === opt.value 
                  ? `${opt.color.replace('bg-', 'border-')} bg-slate-800/80` 
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`w-2 h-2 rounded-full mb-1 ${opt.color} ${params.airbagStatus === opt.value ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-bold ${params.airbagStatus === opt.value ? 'text-white' : 'text-slate-500'}`}>{opt.label}</span>
              <span className="text-[9px] text-slate-600 uppercase tracking-tighter">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicsInputs;

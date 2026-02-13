
import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-fade"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative glass w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-modal">
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            About AeroSafety Pro
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8">
          <section>
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">Project Purpose</h3>
            <p className="text-slate-300 leading-relaxed">
              AeroSafety Pro is an advanced educational simulation platform designed to visualize the complex physics of vehicular impacts. By combining real-world automotive data with sophisticated analysis, we help users understand the critical factors that determine survival in high-speed collisions.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Core Physics</h3>
              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Kinetic Energy (0.5 * m * v²)</li>
                <li>Impact Deceleration Modeling</li>
                <li>G-Force Vector Analysis</li>
                <li>Crumple Zone Energy Dissipation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest">Technology Stack</h3>
              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Gemini 3 Pro (Analysis)</li>
                <li>Gemini 3 Flash (Data Retrieval)</li>
                <li>React + TypeScript</li>
                <li>Tailwind CSS + Recharts</li>
              </ul>
            </div>
          </section>

          <section className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
            <h3 className="text-sm font-bold text-blue-300 mb-2">Google GenAI Grounding</h3>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              Our safety ratings and vehicle specifications are cross-referenced in real-time using Google Search grounding. This ensures the simulation accounts for the most recent NCAP, IIHS, and manufacturer safety updates available in public records.
            </p>
          </section>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-white/10 flex justify-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
            Disclaimer: This tool is for educational purposes only. Always prioritize road safety and follow local traffic laws.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;

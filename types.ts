
export interface CarSpecs {
  brand: string;
  series: string;
  model: string;
  year: number;
  weightKg: number;
  safetyRating: string; // e.g. "5 Stars NCAP"
  safetyFeatures: string[];
}

export type AirbagStatus = 'None' | 'Partial' | 'Optimal';

export interface CrashParams {
  speedKph: number;
  impactAngle: number; // 0 to 90
  objectOfImpact: 'Vehicle' | 'Wall' | 'Tree/Pole' | 'Ditch';
  seatbeltUsed: boolean;
  airbagStatus: AirbagStatus;
}

export interface DetailedInjury {
  label: string;
  chance: number; // 0-100
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  description: string;
}

export interface AnalysisResult {
  survivalProbability: number;
  estimatedGForce: number;
  kineticEnergyKJ: number;
  injuryRiskBreakdown: {
    head: string;
    chest: string;
    legs: string;
  };
  specificInjuries: DetailedInjury[];
  reasoning: string;
  sources: { title: string; uri: string }[];
}

export enum SimulationState {
  IDLE = 'IDLE',
  FETCHING_CAR = 'FETCHING_CAR',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

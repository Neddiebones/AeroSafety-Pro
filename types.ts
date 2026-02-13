
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
export type ThemeMode = 'dark' | 'light';
export type AIModelType = 'gemini-3-pro-preview' | 'gemini-3-flash-preview';
export type UnitSystem = 'metric' | 'imperial';
export type RoadCondition = 'Dry' | 'Wet' | 'Icy' | 'Gravel';
export type OccupantAge = 'Adult' | 'Child' | 'Senior';
export type SeatPosition = 'Upright' | 'Reclined';
export type TireCondition = 'New' | 'Worn' | 'Bald';

export interface AppSettings {
  // Existing
  theme: ThemeMode;
  aiModel: AIModelType;
  units: UnitSystem;
  analysisDepth: 'Standard' | 'Forensic';
  occupantCount: number;
  roadCondition: RoadCondition;
  timeOfDay: 'Day' | 'Night';
  verbosity: 'Technical' | 'Casual';
  showPhysicsEquations: boolean;
  
  // 7 New Settings
  occupantAge: OccupantAge;
  brakingEfficiency: number; // 0 - 100%
  seatPositioning: SeatPosition;
  tireStatus: TireCondition;
  airbagTech: 'Legacy' | 'Modern' | 'Adaptive';
  cargoMassKg: number;
  impactMaterial: 'Concrete' | 'Steel' | 'Wood' | 'Earth';
}

export interface CrashParams extends Partial<AppSettings> {
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


import { GoogleGenAI, Type } from "@google/genai";
import { CarSpecs, CrashParams, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Suggests brands based on partial input.
 */
export const searchBrands = async (input: string): Promise<string[]> => {
  if (input.length < 2) return [];
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `List 5 car manufacturers that start with or match "${input}". Return only the names as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
};

/**
 * Fetches common models and series for a given brand and year.
 */
export const getModelsByBrand = async (brand: string, year: number): Promise<{series: string, model: string}[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `List the most popular car models/series for the brand "${brand}" in the year ${year}. Return as a JSON array of objects with 'series' and 'model' keys.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            series: { type: Type.STRING },
            model: { type: Type.STRING }
          },
          required: ["series", "model"]
        }
      }
    }
  });
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
};

export const getCarSpecifications = async (brand: string, model: string, year: number): Promise<CarSpecs> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Retrieve precise specifications for a ${year} ${brand} ${model}. I need its curb weight in kg, safety rating (NCAP/IIHS), and standard safety features.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          series: { type: Type.STRING },
          model: { type: Type.STRING },
          year: { type: Type.NUMBER },
          weightKg: { type: Type.NUMBER },
          safetyRating: { type: Type.STRING },
          safetyFeatures: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["brand", "model", "year", "weightKg", "safetyRating", "safetyFeatures"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeSurvival = async (car: CarSpecs, params: CrashParams): Promise<AnalysisResult> => {
  const prompt = `
    Perform a high-fidelity crash survivability and clinical trauma analysis.
    
    VEHICLE: ${car.year} ${car.brand} ${car.model}
    SPECS: ${car.weightKg}kg, Rating: ${car.safetyRating}, Features: ${car.safetyFeatures.join(', ')}
    
    CRASH PARAMETERS:
    - Speed: ${params.speedKph} km/h
    - Angle: ${params.impactAngle}°
    - Object: ${params.objectOfImpact}
    - Seatbelt: ${params.seatbeltUsed ? 'Yes' : 'No'}
    - Airbag Deployment Status: ${params.airbagStatus} (None/Partial/Optimal)
    
    Based on vehicular physics and trauma medicine, calculate:
    1. Kinetic Energy (kJ) and peak G-Force.
    2. Survival Probability (%).
    3. specificInjuries: YOU MUST ANALYZE THE RISK FOR:
       - Concussion (MTBI)
       - Traumatic Brain Injury (Brain Damage)
       - Bone Fractures (Broken Bones)
       - Internal Organ Damage
       For each, provide a label, chance (0-100), severity (Low/Moderate/High/Critical), and short description.
       Note: Airbag status "${params.airbagStatus}" significantly impacts head and chest injury probability.
    4. Detailed scientific reasoning.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          survivalProbability: { type: Type.NUMBER },
          estimatedGForce: { type: Type.NUMBER },
          kineticEnergyKJ: { type: Type.NUMBER },
          injuryRiskBreakdown: {
            type: Type.OBJECT,
            properties: {
              head: { type: Type.STRING },
              chest: { type: Type.STRING },
              legs: { type: Type.STRING }
            }
          },
          specificInjuries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                chance: { type: Type.NUMBER },
                severity: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["label", "chance", "severity", "description"]
            }
          },
          reasoning: { type: Type.STRING }
        }
      }
    }
  });

  const analysis = JSON.parse(response.text);
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Safety Resource',
    uri: chunk.web?.uri || '#'
  })) || [];

  return { ...analysis, sources };
};

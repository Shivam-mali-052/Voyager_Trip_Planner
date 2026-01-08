
import { GoogleGenAI, Type } from "@google/genai";
import { PlannerFormData, PlannerResults } from "../frontend/types";

export async function fetchTripPlan(data: PlannerFormData): Promise<PlannerResults> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const stayFactor = 0.55;
  const foodFactor = 0.25;
  const activityFactor = 0.20;

  const budgetBreakdown = {
    stay: data.budget * stayFactor,
    food: data.budget * foodFactor,
    activities: data.budget * activityFactor,
    perPersonPerDay: data.budget / (data.people * data.days)
  };

  const prompt = `
    I am planning a trip to ${data.location}. Use Google Search grounding to provide accurate, real-time information based on TODAY'S data.
    
    HOTEL PROXIMITY RULE:
    - Search for hotels strictly within or immediately adjacent to "${data.location}". 
    - You MUST prioritize proximity. Start with the most central or "nearby" options relative to the heart of the searched location.
    - Only suggest hotels further away (the "far" options) if no suitable matches for the ${data.travelerType} budget exist in the immediate vicinity.

    Trip Details:
    - Duration: ${data.days} days
    - Group Size: ${data.people} people
    - Total Budget: INR ${data.budget}
    - Traveler Profile: ${data.travelerType}
    
    Requirements:
    1. CURRENT weather in ${data.location} (temperature in Celsius and conditions).
    2. Exactly 3 real, currently operating hotels that follow the PROXIMITY RULE and fit the ${data.travelerType} budget. 
       Ensure the total stay cost is roughly INR ${budgetBreakdown.stay}.
    3. Exactly 4 popular tourist activities or hidden gems in ${data.location} with current estimated entry fees/costs in INR.
    4. 4 local food recommendations or specific dining experiences.
    
    CRITICAL: 
    - Provide real physical addresses for hotels.
    - The totalEstimatedCost must be a realistic sum of stay, food, and activities.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                isOutdoorFriendly: { type: Type.BOOLEAN }
              },
              required: ["temp", "condition", "isOutdoorFriendly"]
            },
            hotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  pricePerNight: { type: Type.NUMBER },
                  rating: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  address: { type: Type.STRING },
                  amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  bookingLink: { type: Type.STRING }
                },
                required: ["name", "pricePerNight", "rating", "description", "address", "amenities"]
              }
            },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cost: { type: Type.NUMBER },
                  type: { type: Type.STRING, description: "Indoor or Outdoor" },
                  description: { type: Type.STRING }
                },
                required: ["name", "cost", "type", "description"]
              }
            },
            foodSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            totalEstimatedCost: { type: Type.NUMBER }
          },
          required: ["weather", "hotels", "activities", "foodSuggestions", "totalEstimatedCost"]
        }
      }
    });

    const jsonResult = JSON.parse(response.text || '{}');
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      ...jsonResult,
      budgetBreakdown,
      groundingUrls: urls
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to fetch live travel data. Please try a different location.");
  }
}

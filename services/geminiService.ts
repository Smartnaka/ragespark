
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorInput, GeneratedContent } from "../types.ts";

export async function generateRagebait(input: GeneratorInput): Promise<GeneratedContent> {
  // CRITICAL: Initialize a new instance right before making the call to ensure 
  // it uses the most up-to-date API key from the selection dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', 
    contents: `You are an expert in social media virality and internet psychology. 
    Your task is to generate a high-engagement "ragebait" post.
    
    Topic: "${input.topic}"
    Platform: ${input.platform}
    Heat Level: ${input.heat}
    
    Requirements:
    - Create a hook that is either factually slightly incorrect (Cunningham's Law), aggressively gatekeeping, or shares a highly controversial preference.
    - The hook must be catchy and look like a genuine post.
    - Explain the "Strategy" used.
    - Explain the "Psychology" (e.g., why this triggers the 'correction instinct' or 'moral outrage').
    
    SAFETY RULE: Do not generate hate speech, harassment, or illegal content. Keep it to 'safe' controversies (food, tech, lifestyle, opinions).`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 }, 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: {
            type: Type.STRING,
            description: "The main text/headline of the post.",
          },
          strategy: {
            type: Type.STRING,
            description: "The specific technique used.",
          },
          psychology: {
            type: Type.STRING,
            description: "The cognitive trigger explanation.",
          },
        },
        required: ["hook", "strategy", "psychology"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response text");
    const data = JSON.parse(text.trim());
    return data as GeneratedContent;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("The AI reasoning failed. Try adjusting the topic.");
  }
}

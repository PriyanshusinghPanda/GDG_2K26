import { GoogleGenAI } from '@google/genai';

// Day 3: Initialize the Gemini SDK
// IMPORTANT: In a real app, never expose your API key in frontend code.
// For this workshop, we use environment variables.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "PASTE_YOUR_API_KEY_HERE";

// The new SDK requires passing the API key directly
const ai = new GoogleGenAI({ apiKey: apiKey });

export async function generateQuizQuestions(topic) {
  const prompt = `Create a 3-question multiple choice quiz about: ${topic}.
Return ONLY a valid JSON array of objects. Do NOT wrap it in markdown block quotes (\`\`\`json).
Each object MUST have this exact structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Option A"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Clean up any markdown formatting just in case the AI includes it
    let cleanText = response.text.replace(/```json/gi, "").replace(/```/gi, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. Please check your API key and console.");
  }
}

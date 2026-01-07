
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getChatResponse(
  message: string,
  image?: string
): Promise<string> {
  const model = 'gemini-3-pro-preview';
  
  try {
    const parts: any[] = [{ text: message }];
    
    if (image) {
      // image is expected to be a base64 data URL
      const [mimeTypePart, base64Data] = image.split(',');
      const mimeType = mimeTypePart.split(':')[1].split(';')[0];
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while processing your request. Please ensure the API key is valid and try again.";
  }
}

import { GoogleGenAI } from '@google/genai';
import { Product } from '../product-provider/types';

export interface PinContent {
  title: string;
  description: string;
  keywords: string[];
}

export interface AIGenerator {
  generatePinContent(product: Product, audience?: string, tone?: string): Promise<PinContent>;
}

export class GeminiAIGenerator implements AIGenerator {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generatePinContent(product: Product, audience?: string, tone?: string): Promise<PinContent> {
    const prompt = `
      You are an expert Pinterest marketer. Generate a highly engaging Pinterest pin title, description, and keywords for the following product:

      Product Title: ${product.title}
      Features: ${product.features.join(', ')}
      ${audience ? `Target Audience: ${audience}` : ''}
      ${tone ? `Tone: ${tone}` : ''}

      Output must be strictly in JSON format with the following structure:
      {
        "title": "A catchy, click-worthy Pinterest title (max 100 chars)",
        "description": "An engaging, natural Pinterest description highlighting benefits (max 500 chars)",
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      return JSON.parse(text) as PinContent;
    } catch (error) {
      console.error("Gemini AI error:", error);
      throw new Error("Failed to generate AI content using Gemini");
    }
  }
}

export const getAIGenerator = (): AIGenerator => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Configuration Error: GEMINI_API_KEY is missing in environment variables. Real generation requires this key.");
  }
  return new GeminiAIGenerator(apiKey);
};

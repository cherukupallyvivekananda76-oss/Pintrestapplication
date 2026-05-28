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
  private maxRetries = 3;

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

    let attempt = 0;
    while (attempt <= this.maxRetries) {
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
      } catch (error: any) {
        attempt++;
        const errorMessage = error?.message || String(error);

        // Log the structured error for debugging
        console.error(`[GeminiAIGenerator] Attempt ${attempt} failed. Model: gemini-2.5-flash. Error:`, errorMessage);

        const isTransientError =
          errorMessage.includes('503') ||
          errorMessage.includes('UNAVAILABLE') ||
          errorMessage.includes('429') ||
          errorMessage.includes('Too Many Requests');

        if (isTransientError && attempt <= this.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.warn(`[GeminiAIGenerator] Transient error detected. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (isTransientError) {
          throw new Error("The AI service is currently experiencing high demand. Please try again later.");
        }

        // Hard fail on non-transient errors (e.g., bad request, 401, parsing failure)
        throw new Error("Failed to generate AI content using Gemini. An unexpected error occurred.");
      }
    }

    throw new Error("Failed to generate AI content using Gemini after exhausting retries.");
  }
}

export const getAIGenerator = (): AIGenerator => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Configuration Error: GEMINI_API_KEY is missing in environment variables. Real generation requires this key.");
  }
  return new GeminiAIGenerator(apiKey);
};

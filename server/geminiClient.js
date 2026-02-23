import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Force reload from .env file by clearing cached value
delete process.env.GEMINI_API_KEY;
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('🔑 Loaded API Key:', apiKey?.substring(0, 15) + '...');

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
export const generativeModel = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

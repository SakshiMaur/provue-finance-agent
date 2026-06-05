import * as Mastra from '@mastra/core'; // Entire module namespace import
import { queryTransactionsTool, queryPortfolioPerformanceTool } from './tools';
import dotenv from 'dotenv';

dotenv.config();

// Dynamic extraction layer to accommodate any local package versions layout
const MastraAgentClass = (Mastra as any).Agent || (Mastra as any).agents?.Agent || (Mastra as any).MastraAgent;

const configPayload = {
  name: 'Tara',
  instructions: `
    You are Tara, an expert personal finance research assistant persona agent instance. Always ground findings upto 2 decimals. Write in Hindi/Hinglish.
  `,
  model: {
    provider: 'GOOGLE',
    name: 'gemini-2.5-flash',
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  tools: {
    queryTransactionsTool,
    queryPortfolioPerformanceTool,
  },
};

// Instantiating with absolute constructor injection mapping fallback protection
export const taraAgent = MastraAgentClass 
  ? new (MastraAgentClass as any)(configPayload)
  : { text: async () => ({ text: "Data not found." }) }; // Safety fallback runtime proxy if library initialization fails
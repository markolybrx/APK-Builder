import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Note: dangerouslyAllowBrowser is usually false for security, 
  // but since we are calling this from API routes (Server-side), it is safe.
});

export default openai;

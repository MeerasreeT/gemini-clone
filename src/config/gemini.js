// src/config/gemini.js
import { GoogleGenAI } from '@google/genai';

/**
 * runChat: sends prompt to Google Gemini AI and returns response
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function runChat(prompt) {
  console.log("runChat called with prompt:", prompt);

  if (!prompt) throw new Error("Prompt is required");

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Vite safe
  });

  const tools = [
    {
      googleSearch: {},
    },
  ];

  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };

  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let finalText = '';
  for await (const chunk of response) {
    finalText += chunk.text;
    console.log("Chunk:", chunk.text);
  }

  console.log("Final response:", finalText);
  return finalText;  // <-- closing brace of function follows immediately
}  // <- Correct single closing brace

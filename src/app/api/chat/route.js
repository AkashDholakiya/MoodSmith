import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Define the maximum duration if needed
export const maxDuration = 30;

// Initialize OpenAI with the GROQ API endpoint and API key
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY
});

// Handle POST requests to this API route
export async function POST(req) {
  try {
    // Parse the request body
    const { messages, customVariable } = await req.json();

    // Create custom instructions based on customVariable or other logic
    const customInstructions = {
      role: 'system',
      content: customVariable
    };

    // Combine custom instructions with incoming messages
    const customMessages = [customInstructions, ...messages];

    // Fetch the result from the AI service
    const result = await streamText({
      model: groq('llama3-70b-8192'),
      messages: customMessages
    });

    // Return the AI response
    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ message: 'Error processing request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}


// Import necessary packages
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

let model = 'gpt-4o';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (message) {
      const prompt = `You are a professional crypto and Web3 expert. Provide a clear and precise answer to the following question: ${message}`;

      try {
        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
        });

        res.status(200).json({ message: response.choices[0].message.content.trim() });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ error: 'Message is required' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

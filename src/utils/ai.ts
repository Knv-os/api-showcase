import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const chatgpt = async (prompt: string) =>
  await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

export {
  chatgpt,
}

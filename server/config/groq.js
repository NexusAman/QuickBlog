import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function main(prompt) {
  const chatCompletion = await getGroqChatCompletion(prompt);
  const content = chatCompletion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned no text content");
  }

  return content;
}

export async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert editorial writer and content strategist. Always use the topic provided by the user and never ask for another topic. Create original, accurate, useful, human-sounding content for a general audience. Prioritize a clear narrative, practical insight, varied sentence length, smooth transitions, and specific examples over generic filler. Avoid repetition, exaggerated claims, clickbait, and unsupported statistics. Never invent statistics, studies, company policies, quotes, or named examples; use general examples when facts cannot be verified. Use only Quill-compatible Markdown: one title with #, section headings with ##, paragraphs, bold, italics, blockquotes, and ordered or unordered lists. Never use Markdown tables, pipe-separated columns, HTML, charts, code blocks, YAML, or JSON. Do not include an AI disclaimer, writing notes, or meta commentary.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 0.7,
    max_completion_tokens: 1800,
  });
}

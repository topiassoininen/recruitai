import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // pull from .env or Vercel
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { resumeText, jobDescription } = req.body;
  if (!resumeText || !jobDescription)
    return res.status(400).json({ error: "Missing fields" });

  const prompt = `
Compare the following résumé to the job description and output ONLY a single number 0-100 indicating fit score.

Résumé:
${resumeText}

Job:
${jobDescription}

Number:
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",         // cheap & strong; use "gpt-4o" if you like
      messages: [
        { role: "system", content: "You are an expert technical recruiter." },
        { role: "user", content: prompt },
      ],
      max_tokens: 5,
      temperature: 0.2,
    });

    const scoreRaw = chat.choices[0].message.content?.trim() ?? "0";
    const score = parseInt(scoreRaw.replace(/[^0-9]/g, ""), 10) || 0;

    res.json({ score });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}

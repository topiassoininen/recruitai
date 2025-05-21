import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import pdf from "pdf-parse";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "16mb", // bump if you expect larger files
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { resumeText, pdfBase64, jobDescription } = req.body || {};
  if (!jobDescription) {
    return res.status(400).json({ error: "Missing job description" });
  }

  let text: string = resumeText ?? "";

  // If we got a PDF, extract plaintext
  if (!text && pdfBase64) {
    try {
      const pdfBuf = Buffer.from(pdfBase64, "base64");
      text = (await pdf(pdfBuf)).text;
    } catch (err) {
      console.error("PDF parse error", err);
      return res.status(400).json({ error: "Failed to parse PDF" });
    }
  }

  if (!text) {
    return res.status(400).json({ error: "Missing résumé text" });
  }

  // Trim to keep context under model limit (~8k tokens)
  const safeResume = text.slice(0, 20000);

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // cheaper for demo
      messages: [
        {
          role: "system",
          content: "You are an expert recruiter. Return only a number 0-100.",
        },
        {
          role: "user",
          content: `Résumé:\n${safeResume}\nJob:\n${jobDescription}`,
        },
      ],
      max_tokens: 5,
      temperature: 0.2,
    });

    const num = parseInt(
      chat.choices[0].message.content?.replace(/[^0-9]/g, "") || "0",
      10
    );
    res.json({ score: num });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "OpenAI error" });
  }
}

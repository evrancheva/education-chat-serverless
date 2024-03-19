import dotenv from "dotenv";
import { Request, Response } from "express";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY || "",
});

async function handleUserQuestion(req: Request, res: Response) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: req.query.q as string }],
    model: "gpt-3.5-turbo",
  });

  const text = chatCompletion.choices[0].message.content;

  res.json({ message: text });
}

export default handleUserQuestion;

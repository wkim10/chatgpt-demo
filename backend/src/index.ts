import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { OpenAI } from "openai";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.REACT_APP_PORT || 8000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript Express!" });
});

app.post("/api/completion", async (req: Request, res: Response) => {
  const { text, temperature, maxTokens } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  let completionText: string | null = "";
  let error: boolean = false;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "gpt-3.5-turbo",
      temperature: temperature ? temperature : 1,
      max_tokens: maxTokens ? maxTokens : 4096,
    });

    console.log(completion.choices[0]);
    completionText = completion.choices[0].message.content;
  } catch (err) {
    console.error("Error:", err);
    error = true;
  }

  res.json({ completionText: completionText, error: error });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

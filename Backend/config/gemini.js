import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Force it to use the v1 endpoint
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

export async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const result = await model.generateContent({
      contents: [{ parts: [{ text: "Answer what day is it today?" }] }]
    });

    const response = await result.response;//Gemini response
    const text = response.text();
    return text;
  } catch (err) {
    console.error(err);
    return "Error generating content.";
  }
}


  


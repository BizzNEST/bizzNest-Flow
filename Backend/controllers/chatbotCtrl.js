import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pool from "../config/database.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

const chatbotCtrl = {
  chat: async (req, res) => {
    try {
      const { message, projectName, requiredSkills } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, error: "Message is required" });
      }

      // (Optional) Fetch related project data from DB if you want more context
      // const [projectInfo] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);

      const prompt = `
You are BizzNestBot, a helpful assistant for matching interns to projects.

Project name: ${projectName || "Not specified"}
Required skills: ${requiredSkills || "Not specified"}

User's message: "${message}"

Instructions:
- Suggest interns who would be a great match based on the required skills.
- Keep the response short and to the point.
- Suggest improvements if the skill match is not perfect.
`;

      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          topP: 0.9,
          maxOutputTokens: 300,
        }
      });

      const response = await result.response;
      const responseText = response.text();

      // Optional: Save conversation
      /*await pool.query(
        "INSERT INTO chatbot_conversations (message, response) VALUES (?, ?)",
        [message, responseText]
      );*/

      return res.status(200).json({ success: true, response: responseText });

    } catch (error) {
      console.error("Chatbot Error:", error);
      return res.status(500).json({ success: false, error: "Failed to generate response" });
    }
  }
};

export default chatbotCtrl;

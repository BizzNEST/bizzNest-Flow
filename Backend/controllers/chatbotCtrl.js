import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

const chatbotCtrl = {
  chat: async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: "Message is required" });
      }

      // 👇 Fetch intern and project summaries from your own API
      const [internRes, projectRes] = await Promise.all([
        axios.get("http://host.docker.internal:30001/api/getInternDataSummary"),
        axios.get("http://host.docker.internal:30001/api/getProjectsDataSummary"),
      ]);

      const interns = internRes.data;
      const projects = projectRes.data;

      // 👇 Build the prompt for Gemini
      const prompt = `
You are Harvey, an expert data analyst assistant.

Below is real JSON data from an internship program, containing:
- A list of interns, their skills, departments, and learning history
- A list of projects, tools involved, and associated interns with projected skill growth

Use this data to answer the user's question.

INTERN DATA (JSON):
${JSON.stringify(interns, null, 2)}

PROJECT DATA (JSON):
${JSON.stringify(projects, null, 2)}

USER QUESTION:
"${message}"

TASK:
Analyze the data and provide a concise, useful answer to the user's question. Include reasoning or correlations if possible.
`;

// Uncomment the line below when you need to test smaller prompts

//       const prompt = `
// You are Harvey, an expert data analyst assistant.

// USER QUESTION:
// "${message}"

// TASK:
// Provide a helpful response based only on the question. Ignore database context.
// `;

      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

      const tokenEstimate = prompt.length / 4;
      console.log("🧠 Prompt length (characters):", prompt.length);
      console.log("🔢 Estimated token count:", tokenEstimate);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          topP: 0.9,
          maxOutputTokens: 600,
        }
      });

      const response = await result.response;
      const responseText = response.text();

      return res.status(200).json({ success: true, response: responseText });

    } catch (error) {
      console.error("Chatbot Error:");
      console.error("Full error:", error);
      if (error.response) {
        console.error("Gemini response error:", error.response.data);
      } else if (error.request) {
        console.error("No response received. Request error:", error.request);
      } else {
        console.error("Other error:", error.message);
      }
      return res.status(500).json({ success: false, error: "Failed to generate response" });
    }
  }
};

export default chatbotCtrl;
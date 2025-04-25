// routes/test.js
import express from "express";
import { testGemini } from "../config/gemini.js";

const router = express.Router();

router.get("/test-gemini", async (req, res) => {
  const response = await testGemini();
  res.send(response); //sends response to user
});

export default router;


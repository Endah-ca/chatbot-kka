import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });
    const data = await response.json();
    const text = data.output[0].content[0].text;
    res.json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running"));

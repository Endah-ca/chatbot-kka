import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    // Jika API error → lempar balik ke frontend
    if (data.error) {
      console.log("API ERROR:", data.error);
      return res.json({ reply: "Error dari API: " + data.error.message });
    }

    const reply = data?.choices?.[0]?.message?.content;

    res.json({ reply: reply || "Tidak ada balasan dari model." });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Terjadi kesalahan server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

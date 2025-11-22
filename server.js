import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Rule-based fallback function
function fallbackReply(message) {
  message = message.toLowerCase();
  if (message.includes("halo")) return "Halo! Ada yang bisa saya bantu?";
  if (message.includes("siapa kamu?")) return "Saya chatbot hybrid simulasi.";
  if (message.includes("apa kabar?")) return "Baik, terima kasih! Kamu bagaimana?";
  if (message.includes("aku butuh bantuanmu")) return "Baik, aku akan membantumu.";
  return "Maaf, saya tidak mengerti. Bisa coba pertanyaan lain?";
}

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const apiKey = process.env.OPENAI_API_KEY;

  // Kalau API key tidak ada, langsung pakai fallback
  if (!apiKey) {
    const reply = fallbackReply(userMessage);
    return res.json({ reply, source: "simulasi" });
  }

  try {
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

    // Jika API error / quota habis → pakai fallback
    if (data.error || !data.choices?.[0]?.message?.content) {
      console.log("API ERROR:", data.error || "No content");
      const reply = fallbackReply(userMessage);
      return res.json({ reply, source: "simulasi" });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply, source: "OpenAI" });

  } catch (err) {
    console.error("Server Error:", err);
    const reply = fallbackReply(userMessage);
    res.json({ reply, source: "simulasi" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

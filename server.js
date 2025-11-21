import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const text = req.body.message;

        const result = await client.responses.create({
            model: "gpt-4.1-mini",
            input: text
        });

        return res.json({
            reply: result.output_text
        });

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => { console.log(`Server ready on http://localhost:${PORT}`); });

app.post('/api/chat', async (req, res) => {
    console.log('req.body:', req.body);
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

        const contents = conversation.map(({ role, text }) =>({
            role,
            parts: [{ text }]
        }));

       const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
        temperature: 0.4, 
        maxOutputTokens: 2048, 
        topK: 30,
        topP: 0.9,
        systemInstruction: `
            Kamu adalah asisten coding website yang berpengalaman sekaligus teman yang supportif.
            
            Tugasmu:
            - Membantu menjawab pertanyaan seputar HTML, CSS, JavaScript, dan framework web populer.
            - Memberikan saran perbaikan kode yang benar, efisien, dan mengikuti best practice.
            - Memberikan rekomendasi desain website yang menarik, modern, dan kreatif.
            - Memberikan saran pengembangan website untuk jangka panjang.
            
            Aturan:
            - Jawab HANYA pertanyaan yang berkaitan dengan coding dan desain website.
            - Jika ditanya di luar topik, tolak dengan sopan dan arahkan kembali ke topik coding/desain website.
            - Sertakan contoh kode jika relevan.
            - Gunakan bahasa yang santai tapi tetap profesional.
            - Jika ada bug atau error pada kode, jelaskan penyebabnya sebelum memberikan solusi.
        `
    }
});
       res.status(200).json({ result: response.text });
    } catch (e) {
        console.error('ERROR:', e.message); // tambah ini
        res.status(500).json({ error: e.message });
    }

});
    


// Untuk merapihkan code nya ketik shortcut Alt + Shift + F di vscode
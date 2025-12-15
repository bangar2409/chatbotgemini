// server.js

// 1. Mengambil variabel lingkungan dari .env
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3000; // Port standar untuk pengembangan lokal

// 2. Inisialisasi Gemini API dengan key yang aman dari .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash"; 

// Konfigurasi middleware
app.use(cors({
    // Izinkan semua domain/origin saat testing lokal
    origin: '*', 
    methods: ['GET', 'POST'],
}));
app.use(express.json()); // Agar bisa menerima data JSON dari frontend

// 3. Endpoint Chat API: Inilah yang akan dipanggil oleh JavaScript di index.html
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Pesan diperlukan' });
    }

    // Cek jika .env tidak terbaca
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY tidak ditemukan. Pastikan file .env sudah benar.");
        return res.status(500).json({ error: 'Konfigurasi server bermasalah.' });
    }

    try {
        // Panggil Gemini API
        const response = await ai.models.generateContent({
            model: model,
            contents: userMessage,
        });

        const botResponse = response.text;

        // Kirim balasan kembali ke frontend
        res.json({ response: botResponse });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'Terjadi kesalahan saat berkomunikasi dengan AI.' });
    }
});

// 4. Jalankan server
app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
    console.log("SEKARANG: Lanjut ke Fase 4 (Uji Coba Lokal)");
});
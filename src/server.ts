import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 10000;

app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ answer: "Question is required" });
        }

        res.json({ answer: `Tara (Agent) received: ${question}` }); 
        
    } catch (error) {
        res.status(500).json({ answer: "Server error" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
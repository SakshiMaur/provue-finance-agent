import express from 'express';
import dotenv from 'dotenv';
// Import your database functions here based on your file structure
// import { getPortfolioData } from './db'; 

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /ask Endpoint
app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        // Tumhara original database logic yahan hai
        // const data = await getPortfolioData(question);
        
        // Agar DB nahi mila to server error return karega
        res.json({ answer: "Server error" }); 
    } catch (error) {
        res.json({ answer: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
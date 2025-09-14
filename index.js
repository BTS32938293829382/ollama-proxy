import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const OLLAMA_API = process.env.OLLAMA_API;
const API_KEY = process.env.API_KEY;

app.use((req,res,next)=>{
    const key=req.headers["x-api-key"];
    if(key!==API_KEY) return res.status(401).json({error:"Unauthorized"});
    next();
});

app.post("/api/generate", async (req,res)=>{
    try{
        const {model,prompt} = req.body;
        const response = await axios.post(`${OLLAMA_API}/api/generate`, {model,prompt});
        res.json({model:response.data.model, response:response.data.response, done:response.data.done});
    }catch(err){
        console.error(err.response?.data||err.message);
        res.status(500).json({error:"Ollama API error"});
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>console.log(`Ollama Proxy HTTP running on port ${PORT}`));
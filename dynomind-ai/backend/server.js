import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI("AQ.Ab8RN6LQNi2yJ0KyiBZmmb33YTisZ0njSC9d_e63WCeZ9RyqDw");

// Rota para LER as motos
app.get('/api/bikes', (req, res) => {
  db.all("SELECT * FROM bikes ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Rota para CADASTRAR nova moto
app.post('/api/bikes', (req, res) => {
  const { model, year, plate, odometer } = req.body;
  const stmt = db.prepare("INSERT INTO bikes (model, year, plate, odometer) VALUES (?, ?, ?, ?)");
  stmt.run([model, year, plate, odometer], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: "Moto cadastrada com sucesso!" });
  });
});

// NOVA ROTA: Ler o histórico de uma moto específica
app.get('/api/maintenance/:bikeId', (req, res) => {
  db.all("SELECT * FROM maintenance WHERE bike_id = ? ORDER BY id DESC", [req.params.bikeId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// NOVA ROTA: Gravar um novo serviço/manutenção na moto
app.post('/api/maintenance', (req, res) => {
  const { bike_id, description, date, cost } = req.body;
  const stmt = db.prepare("INSERT INTO maintenance (bike_id, description, date, cost) VALUES (?, ?, ?, ?)");
  stmt.run([bike_id, description, date, cost], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: "Serviço gravado com sucesso!" });
  });
});

// Rota de Defeitos Crônicos
app.get('/api/defects/:model', (req, res) => {
  db.all("SELECT * FROM chronic_defects WHERE model LIKE ?", [`%${req.params.model}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota da Calculadora de Relação
app.post('/api/calculate-ratio', (req, res) => {
  const { original_pinhao, original_coroa, new_pinhao, new_coroa } = req.body;
  const ratioOriginal = original_coroa / original_pinhao;
  const ratioNovo = new_coroa / new_pinhao;
  const diferencaPercentual = ((ratioNovo - ratioOriginal) / ratioOriginal) * 100;
  
  let comportamento = diferencaPercentual > 0 ? "Relação mais CURTA: Maior aceleração." : diferencaPercentual < 0 ? "Relação mais LONGA: Maior velocidade final." : "Relação IDÊNTICA.";
  res.json({ ratioOriginal: ratioOriginal.toFixed(2), ratioNovo: ratioNovo.toFixed(2), diferencaPercentual: diferencaPercentual.toFixed(2) + "%", comportamento });
});

// Rota do Assistente de Inteligência Artificial
app.post('/api/chat', async (req, res) => {
  const { message, modelContext } = req.body;
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Tu és o DynoMind AI, Engenheiro de Competição Yamaha. O utilizador está com o modelo: ${modelContext}. Responde focado em mecânica.`;
    const result = await model.generateContent([prompt, message]);
    res.json({ text: (await result.response).text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, '127.0.0.1', () => console.log('Servidor DynoMind AI a rodar na porta 5000'));
const fs = require('fs');
const path = require('path');

const files = {
  // ================= BACKEND =================
  'dynomind-ai/backend/package.json': `{
  "name": "dynomind-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "@google/generative-ai": "^0.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "sqlite3": "^5.1.7"
  }
}`,

  'dynomind-ai/backend/.env': `GEMINI_API_KEY=COLE_SUA_CHAVE_AQUI`,

  'dynomind-ai/backend/database.js': `import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./dynomind.db', (err) => {
  if (err) console.error('Erro ao conectar ao SQLite:', err.message);
  else console.log('Conectado ao banco de dados SQLite.');
});

db.serialize(() => {
  db.run(\`CREATE TABLE IF NOT EXISTS bikes (id INTEGER PRIMARY KEY AUTOINCREMENT, model TEXT NOT NULL, year INTEGER, plate TEXT UNIQUE, odometer INTEGER)\`);
  db.run(\`CREATE TABLE IF NOT EXISTS maintenance (id INTEGER PRIMARY KEY AUTOINCREMENT, bike_id INTEGER, description TEXT, date TEXT, odometer INTEGER, cost REAL, FOREIGN KEY(bike_id) REFERENCES bikes(id))\`);
  db.run(\`CREATE TABLE IF NOT EXISTS preparations (id INTEGER PRIMARY KEY AUTOINCREMENT, bike_id INTEGER, remap TEXT, filter TEXT, exhaust TEXT, notes TEXT, FOREIGN KEY(bike_id) REFERENCES bikes(id))\`);
  db.run(\`CREATE TABLE IF NOT EXISTS chronic_defects (id INTEGER PRIMARY KEY AUTOINCREMENT, model TEXT NOT NULL, defect TEXT NOT NULL, symptom TEXT, solution TEXT)\`);

  db.get("SELECT COUNT(*) as count FROM chronic_defects", [], (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO chronic_defects (model, defect, symptom, solution) VALUES (?, ?, ?, ?)");
      stmt.run("MT-07", "Tensor da corrente de distribuição", "Barulho metálico forte na lateral do motor ao ligar a frio.", "Substituição pelo tensor mecânico ajustável ou peça original atualizada.");
      stmt.run("MT-09", "Sensor TPS", "Oscilação na marcha lenta, pequenos engasgos.", "Limpeza e substituição/calibração do sensor TPS.");
      stmt.run("YZF-R3", "Rolamento de embraiagem / Bomba de óleo", "Dificuldade em engatar mudanças.", "Verificação de recall de fábrica.");
      stmt.finalize();
    }
  });
});
export default db;`,

  'dynomind-ai/backend/server.js': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';
import { GoogleGenAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "SUA_API_KEY_AQUI" });

app.get('/api/defects/:model', (req, res) => {
  db.all("SELECT * FROM chronic_defects WHERE model LIKE ?", [\`%\${req.params.model}%\`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/calculate-ratio', (req, res) => {
  const { original_pinhao, original_coroa, new_pinhao, new_coroa } = req.body;
  const ratioOriginal = original_coroa / original_pinhao;
  const ratioNovo = new_coroa / new_pinhao;
  const diferencaPercentual = ((ratioNovo - ratioOriginal) / ratioOriginal) * 100;
  
  let comportamento = diferencaPercentual > 0 ? "Relação mais CURTA: Maior aceleração." : diferencaPercentual < 0 ? "Relação mais LONGA: Maior velocidade final." : "Relação IDÊNTICA.";
  res.json({ ratioOriginal: ratioOriginal.toFixed(2), ratioNovo: ratioNovo.toFixed(2), diferencaPercentual: diferencaPercentual.toFixed(2) + "%", comportamento });
});

app.post('/api/chat', async (req, res) => {
  const { message, modelContext } = req.body;
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = \`Tu és o DynoMind AI, Engenheiro de Competição Yamaha. O usuário está com o modelo: \${modelContext}. Responda focado em mecânica.\`;
    const result = await model.generateContent([prompt, message]);
    res.json({ text: (await result.response).text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Servidor DynoMind AI rodando na porta 5000'));`,

  // ================= FRONTEND =================
  'dynomind-ai/frontend/package.json': `{
  "name": "dynomind-frontend",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  }
}`,

  'dynomind-ai/frontend/vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,

  'dynomind-ai/frontend/tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        yamaha: { red: '#E60012', dark: '#121212', lightDark: '#1E1E1E', gray: '#F5F5F7' }
      }
    },
  },
  plugins: [],
}`,

  'dynomind-ai/frontend/postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'dynomind-ai/frontend/index.html': `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DynoMind AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  'dynomind-ai/frontend/src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #F5F5F7;
  color: #121212;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}`,

  'dynomind-ai/frontend/src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

  'dynomind-ai/frontend/src/App.jsx': `import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import MaintenanceLog from './components/MaintenanceLog';
import RatioCalculator from './components/RatioCalculator';
import AiAssistant from './components/AiAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBikeModel, setSelectedBikeModel] = useState('MT-07');

  return (
    <div className="flex h-screen bg-yamaha-gray">
      <div className="w-64 bg-yamaha-dark text-white flex flex-col justify-between border-r border-yamaha-red/20">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-3 h-6 bg-yamaha-red rounded-sm animate-pulse"></div>
            <h1 className="text-xl font-black tracking-wider text-white">DYNOMIND <span className="text-yamaha-red">AI</span></h1>
          </div>
          <nav className="mt-6 px-4 space-y-1">
            {[{id: 'dashboard', name: 'Dashboard'}, {id: 'maintenance', name: 'Manutenções'}, {id: 'ratio', name: 'Testador de Relação'}, {id: 'ai', name: 'Assistente Inteligente'}].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={\`w-full text-left px-4 py-3 rounded-md text-sm font-bold transition-all \${activeTab === tab.id ? 'bg-yamaha-red text-white' : 'text-gray-400 hover:bg-white/5'}\`}>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 bg-black/30">
          <select value={selectedBikeModel} onChange={(e) => setSelectedBikeModel(e.target.value)} className="w-full bg-yamaha-lightDark text-white rounded p-2 text-sm font-bold outline-none border border-white/10">
            <option value="MT-07">Yamaha MT-07</option>
            <option value="MT-09">Yamaha MT-09</option>
            <option value="YZF-R3">Yamaha YZF-R3</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white px-8 py-4 flex justify-between border-b">
          <h2 className="text-lg font-bold capitalize">{activeTab}</h2>
        </header>
        <main className="p-8">
          {activeTab === 'dashboard' && <Dashboard selectedBike={selectedBikeModel} />}
          {activeTab === 'maintenance' && <MaintenanceLog selectedBike={selectedBikeModel} />}
          {activeTab === 'ratio' && <RatioCalculator />}
          {activeTab === 'ai' && <AiAssistant selectedBike={selectedBikeModel} />}
        </main>
      </div>
    </div>
  );
}`,

  'dynomind-ai/frontend/src/components/Dashboard.jsx': `import React, { useState, useEffect } from 'react';
export default function Dashboard({ selectedBike }) {
  const [defects, setDefects] = useState([]);
  useEffect(() => {
    fetch(\`http://localhost:5000/api/defects/\${selectedBike}\`).then(res => res.json()).then(data => setDefects(data)).catch(console.error);
  }, [selectedBike]);

  return (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-yamaha-red p-6 rounded shadow-sm">
        <h3 className="text-2xl font-black">{selectedBike}</h3>
      </div>
      <div className="bg-white p-6 rounded shadow-sm border">
        <h4 className="font-extrabold uppercase border-b pb-3 mb-4">Defeitos Crônicos</h4>
        {defects.map(d => (
          <div key={d.id} className="bg-gray-50 p-4 mb-2 rounded border-l-2 border-yamaha-red">
            <h5 className="font-bold">{d.defect}</h5><p className="text-sm">Sintoma: {d.symptom}</p><p className="text-sm font-medium mt-1">Solução: {d.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,

  'dynomind-ai/frontend/src/components/MaintenanceLog.jsx': `import React from 'react';
export default function MaintenanceLog({ selectedBike }) {
  return (
    <div className="bg-white p-6 rounded shadow-sm border">
      <h3 className="text-xl font-bold mb-4">Diário de Manutenção: {selectedBike}</h3>
      <p className="text-gray-500">Módulo em construção. Aqui ficará a linha do tempo de trocas de óleo e peças.</p>
    </div>
  );
}`,

  'dynomind-ai/frontend/src/components/RatioCalculator.jsx': `import React, { useState } from 'react';
export default function RatioCalculator() {
  const [form, setForm] = useState({ oPinhao: 15, oCoroa: 43, nPinhao: 15, nCoroa: 45 });
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/calculate-ratio', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_pinhao: form.oPinhao, original_coroa: form.oCoroa, new_pinhao: form.nPinhao, new_coroa: form.nCoroa })
    });
    setResult(await res.json());
  };

  return (
    <div className="bg-white p-8 rounded shadow-sm border max-w-2xl">
      <h3 className="text-xl font-black mb-6">Calculadora Coroa x Pinhão</h3>
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="flex gap-4">
          <input type="number" placeholder="Pinhão Orig." value={form.oPinhao} onChange={e => setForm({...form, oPinhao: e.target.value})} className="border p-2 rounded w-full" />
          <input type="number" placeholder="Coroa Orig." value={form.oCoroa} onChange={e => setForm({...form, oCoroa: e.target.value})} className="border p-2 rounded w-full" />
        </div>
        <div className="flex gap-4">
          <input type="number" placeholder="Pinhão Novo" value={form.nPinhao} onChange={e => setForm({...form, nPinhao: e.target.value})} className="border p-2 rounded w-full" />
          <input type="number" placeholder="Coroa Nova" value={form.nCoroa} onChange={e => setForm({...form, nCoroa: e.target.value})} className="border p-2 rounded w-full" />
        </div>
        <button className="bg-yamaha-red text-white py-2 px-4 rounded font-bold w-full">Calcular Relação</button>
      </form>
      {result && <div className="mt-6 p-4 bg-yamaha-dark text-white rounded"><p>Relação Antiga: {result.ratioOriginal} | Nova: {result.ratioNovo}</p><p className="text-yamaha-red font-bold mt-2">{result.comportamento}</p></div>}
    </div>
  );
}`,

  'dynomind-ai/frontend/src/components/AiAssistant.jsx': `import React, { useState } from 'react';
export default function AiAssistant({ selectedBike }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ sender: 'ai', text: \`Olá! Sou o DynoMind AI. Como ajudo com a \${selectedBike}?\` }]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const currentInput = input; setInput('');
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, modelContext: selectedBike })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Erro de conexão com o servidor.' }]);
    }
  };

  return (
    <div className="bg-white border rounded shadow-sm h-[500px] flex flex-col">
      <div className="p-4 bg-yamaha-dark text-white font-bold">Assistente DynoMind</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={\`p-3 rounded-lg max-w-[80%] \${m.sender === 'user' ? 'bg-yamaha-red text-white ml-auto' : 'bg-gray-100 text-black'}\`}>{m.text}</div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Faça uma pergunta..." />
        <button className="bg-yamaha-dark text-white px-4 rounded font-bold">Enviar</button>
      </form>
    </div>
  );
}`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf-8');
  console.log("✅ Criado: " + filePath);
});

console.log("\n🚀 SUCESSO! Estrutura criada. Próximos passos:");
console.log("1. cd dynomind-ai/backend && npm install && npm start");
console.log("2. Num outro terminal: cd dynomind-ai/frontend && npm install && npm run dev");
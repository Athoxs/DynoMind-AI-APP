import React, { useState } from 'react';

export default function AiAssistant({ selectedBike }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Olá! Sou o Engenheiro DynoMind AI. Como ajudo com a ${selectedBike}?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Atualizado para 127.0.0.1 para evitar o bloqueio do navegador
      const res = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, modelContext: selectedBike })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      } else {
        // Agora a IA vai dizer exatamente qual foi o erro!
        setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ERRO DE IA: ${data.error}. (Já colocaste a tua GEMINI_API_KEY no ficheiro .env do backend?)` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `❌ Erro de conexão. O terminal do backend (npm start) está a rodar?` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm flex flex-col h-[600px]">
      <div className="bg-yamaha-dark p-4 rounded-t flex items-center gap-3">
        <div className="w-2 h-2 bg-yamaha-red rounded-full animate-pulse"></div>
        <h3 className="text-white font-black uppercase tracking-widest text-sm">Assistente DynoMind</h3>
        <span className="text-[10px] text-gray-400 font-mono bg-white/10 px-2 py-0.5 rounded ml-auto">MODELO ALVO: {selectedBike}</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded text-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-yamaha-red text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded rounded-bl-none shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white rounded-b flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Pergunte sobre mecânica, telemetria ou defeitos..."
          className="flex-1 border border-gray-300 p-2.5 rounded text-sm focus:border-yamaha-red outline-none"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-yamaha-dark text-white px-6 font-black text-xs uppercase tracking-widest rounded hover:bg-black transition-colors disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
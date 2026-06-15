import React, { useState } from 'react';
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
}
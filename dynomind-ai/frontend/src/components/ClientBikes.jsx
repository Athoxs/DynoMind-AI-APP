import React, { useState, useEffect } from 'react';

export default function ClientBikes({ onBikeRegistered }) {
  const [bikes, setBikes] = useState([]);
  const [form, setForm] = useState({ model: 'MT-07', year: '', plate: '', odometer: '', owner: '' });
  
  const [checklist, setChecklist] = useState({
    oleo: false,
    pastilhas: false,
    fluidos: false,
    pneus: false,
    corrente: false
  });

  const fetchBikes = () => {
    // Trocado de localhost para 127.0.0.1
    fetch('http://127.0.0.1:5000/api/bikes')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setBikes(data); })
      .catch(console.error);
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plate || !form.owner) {
      return alert('⚠️ Por favor, preencha o Proprietário e a Placa da moto.');
    }

    try {
      // Trocado de localhost para 127.0.0.1
      const res = await fetch('http://127.0.0.1:5000/api/bikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: form.model,
          year: Number(form.year) || 2018,
          plate: form.plate.toUpperCase(),
          odometer: Number(form.odometer) || 0
        })
      });

      if (res.ok) {
        fetchBikes();
        onBikeRegistered();
        setForm({ model: 'MT-07', year: '', plate: '', odometer: '', owner: '' });
        setChecklist({ oleo: false, pastilhas: false, fluidos: false, pneus: false, corrente: false });
        alert('✅ Moto do cliente cadastrada com sucesso com o checklist de entrada!');
      } else {
        const errorData = await res.json();
        if (errorData.error && errorData.error.includes('UNIQUE')) {
          alert('⚠️ ERRO: Esta placa já está cadastrada no pátio da oficina!');
        } else {
          alert('⚠️ ERRO NO SERVIDOR: ' + errorData.error);
        }
      }
    } catch (err) {
      console.error(err);
      alert('❌ ERRO DE CONEXÃO: O servidor Backend parece estar desligado. Verifique se o terminal com "npm start" está rodando na porta 5000.');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white p-6 rounded border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-3">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Ordem de Entrada de Veículo</h3>
          <p className="text-xs text-gray-500 mt-1">Cadastre os dados do cliente e execute a checagem pericial de pista.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nome do Cliente / Proprietário</label>
              <input type="text" value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none" placeholder="Ex: João Silva" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Modelo Yamaha</label>
              <select value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none font-semibold">
                <option value="MT-07">Yamaha MT-07</option>
                <option value="MT-09">Yamaha MT-09</option>
                <option value="YZF-R3">Yamaha YZF-R3</option>
                <option value="Tracer 900GT">Yamaha Tracer 900GT</option>
                <option value="Ténéré 700">Yamaha Ténéré 700</option>
                <option value="YZF-R15">Yamaha YZF-R15 (2018)</option>
                <option value="YZF-R6">Yamaha YZF-R6 (2018)</option>
                <option value="MT-03">Yamaha MT-03 (2018)</option>
                <option value="YZF-R1">Yamaha YZF-R1 (2018)</option>
                <option value="XT 660R">Yamaha XT 660R (Último Mod.)</option>
                <option value="Lander 250">Yamaha Lander 250 (2018)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Placa do Veículo</label>
              <input type="text" value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none font-mono uppercase" placeholder="ABC1D23" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Ano</label>
                <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none" placeholder="2018" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Odômetro (KM)</label>
                <input type="number" value={form.odometer} onChange={e => setForm({...form, odometer: e.target.value})} className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none" placeholder="12500" />
              </div>
            </div>
          </div>

          <div className="bg-yamaha-gray/50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-xs font-black text-gray-900 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-yamaha-red rounded-sm"></span>
              Checklist Inicial de Oficina (Inspeção de Segurança)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'oleo', label: 'Nível & Condição do Óleo do Motor OK' },
                { id: 'pastilhas', label: 'Pastilhas de Travão / Freio OK' },
                { id: 'fluidos', label: 'Fluido de Arrefecimento & Radiador OK' },
                { id: 'pneus', label: 'Pressão & Desgaste dos Pneus OK' },
                { id: 'corrente', label: 'Tensão & Lubrificação da Corrente OK' }
              ].map(item => (
                <label key={item.id} className="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-200 shadow-sm cursor-pointer select-none hover:border-yamaha-red/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checklist[item.id]} 
                    onChange={e => setChecklist({...checklist, [item.id]: e.target.checked})}
                    className="w-4 h-4 accent-yamaha-red border-gray-300 rounded" 
                  />
                  <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-yamaha-red text-white py-2.5 rounded font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-md shadow-yamaha-red/20 transition-all">
            Salvar Ficha do Cliente & Registrar Entrada
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm h-fit">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight border-b pb-3 mb-4">Motos no Box da Oficina</h3>
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {bikes.length > 0 ? bikes.map(b => (
            <div key={b.id} className="p-3 bg-yamaha-dark text-white rounded border-l-4 border-yamaha-red flex justify-between items-center shadow-sm">
              <div>
                <h5 className="font-black text-xs text-white uppercase tracking-wide">{b.model} <span className="text-[10px] text-gray-400 font-normal">({b.year})</span></h5>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">Placa: {b.plate}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">KM Atual: {b.odometer.toLocaleString()} km</p>
              </div>
              <span className="text-[9px] font-black tracking-wider bg-white/10 px-2 py-1 rounded text-yamaha-red border border-yamaha-red/20 uppercase">
                Em Diagnóstico
              </span>
            </div>
          )) : (
            <p className="text-xs text-gray-400 italic text-center py-4">Nenhuma moto ativa no pátio.</p>
          )}
        </div>
      </div>
    </div>
  );
}
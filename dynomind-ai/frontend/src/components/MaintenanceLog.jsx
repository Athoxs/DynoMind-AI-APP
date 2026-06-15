import React, { useState, useEffect } from 'react';

export default function MaintenanceLog() {
  const [clientBikes, setClientBikes] = useState([]);
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [logs, setLogs] = useState([]);

  // Data automática de hoje
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const [form, setForm] = useState({ type: 'Manutenção', stage: 'Stage 1', description: '', date: dataHoje, cost: '' });

  // 1. Carrega as motos dos clientes que estão no banco de dados
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/bikes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClientBikes(data);
          if (data.length > 0 && !selectedBikeId) {
            setSelectedBikeId(data[0].id); // Seleciona a primeira moto por padrão
          }
        }
      })
      .catch(console.error);
  }, []);

  // 2. Carrega o histórico de manutenções sempre que a moto selecionada muda
  useEffect(() => {
    if (!selectedBikeId) return;
    fetch(`http://127.0.0.1:5000/api/maintenance/${selectedBikeId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(console.error);
  }, [selectedBikeId]);

  // 3. Salva o novo serviço no banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBikeId) return alert('⚠️ Cadastre e selecione uma moto de cliente primeiro!');
    if (!form.description) return alert('⚠️ Por favor, escreva o serviço realizado (ex: Troca de bobinas).');

    // Formata o texto para ficar bonito no histórico com a tag de preparação ou manutenção
    const tag = form.type === 'Preparação' ? `[PREPARAÇÃO - ${form.stage}]` : `[MANUTENÇÃO]`;
    const finalDescription = `${tag} ${form.description}`;

    try {
      const res = await fetch('http://127.0.0.1:5000/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bike_id: selectedBikeId,
          description: finalDescription,
          date: form.date,
          cost: Number(form.cost) || 0
        })
      });

      if (res.ok) {
        // Recarrega a lista para mostrar o novo serviço instantaneamente
        fetch(`http://127.0.0.1:5000/api/maintenance/${selectedBikeId}`)
          .then(r => r.json())
          .then(d => setLogs(d));

        setForm({ ...form, description: '', cost: '' });
        alert('✅ Serviço injetado na linha do tempo com sucesso!');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Erro de Conexão com o banco de dados.');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Coluna 1: Formulário de Inserção */}
      <div className="xl:col-span-1 bg-white p-6 rounded border border-gray-200 shadow-sm space-y-4 h-fit">
        <div className="border-b pb-3">
          <h3 className="text-md font-black text-gray-900 uppercase tracking-tight">Ficha de Modificação & Box</h3>
          <p className="text-xs text-gray-500 mt-1">Selecione a moto no pátio e registe as intervenções (ex: pastilhamento).</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SELETOR DINÂMICO DA MOTO DO CLIENTE */}
          <div>
            <label className="text-xs font-bold text-yamaha-red block mb-1 uppercase tracking-widest">Moto do Cliente no Pátio</label>
            <select 
              value={selectedBikeId} 
              onChange={e => setSelectedBikeId(e.target.value)} 
              className="w-full border-2 border-yamaha-red/20 p-2 rounded text-sm focus:border-yamaha-red outline-none font-bold bg-red-50/10"
            >
              {clientBikes.length === 0 && <option value="">Nenhuma moto cadastrada...</option>}
              {clientBikes.map(bike => (
                <option key={bike.id} value={bike.id}>
                  {bike.plate} - {bike.model} ({bike.owner})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Tipo de Entrada</label>
            <select 
              value={form.type} 
              onChange={e => setForm({...form, type: e.target.value})} 
              className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none font-semibold"
            >
              <option value="Manutenção">Manutenção Preventiva / Correção</option>
              <option value="Preparação">Preparação & Performance</option>
            </select>
          </div>

          {form.type === 'Preparação' && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Configuração de Potência</label>
              <select 
                value={form.stage} 
                onChange={e => setForm({...form, stage: e.target.value})} 
                className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none font-bold text-yamaha-red bg-red-50/30"
              >
                <option value="Stage 1">Stage 1 (Filtro + Remap)</option>
                <option value="Stage 2">Stage 2 (Filtro + Escape + Remap)</option>
                <option value="Stage 3">Stage 3 (Upgrades de Motor)</option>
                <option value="Custom Map">Custom Map (Acerto Customizado)</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">O que foi feito? (Detalhes Técnicos)</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              rows="4"
              placeholder="Ex: Necessita pastilhamento de válvula, substituição das 4 bobinas de ignição e troca do retentor da bomba de água."
              className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Data</label>
              <input type="text" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none text-center font-mono" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Custo (R$)</label>
              <input type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} placeholder="0.00" className="w-full border p-2 rounded text-sm focus:border-yamaha-red outline-none font-bold" />
            </div>
          </div>

          <button type="submit" className="w-full bg-yamaha-red text-white py-2.5 rounded font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-md shadow-yamaha-red/20 transition-all">
            Gravar no Histórico da Moto
          </button>
        </form>
      </div>

      {/* Coluna 2: Linha do Tempo de Modificações */}
      <div className="xl:col-span-2 bg-white p-6 rounded border border-gray-200 shadow-sm">
        <div className="border-b pb-3 mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-md font-black text-gray-900 uppercase tracking-tight">Linha do Tempo de Engenharia</h3>
            <p className="text-xs text-gray-500 mt-1">Histórico de todas as intervenções realizadas nesta placa.</p>
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-10 border border-dashed border-gray-300 rounded">
              Nenhum serviço registrado para esta moto ainda.
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="relative pl-6 border-l-2 border-gray-200 last:border-l-0 pb-2">
                <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${log.description.includes('[PREPARAÇÃO') ? 'bg-yamaha-red shadow-[0_0_8px_rgba(230,0,12,0.8)]' : 'bg-gray-400'}`}></div>
                
                <div className="bg-yamaha-gray/30 p-4 rounded border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 font-mono font-bold bg-white px-2 py-1 border rounded">{log.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap">{log.description}</p>
                  </div>
                  
                  <div className="text-left md:text-right md:border-l md:pl-4 border-gray-200 shrink-0">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Custo de Peças/Mão de Obra</span>
                    <span className="text-sm font-black text-gray-900">R$ {log.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
import React, { useState, useEffect } from 'react';

// Mapeamento visual com os nomes EXATOS dos teus ficheiros de imagem
const bikeVisualData = {
  'MT-07': {
    accentText: "CP2 - Torque Linear Crossplane",
    hp: "74.8 CV",
    torque: "6.9 kgf.m",
    colorPattern: "border-red-600 shadow-red-600/50",
    imageSrc: "/images/MT-07.png"
  },
  'MT-09': {
    accentText: "CP3 - Tricilíndrico Hyper Naked",
    hp: "119 CV",
    torque: "9.5 kgf.m",
    colorPattern: "border-red-600 shadow-red-600/60",
    imageSrc: "/images/MT-09.png"
  },
  'YZF-R3': {
    accentText: "R-Series - DNA Supersport de Pista",
    hp: "42 CV",
    torque: "3.0 kgf.m",
    colorPattern: "border-red-500 shadow-red-500/50",
    imageSrc: "/images/R3.png"
  },
  'Tracer 900GT': {
    accentText: "Sport Touring - Performance de Viagem",
    hp: "115 CV",
    torque: "8.9 kgf.m",
    colorPattern: "border-red-600 shadow-red-600/50",
    imageSrc: "/images/TRACER900GT.png"
  },
  'Ténéré 700': {
    accentText: "Rally Adventure - Espírito Dakar",
    hp: "73.4 CV",
    torque: "6.9 kgf.m",
    colorPattern: "border-gray-500 shadow-gray-500/40",
    imageSrc: "/images/TENERE700.png"
  },
  'YZF-R15': {
    accentText: "Pocket Rocket - Linha R-Series 2018",
    hp: "19 CV",
    torque: "1.5 kgf.m",
    colorPattern: "border-red-400 shadow-red-400/40",
    imageSrc: "/images/R15.png"
  },
  'YZF-R6': {
    accentText: "Supersport de Competição 2018",
    hp: "118 CV",
    torque: "6.3 kgf.m",
    colorPattern: "border-red-600 shadow-red-600/70",
    imageSrc: "/images/R6.png"
  },
  'MT-03': {
    accentText: "Master of Torque Bicilíndrica 2018",
    hp: "42 CV",
    torque: "3.0 kgf.m",
    colorPattern: "border-red-500 shadow-red-500/50",
    imageSrc: "/images/MT-03.png"
  },
  'YZF-R1': {
    accentText: "M1 MotoGP Replica - Superbike 2018",
    hp: "200 CV",
    torque: "11.5 kgf.m",
    colorPattern: "border-red-600 shadow-[0_0_25px_rgba(230,0,12,0.8)]",
    imageSrc: "/images/R1.png"
  },
  'XT 660R': {
    accentText: "Trator Monocilíndrico - Despedida 2018",
    hp: "48 CV",
    torque: "5.95 kgf.m",
    colorPattern: "border-red-700 shadow-red-700/60",
    imageSrc: "/images/XT660.png"
  },
  'Lander 250': {
    accentText: "On/Off-Road Adventure Trail 2018",
    hp: "20.7 CV",
    torque: "2.1 kgf.m",
    colorPattern: "border-red-400 shadow-red-400/30",
    imageSrc: "/images/LANDER250.png"
  }
};

export default function Dashboard({ selectedBike, refreshTrigger }) {
  const [defects, setDefects] = useState([]);
  const [stats, setStats] = useState({ totalClientBikes: 0 });
  const bikeDesign = bikeVisualData[selectedBike] || bikeVisualData['MT-07'];

  useEffect(() => {
    fetch(`http://localhost:5000/api/defects/${selectedBike}`)
      .then(res => res.json())
      .then(data => setDefects(data))
      .catch(err => console.error(err));
  }, [selectedBike]);

  useEffect(() => {
    fetch('http://localhost:5000/api/bikes')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setStats({ totalClientBikes: data.length }); })
      .catch(console.error);
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel Esquerdo com Telemetria */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded border-l-4 border-yamaha-red shadow-sm">
            <span className="text-xs font-bold text-yamaha-red uppercase tracking-widest block">Catálogo Oficial DynoMind</span>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">{selectedBike}</h3>
            <p className="text-gray-500 text-sm mt-1">Status de engenharia técnica e análise preditiva de box.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Clientes na Oficina</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-gray-900">{stats.totalClientBikes}</span>
                <span className="text-xs text-emerald-600 font-bold">Ativos no Box</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Especificação Dinâmica</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-yamaha-red">{bikeDesign.hp}</span>
                <span className="text-xs text-gray-400 font-semibold">{bikeDesign.torque} Torque</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: EMBALAGEM VISUAL RACING PREMIUM COM A SUA FOTO */}
        <div className="bg-yamaha-dark rounded-lg p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          {/* Linhas de Grade Estilo Grid de Largada ao Fundo */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] bg-[size:20px_20px]"></div>
          
          {/* Canto de Corrida Iluminado */}
          <div className={`absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 rounded-tr-lg ${bikeDesign.colorPattern} border-yamaha-red transition-all duration-300`}></div>
          
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest bg-yamaha-red px-2 py-0.5 rounded text-white inline-block mb-2">LIVE MONITOR</span>
            <h4 className="text-xl font-black tracking-tight text-white">{selectedBike}</h4>
            <p className="text-xs text-gray-400 font-medium italic mt-0.5">{bikeDesign.accentText}</p>
          </div>

          {/* FRAME DE CORRIDA E FOTO DA MOTO */}
          <div className="relative z-10 flex justify-end mt-4">
            <div className="bg-black/60 w-56 h-32 flex items-center justify-center border-2 border-white/10 rounded-lg p-1.5 relative overflow-hidden shadow-inner group hover:border-yamaha-red/40 transition-colors">
              
              <div className="absolute top-1 left-1 text-[8px] font-mono text-white/20 font-black">SYS.SYS</div>
              <div className="absolute bottom-1 left-2 text-[8px] font-mono tracking-widest text-white/30 font-bold uppercase">BRANCA | 2018</div>
              
              <img 
                src={bikeDesign.imageSrc} 
                alt={selectedBike} 
                className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              <div className="hidden text-[10px] font-bold text-gray-500 italic text-center p-2">
                Imagem não encontrada
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Caixa de Diagnósticos */}
      <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
        <h4 className="text-md font-extrabold text-gray-900 tracking-wider uppercase border-b pb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-yamaha-red rounded-full"></span>
          Alertas de Oficina & Diagnóstico Crônico Sincronizado
        </h4>
        <div className="mt-4 space-y-3">
          {defects.length > 0 ? defects.map((d) => (
            <div key={d.id} className="bg-yamaha-gray/40 p-4 rounded border-l-4 border-yamaha-red">
              <h5 className="font-black text-gray-900 text-sm">{d.defect}</h5>
              <p className="text-xs text-gray-600 mt-1"><strong>Sintoma Identificado:</strong> {d.symptom}</p>
              <p className="text-xs text-gray-800 font-semibold mt-2 bg-white p-2 rounded border border-gray-100"><strong>Solução de Engenharia:</strong> {d.solution}</p>
            </div>
          )) : (
            <p className="text-sm text-gray-500 italic">Nenhum alerta crítico documentado para este modelo.</p>
          )}
        </div>
      </div>
    </div>
  );
}
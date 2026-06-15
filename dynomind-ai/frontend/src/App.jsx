import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import MaintenanceLog from './components/MaintenanceLog';
import RatioCalculator from './components/RatioCalculator';
import AiAssistant from './components/AiAssistant';
import ClientBikes from './components/ClientBikes';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBikeModel, setSelectedBikeModel] = useState('MT-07');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBikeRegistered = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-yamaha-gray">
      {/* Sidebar */}
      <div className="w-64 bg-yamaha-dark text-white flex flex-col justify-between border-r border-yamaha-red/25">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-3 h-6 bg-yamaha-red rounded-sm animate-pulse"></div>
            <h1 className="text-xl font-black tracking-wider text-white">DYNOMIND <span className="text-yamaha-red">AI</span></h1>
          </div>
          <nav className="mt-6 px-4 space-y-1">
            {[
              { id: 'dashboard', name: 'Dashboard Racing' },
              { id: 'clients', name: 'Motos dos Clientes & Check' },
              { id: 'maintenance', name: 'Histórico de Manutenções' },
              { id: 'ratio', name: 'Testador de Relação' },
              { id: 'ai', name: 'Assistente Inteligente' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold tracking-wide transition-all ${
                  activeTab === tab.id 
                    ? 'bg-yamaha-red text-white shadow-lg shadow-yamaha-red/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/30">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Modelo de Referência:</label>
          <select 
            value={selectedBikeModel} 
            onChange={(e) => setSelectedBikeModel(e.target.value)}
            className="w-full bg-yamaha-lightDark border border-white/10 text-white rounded p-2 text-sm font-bold focus:border-yamaha-red outline-none"
          >
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
      </div>

      {/* Main Content View */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest bg-yamaha-red text-white px-2 py-0.5 rounded">YAMAHA CORSE</span>
            <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab === 'dashboard' ? 'Painel de Performance' : activeTab}</h2>
          </div>
          <div className="text-sm font-semibold text-gray-500">Mecânica de Alta Performance</div>
        </header>

        <main className="p-8">
          {activeTab === 'dashboard' && <Dashboard selectedBike={selectedBikeModel} refreshTrigger={refreshTrigger} />}
          {activeTab === 'clients' && <ClientBikes onBikeRegistered={handleBikeRegistered} />}
          {activeTab === 'maintenance' && <MaintenanceLog selectedBike={selectedBikeModel} />}
          {activeTab === 'ratio' && <RatioCalculator />}
          {activeTab === 'ai' && <AiAssistant selectedBike={selectedBikeModel} />}
        </main>
      </div>
    </div>
  );
}
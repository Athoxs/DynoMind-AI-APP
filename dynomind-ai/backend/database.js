import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./dynomind.db', (err) => {
  if (err) console.error('Erro ao conectar ao SQLite:', err.message);
  else console.log('Conectado ao banco de dados SQLite.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bikes (id INTEGER PRIMARY KEY AUTOINCREMENT, model TEXT NOT NULL, year INTEGER, plate TEXT UNIQUE, odometer INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS maintenance (id INTEGER PRIMARY KEY AUTOINCREMENT, bike_id INTEGER, description TEXT, date TEXT, odometer INTEGER, cost REAL, FOREIGN KEY(bike_id) REFERENCES bikes(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS preparations (id INTEGER PRIMARY KEY AUTOINCREMENT, bike_id INTEGER, remap TEXT, filter TEXT, exhaust TEXT, notes TEXT, FOREIGN KEY(bike_id) REFERENCES bikes(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS chronic_defects (id INTEGER PRIMARY KEY AUTOINCREMENT, model TEXT NOT NULL, defect TEXT NOT NULL, symptom TEXT, solution TEXT)`);

  // Sincronização completa do catálogo estendido
  db.run("DELETE FROM chronic_defects", [], () => {
    const stmt = db.prepare("INSERT INTO chronic_defects (model, defect, symptom, solution) VALUES (?, ?, ?, ?)");
    
    // Modelos Anteriores
    stmt.run("MT-07", "Tensor da corrente de distribuição", "Barulho metálico forte na lateral do motor ao ligar a frio.", "Substituição pelo tensor mecânico ajustável ou peça original atualizada.");
    stmt.run("MT-09", "Sensor TPS (Throttle Position Sensor)", "Oscilação na marcha lenta, pequenos engasgos ou cortes em aceleração constante.", "Limpeza preventiva do corpo de borboletas e substituição/calibração do sensor TPS.");
    stmt.run("YZF-R3", "Rolamento de embreagem / Bomba de óleo", "Dificuldade em engatar marchas ou superaquecimento prematuro.", "Verificação de recall de fábrica e substituição do kit de rolamento.");
    stmt.run("Tracer 900GT", "Oscilação frontal em alta velocidade (Wobble)", "Instabilidade ou vibração no guidão acima de 160 km/h com carga ou baú traseiro.", "Ajuste de pré-carga da suspensão traseira, alinhamento das bengalas e calibragem rigorosa.");
    stmt.run("Ténéré 700", "Oxidação nos raios das rodas de fábrica", "Pontos de ferrugem acumulados nos raios após condução sob chuva ou terra.", "Aplicação preventiva de spray protetor hidrofóbico ou substituição por raios de inox.");

    // Novos Modelos Solicitados (Linha 2018 / Último Modelo)
    stmt.run("YZF-R15", "Ruído no acionador do tensor de corrente", "Ruído metálico intermitente no lado direito do motor em marcha lenta (Modelo 2018).", "Substituição do tensionador por uma unidade reforçada da linha de competição.");
    stmt.run("YZF-R6", "Falha de ignição em alta rotação (Bobinas Coils)", "Pequenos cortes de potência acima de 10.000 RPM sob aceleração máxima (Modelo 2018).", "Substituição preventiva do kit de bobinas originais e limpeza dos conectores de velas.");
    stmt.run("MT-03", "Vazamento no retentor da bomba d'água", "Baixa constante no nível do fluido de arrefecimento com marcas embaixo do motor (Modelo 2018).", "Substituição do retentor mecânico da bomba d'água e lavagem do sistema de refrigeração.");
    stmt.run("YZF-R1", "Desgaste prematuro nos tuchos mecânicos das válvulas", "Estalos finos no cabeçote acompanhados de perda sutil de rendimento em pista (Modelo 2018).", "Inspeção de folga de válvulas a cada 15.000 km e troca dos tuchos fora de tolerância.");
    stmt.run("XT 660R", "Falha ou engasgo brusco no Sensor TPS", "Trancos em baixas rotações ao retomar o acelerador ou desligamento em semáforos (Modelo 2018/Último).", "Substituição do sensor TPS por um componente original indexado e vedação extra contra umidade.");
    stmt.run("Lander 250", "Folga e estalo no link da suspensão traseira", "Barulho seco na traseira ao passar por ondulações ou ao subir na moto (Modelo 2018).", "Substituição das buchas do link traseiro por buchas de bronze grafitado ou rolamentos blindados.");
    
    stmt.finalize();
    console.log("🚀 Catálogo DynoMind atualizado: 11 modelos Yamaha ativos na base!");
  });
});

export default db;
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const segments = [
  {
    name: 'Segurança Eletrônica',
    lines: ['Câmeras VIP & CFTV', 'Gravadores NVR & DVR', 'Alarmes & Sensores'],
    products: [
      { name: 'Câmera VIP 3230 B Full HD', price: 349.90, costRatio: 0.58 },
      { name: 'Gravador NVR NVD 3316 4K', price: 1890.00, costRatio: 0.62 },
      { name: 'Câmera Speed Dome VHD 5230 SD', price: 2950.00, costRatio: 0.65 },
      { name: 'Sensor Infravermelho Passivo IVP 3000', price: 129.90, costRatio: 0.52 },
      { name: 'Central de Alarme AMT 8000 Pro', price: 980.00, costRatio: 0.60 }
    ]
  },
  {
    name: 'Redes & Conectividade',
    lines: ['Switches Corporativos', 'Wi-Fi 6 Mesh', 'Roteadores Empresariais'],
    products: [
      { name: 'Switch Gerenciável SG 2404 PoE Max', price: 2450.00, costRatio: 0.64 },
      { name: 'Roteador Mesh Twibi Force AX (Par)', price: 799.00, costRatio: 0.57 },
      { name: 'Roteador Corporativo Action RG 1200', price: 389.00, costRatio: 0.55 },
      { name: 'Access Point Corporativo AP 1250 AC', price: 680.00, costRatio: 0.61 },
      { name: 'Switch 8 Portas Gigabit SF 800 G', price: 199.90, costRatio: 0.50 }
    ]
  },
  {
    name: 'Controle de Acesso & IoT',
    lines: ['Fechaduras Digitais Smart', 'Terminais Faciais & Biometria', 'Interfonia Predial'],
    products: [
      { name: 'Fechadura Digital Biométrica FR 500', price: 1450.00, costRatio: 0.59 },
      { name: 'Fechadura Smart Zigbee IFR 7000', price: 1890.00, costRatio: 0.62 },
      { name: 'Terminal Facial SS 3540 MF', price: 3600.00, costRatio: 0.68 },
      { name: 'Interfone Coletivo Collective 12', price: 890.00, costRatio: 0.56 },
      { name: 'Vídeo Porteiro Wi-Fi Allo W5+', price: 620.00, costRatio: 0.54 }
    ]
  },
  {
    name: 'Energia & Solar',
    lines: ['No-breaks Senoidais', 'Energia Solar On-Grid', 'Protetores Eletrônicos'],
    products: [
      { name: 'No-break Senoidal ATTIV 1500VA', price: 1150.00, costRatio: 0.63 },
      { name: 'Inversor Solar On-Grid 5kW EGT 5000', price: 6800.00, costRatio: 0.72 },
      { name: 'Módulo Solar Fotovoltaico 550W', price: 820.00, costRatio: 0.70 },
      { name: 'No-break DNB 3.0 kVA Torre', price: 4200.00, costRatio: 0.67 },
      { name: 'Protetor Eletrônico EPS 301', price: 69.90, costRatio: 0.48 }
    ]
  },
  {
    name: 'Comunicação & Telefonia',
    lines: ['PABX & Centrais Híbridas', 'Telefonia IP & Terminais', 'Headsets Corporativos'],
    products: [
      { name: 'Central PABX Impacta 68i', price: 2190.00, costRatio: 0.61 },
      { name: 'Telefone IP TIP 125 Lite', price: 349.00, costRatio: 0.53 },
      { name: 'Headset Profissional CHS 55 USB', price: 219.00, costRatio: 0.49 },
      { name: 'Terminal Executivo TE 220', price: 189.00, costRatio: 0.50 }
    ]
  }
];

const clients = [
  'Prosegur Tecnologia Brasil', 'Supermercados Angeloni', 'Condomínio Residencial Alphaville',
  'TechNet Telecomunicações', 'Distribuidora Santa Rita', 'Hospital Regional São José',
  'Prefeitura Municipal de Joinville', 'Cooperativa Sicredi', 'Logística Express S.A.',
  'Shopping Plaza Norte', 'Colégio Dom Bosco', 'Construtora Silva & Ramos',
  'Rede D\'Or São Luiz', 'Viação Catarinense', 'Universidade do Vale (Univali)'
];

const reps = [
  { name: 'Carlos Eduardo Mendes', region: 'Sul', state: 'SC' },
  { name: 'Mariana Vasconcelos', region: 'Sudeste', state: 'SP' },
  { name: 'Rodrigo Silveira', region: 'Sul', state: 'PR' },
  { name: 'Ana Paula Guimarães', region: 'Sudeste', state: 'RJ' },
  { name: 'Fernando Albuquerque', region: 'Nordeste', state: 'BA' },
  { name: 'Juliana Fontes', region: 'Sudeste', state: 'MG' },
  { name: 'Lucas Pinheiro', region: 'Centro-Oeste', state: 'GO' },
  { name: 'Beatriz Nogueira', region: 'Nordeste', state: 'PE' }
];

const channels = [
  'Distribuidor Autorizado',
  'Revenda Especializada',
  'Integrador / Projetos Especiais',
  'Varejo Corporativo'
];

const statuses = ['Entregue', 'Entregue', 'Entregue', 'Faturado', 'Em Trânsito', 'Pendente'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate rows across Jan 2025 - Dec 2025 & Jan-Aug 2026
const rows = [];
let nfCounter = 104200;

const startDate = new Date(2025, 0, 5);
const endDate = new Date(2026, 7, 10);

const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

for (let i = 0; i < 850; i++) {
  const dayOffset = Math.floor(Math.random() * totalDays);
  const saleDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  const dateStr = saleDate.toISOString().split('T')[0];

  const segment = getRandomItem(segments);
  const product = getRandomItem(segment.products);
  const rep = getRandomItem(reps);
  const client = getRandomItem(clients);
  const channel = getRandomItem(channels);
  const status = getRandomItem(statuses);

  const qty = getRandomInt(1, product.price > 3000 ? 6 : product.price > 1000 ? 15 : 45);
  // minor price variation +- 5%
  const discountMultiplier = 1 - (Math.random() * 0.08);
  const unitPrice = +(product.price * discountMultiplier).toFixed(2);
  const unitCost = +(product.price * product.costRatio).toFixed(2);
  const totalRevenue = +(unitPrice * qty).toFixed(2);
  const totalCost = +(unitCost * qty).toFixed(2);
  const grossProfit = +(totalRevenue - totalCost).toFixed(2);
  const marginPct = +((grossProfit / totalRevenue) * 100).toFixed(1);
  const leadTime = getRandomInt(2, 10);

  rows.push({
    'ID_Venda': `NF-${nfCounter++}`,
    'Data': dateStr,
    'Ano': saleDate.getFullYear(),
    'Mes': saleDate.getMonth() + 1,
    'Ano_Mes': `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`,
    'Cliente': client,
    'Vendedor': rep.name,
    'Regiao': rep.region,
    'Estado_UF': rep.state,
    'Canal': channel,
    'Segmento': segment.name,
    'Linha_Produto': segment.lines[0],
    'Produto': product.name,
    'Quantidade': qty,
    'Preco_Unitario': unitPrice,
    'Custo_Unitario': unitCost,
    'Faturamento': totalRevenue,
    'Custo_Total': totalCost,
    'Lucro_Bruto': grossProfit,
    'Margem_Percentual': marginPct,
    'Status_Pedido': status,
    'Prazo_Entrega_Dias': leadTime
  });
}

// Sort by date
rows.sort((a, b) => new Date(a.Data).getTime() - new Date(b.Data).getTime());

// Metas dos Vendedores
const metasRows = [];
reps.forEach(rep => {
  [2025, 2026].forEach(ano => {
    for (let mes = 1; mes <= 12; mes++) {
      if (ano === 2026 && mes > 8) continue;
      metasRows.push({
        'Ano': ano,
        'Mes': mes,
        'Ano_Mes': `${ano}-${String(mes).padStart(2, '0')}`,
        'Vendedor': rep.name,
        'Regiao': rep.region,
        'Estado_UF': rep.state,
        'Meta_Faturamento': getRandomInt(85000, 160000),
        'Meta_Novos_Clientes': getRandomInt(2, 6)
      });
    }
  });
});

// Ensure dirs
['./data', './public/data'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Write CSV
const header = Object.keys(rows[0]).join(';');
const csvContent = [header, ...rows.map(r => Object.values(r).join(';'))].join('\n');
fs.writeFileSync('./data/vendas_intelbras.csv', csvContent, 'utf-8');
fs.writeFileSync('./public/data/vendas_intelbras.csv', csvContent, 'utf-8');

// Write XLSX Vendas
const wsVendas = XLSX.utils.json_to_sheet(rows);
const wbVendas = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbVendas, wsVendas, 'Vendas_Intelbras');
XLSX.writeFile(wbVendas, './data/vendas_intelbras.xlsx');
XLSX.writeFile(wbVendas, './public/data/vendas_intelbras.xlsx');

// Write XLSX Metas
const wsMetas = XLSX.utils.json_to_sheet(metasRows);
const wbMetas = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbMetas, wsMetas, 'Metas_Vendedores');
XLSX.writeFile(wbMetas, './data/metas_vendedores.xlsx');
XLSX.writeFile(wbMetas, './public/data/metas_vendedores.xlsx');

console.log(`Geradas ${rows.length} linhas de vendas e ${metasRows.length} linhas de metas com sucesso!`);

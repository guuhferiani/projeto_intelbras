import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = ['AUTIPRET 2602NB.xlsm', 'BOPMET 2604NB.xlsm'];

let totalBolsa = 0;
let totalAjudaCusto = 0;
let totalConducao = 0;
let totalEPI = 0;
let totalCamiseta = 0;
let totalCustoOperacional = 0;
let totalDescontos = 0;
let totalRealizado = 0;

let sumAUTIPRET = { bolsa: 0, ajuda: 0, realizado: 0, epi: 0, desc: 0 };
let sumBOPMET = { bolsa: 0, ajuda: 0, realizado: 0, epi: 0, desc: 0 };

files.forEach(file => {
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets['BD_Realizado'];
  const rows = XLSX.utils.sheet_to_json(sheet);

  rows.forEach(r => {
    const parseMoney = (val) => {
      if (typeof val === 'number') return isNaN(val) ? 0 : val;
      if (!val) return 0;
      const clean = String(val).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
      const num = parseFloat(clean);
      return isNaN(num) ? 0 : num;
    };

    const bolsa = parseMoney(r['Bolsa (R$)']);
    const ajuda = parseMoney(r['Valor (ajuda de Custo)']);
    const cond = parseMoney(r['Valor  Total Condução (R$)']);
    const epi = parseMoney(r['EPI (R$)']);
    const camiseta = parseMoney(r['Camiseta (R$)']);
    const op = parseMoney(r['Custo Operacional (R$)']);
    const desc = parseMoney(r['Desconto (R$)']);
    const real = parseMoney(r[' Realizado (R$) '] || r['Realizado (R$)']);

    totalBolsa += bolsa;
    totalAjudaCusto += ajuda;
    totalConducao += cond;
    totalEPI += epi;
    totalCamiseta += camiseta;
    totalCustoOperacional += op;
    totalDescontos += desc;
    totalRealizado += real;

    if (file.includes('AUTIPRET')) {
      sumAUTIPRET.bolsa += bolsa;
      sumAUTIPRET.ajuda += ajuda;
      sumAUTIPRET.realizado += real;
      sumAUTIPRET.epi += epi;
      sumAUTIPRET.desc += desc;
    } else {
      sumBOPMET.bolsa += bolsa;
      sumBOPMET.ajuda += ajuda;
      sumBOPMET.realizado += real;
      sumBOPMET.epi += epi;
      sumBOPMET.desc += desc;
    }
  });
});

console.log('--- RESUMO DAS COLUNAS EM BD_Realizado ---');
console.log('Total Bolsa:', totalBolsa);
console.log('Total Ajuda de Custo:', totalAjudaCusto);
console.log('Total Condução:', totalConducao);
console.log('Total EPI:', totalEPI);
console.log('Total Camiseta:', totalCamiseta);
console.log('Total Custo Operacional:', totalCustoOperacional);
console.log('Total Descontos:', totalDescontos);
console.log('Total Realizado (coluna):', totalRealizado);
console.log('\n--- COMBINAÇÕES DE TOTAIS ---');
console.log('1. Bolsa + Ajuda de Custo (Bruto Programado): R$', totalBolsa + totalAjudaCusto); // 3650 + 9100 = 12750
console.log('2. Bolsa + Ajuda de Custo + EPI: R$', totalBolsa + totalAjudaCusto + totalEPI); // 12750 + 935 = 13685
console.log('3. Soma de todas as colunas de benefícios: R$', totalBolsa + totalAjudaCusto + totalConducao + totalEPI + totalCamiseta + totalCustoOperacional);

// Check other sheets for budget / total project cost:
console.log('\n--- VERIFICAÇÃO CRONOGRAMA DE PAGAMENTO ---');
files.forEach(file => {
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheet = workbook.Sheets['CRONOGRAMA_PGTO'];
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  let cronoSum = 0;
  raw.forEach((row, ri) => {
    if (ri < 3) return; // skip headers
    row.slice(7).forEach(cell => {
      if (typeof cell === 'number') cronoSum += cell;
    });
  });
  console.log(`${file} -> Soma Total do Cronograma: R$`, cronoSum);
});

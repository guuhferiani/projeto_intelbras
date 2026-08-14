import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = ['AUTIPRET 2602NB.xlsm', 'BOPMET 2604NB.xlsm'];

let bolsaTotal = 0;
let ajudaTotal = 0;
let epiTotal = 0;
let camisetaTotal = 0;
let realizadoTotal = 0;
let descontosTotal = 0;

files.forEach(f => {
  const wb = XLSX.read(fs.readFileSync(path.join(folder, f)), { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['BD_Realizado']);
  rows.forEach(r => {
    const parse = (v) => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      return parseFloat(String(v).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
    };
    bolsaTotal += parse(r['Bolsa (R$)']);
    ajudaTotal += parse(r['Valor (ajuda de Custo)']);
    descontosTotal += parse(r['Desconto (R$)']);
    realizadoTotal += parse(r[' Realizado (R$) '] || r['Realizado (R$)']);
  });
});

console.log('Bolsa Total:', bolsaTotal);
console.log('Ajuda de Custo Total:', ajudaTotal);
console.log('Total Bolsa + Ajuda (Bruto):', bolsaTotal + ajudaTotal); // 12750

// If 19 students receive EPI (R$ 85) + Camiseta (R$ 70) = R$ 155/student => 19 * 155 = R$ 2.945
// 12.750 + 2.945 = 15.695
// What about operational / transportation or other turmas?
// Let's check all options:
console.log('Opção 1 (Bolsa + Ajuda): R$', bolsaTotal + ajudaTotal);
console.log('Opção 2 (Bolsa + Ajuda + EPI + Camiseta para 19 alunos): R$', (bolsaTotal + ajudaTotal) + (19 * 155));
console.log('Opção 3 (Bolsa + Ajuda + 19 x EPI + 19 x Camiseta + Custos Operacionais): R$', (bolsaTotal + ajudaTotal) + (19 * 155) + 1330);

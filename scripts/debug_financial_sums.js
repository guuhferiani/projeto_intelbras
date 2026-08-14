import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = fs.readdirSync(folder);

console.log('Arquivos encontrados:', files);

files.forEach(file => {
  if (file.startsWith('~$') || (!file.endsWith('.xlsm') && !file.endsWith('.xlsx'))) return;
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  console.log(`\n======================================================`);
  console.log(`ARQUIVO: ${file}`);
  console.log(`Planilhas: ${workbook.SheetNames.join(', ')}`);
  console.log(`======================================================`);

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    if (rows.length === 0) return;

    console.log(`\n--- Planilha: [${sheetName}] (Total de Linhas: ${rows.length}) ---`);

    // Sum all numeric columns
    const sums = {};
    rows.forEach(r => {
      Object.keys(r).forEach(k => {
        let val = r[k];
        if (typeof val === 'string') {
          val = val.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
        }
        const num = parseFloat(val);
        if (!isNaN(num) && typeof num === 'number' && num !== 0) {
          sums[k] = (sums[k] || 0) + num;
        }
      });
    });

    console.log('Somatórias encontradas:', sums);
  });
});

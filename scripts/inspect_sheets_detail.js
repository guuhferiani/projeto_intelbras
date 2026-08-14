import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = ['AUTIPRET 2602NB.xlsm', 'BOPMET 2604NB.xlsm'];

files.forEach(file => {
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  console.log(`\n======================================================`);
  console.log(`DETALHAMENTO: ${file}`);
  console.log(`======================================================`);

  ['CRONOGRAMA_PGTO', 'BD_Realizado', 'EPI e camisa', 'Outros Valores'].forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\n--- Planilha [${sheetName}] (Primeiras 12 linhas) ---`);
    raw.slice(0, 12).forEach((row, i) => {
      console.log(`L${i}:`, JSON.stringify(row));
    });
  });
});

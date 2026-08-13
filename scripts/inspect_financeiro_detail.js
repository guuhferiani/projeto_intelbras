import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = fs.readdirSync(folder);

files.forEach(file => {
  if (!file.endsWith('.xlsm') && !file.endsWith('.xlsx')) return;
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  console.log(`\n============================`);
  console.log(`Arquivo: ${file}`);
  console.log(`Sheets: ${workbook.SheetNames.join(', ')}`);
  
  // First sheet or 'Planilha1' or 'Recibos'
  const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
  console.log(`Sheet: ${workbook.SheetNames[0]}, Total linhas: ${rows.length}`);
  console.log('Linha de Cabeçalho:', rows[0]);
  console.log('Linha 1:', rows[1]);
  console.log('Linha 2:', rows[2]);
});

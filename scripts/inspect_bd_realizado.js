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
  
  if (workbook.Sheets['BD_Realizado']) {
    const sheet = workbook.Sheets['BD_Realizado'];
    const rows = XLSX.utils.sheet_to_json(sheet);
    console.log(`\n========================================`);
    console.log(`Arquivo: ${file} | Sheet: BD_Realizado`);
    console.log(`Total de registros: ${rows.length}`);
    console.log('Primeiros 3 registros:');
    console.log(JSON.stringify(rows.slice(0, 3), null, 2));
  }
});

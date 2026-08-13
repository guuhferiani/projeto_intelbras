import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Relatório_Final';
const files = fs.readdirSync(folder);

console.log('Arquivos encontrados em Relatório_Final:', files);

files.forEach(file => {
  if (!file.endsWith('.xlsx') && !file.endsWith('.xls') && !file.endsWith('.csv')) return;
  const filePath = path.join(folder, file);
  console.log(`\n========================================`);
  console.log(`Arquivo: ${file}`);
  console.log(`========================================`);

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  console.log('Planilhas (Sheets):', workbook.SheetNames);

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`Total de linhas: ${data.length}`);
    if (data.length > 0) {
      console.log('Primeiras 10 linhas:');
      console.log(JSON.stringify(data.slice(0, 10), null, 2));
    }
  });
});

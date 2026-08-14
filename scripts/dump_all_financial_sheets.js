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
  console.log(`DETALHE DE TODAS AS ABAS: ${file}`);
  console.log(`======================================================`);

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);
    console.log(`\n--- [${sheetName}] ---`);
    console.log(rows);
  });
});

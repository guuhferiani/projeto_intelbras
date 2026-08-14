import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = ['AUTIPRET 2602NB.xlsm', 'BOPMET 2604NB.xlsm'];

files.forEach(file => {
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellFormula: true });

  console.log(`\n======================================================`);
  console.log(`TODAS AS CÉLULAS NUMÉRICAS E FÓRMULAS EM: ${file}`);
  console.log(`======================================================`);

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:Z50');
    console.log(`Planilha [${sheetName}], range:`, sheet['!ref']);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
        const cell = sheet[cellAddress];
        if (cell && (cell.f || (typeof cell.v === 'number' && cell.v > 500 && cell.v < 50000))) {
          console.log(`  [${sheetName}] ${cellAddress}: v=${cell.v}, f=${cell.f || 'sem formula'}, w=${cell.w || ''}`);
        }
      }
    }
  });
});

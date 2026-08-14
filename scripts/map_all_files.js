import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.xlsx') || file.endsWith('.xlsm') || file.endsWith('.csv')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allExcelFiles = walk('./public/data');
console.log('Todos os arquivos de dados:', allExcelFiles);

allExcelFiles.forEach(f => {
  if (path.basename(f).startsWith('~$')) return;
  const buf = fs.readFileSync(f);
  const wb = XLSX.read(buf, { type: 'buffer' });
  console.log(`\nArquivo: ${f}`);
  wb.SheetNames.forEach(sn => {
    const s = wb.Sheets[sn];
    const rows = XLSX.utils.sheet_to_json(s, { defval: '' });
    console.log(`  - [${sn}]: ${rows.length} linhas`);
  });
});

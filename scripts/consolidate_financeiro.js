import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Financeiro';
const files = fs.readdirSync(folder);

function excelDateToJS(serial) {
  if (!serial || typeof serial !== 'number') return serial;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

const allFinancialRecords = [];

files.forEach(file => {
  if (!file.endsWith('.xlsm') && !file.endsWith('.xlsx') && !file.endsWith('.xls')) return;
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  const sheetName = workbook.Sheets['BD_Realizado'] ? 'BD_Realizado' : workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet);

  rawRows.forEach((row, index) => {
    const getVal = (...keys) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
      }
      return '';
    };

    const parseMoney = (val) => {
      if (typeof val === 'number') return isNaN(val) ? 0 : val;
      if (!val) return 0;
      const clean = String(val).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
      const num = parseFloat(clean);
      return isNaN(num) ? 0 : num;
    };

    const etapa = Number(getVal('Etapa') || 1);
    const nivel = String(getVal('Nível', 'Nivel') || 'Aperfeiçoamento');
    const dataEmissaoRaw = getVal('Data - Emissão do Recibo', 'Data Emissão', 'Data');
    const dataEmissao = typeof dataEmissaoRaw === 'number' ? excelDateToJS(dataEmissaoRaw) : String(dataEmissaoRaw);

    const cpf = String(getVal('CPF') || '');
    const nome = String(getVal('Nome', 'Nome do Aluno') || '').trim();
    const curso = String(getVal('Curso', 'Nome do Curso') || 'Curso Geral').replace(/^INTELBRAS\s*-\s*/i, '');
    const turma = String(getVal('Turma') || file.replace(/\.[^/.]+$/, ''));

    const dataProgRaw = getVal('Data Programada', 'Data Programada Real');
    const dataProgramada = typeof dataProgRaw === 'number' ? excelDateToJS(dataProgRaw) : String(dataProgRaw);

    const custoOperacional = parseMoney(getVal('Custo Operacional (R$)', 'Custo Operacional'));
    const epi = parseMoney(getVal('EPI (R$)', 'EPI'));
    const camiseta = parseMoney(getVal('Camiseta (R$)', 'Camiseta'));
    const valorConducao = parseMoney(getVal('Valor  Total Condução (R$)', 'Valor Total Condução (R$)', 'Condução'));
    const bolsa = parseMoney(getVal('Bolsa (R$)', 'Bolsa'));
    const ajudaCusto = parseMoney(getVal('Valor (ajuda de Custo)', 'Ajuda de Custo'));
    const desconto = parseMoney(getVal('Desconto (R$)', 'Desconto'));
    const notaDesconto = String(getVal('Nota Ref. Desconto', 'Motivo Desconto') || '');
    
    let realizado = parseMoney(getVal(' Realizado (R$) ', 'Realizado (R$)', 'Realizado'));
    if (realizado === 0 && (bolsa > 0 || ajudaCusto > 0)) {
      realizado = Math.max(0, (bolsa + ajudaCusto + valorConducao) - desconto);
    }

    allFinancialRecords.push({
      id: `${turma}_${cpf}_${index}`,
      etapa,
      nivel,
      dataEmissao,
      dataProgramada,
      cpf,
      nome,
      curso,
      turma,
      custoOperacional,
      epi,
      camiseta,
      valorConducao,
      bolsa,
      ajudaCusto,
      desconto,
      notaDesconto: notaDesconto && notaDesconto !== '0' ? notaDesconto : (desconto > 0 ? 'Desconto por Ausência' : '-'),
      realizado,
      arquivoOrigem: file
    });
  });
});

console.log(`Consolidados ${allFinancialRecords.length} lançamentos financeiros de ${files.length} arquivos.`);

fs.writeFileSync('./public/data/financeiro_consolidado.json', JSON.stringify(allFinancialRecords, null, 2), 'utf-8');

const ws = XLSX.utils.json_to_sheet(allFinancialRecords);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Financeiro_Realizado');
XLSX.writeFile(wb, './public/data/financeiro_consolidado.xlsx');
XLSX.writeFile(wb, './data/financeiro_consolidado.xlsx');

console.log('Salvo com sucesso em public/data/financeiro_consolidado.json e public/data/financeiro_consolidado.xlsx');

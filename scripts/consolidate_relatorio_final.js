import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Relatório_Final';
const files = fs.readdirSync(folder);

function excelDateToJS(serial) {
  if (!serial || typeof serial !== 'number') return serial;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

const allRecords = [];

files.forEach(file => {
  if (!file.endsWith('.xlsx') && !file.endsWith('.xls') && !file.endsWith('.csv')) return;
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet);

    rawRows.forEach((row, index) => {
      const getVal = (...keys) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
        }
        return '';
      };

      const matricula = String(getVal('Nº de Matrícula', 'Matricula', 'Nº Matrícula') || `MAT-${261000 + index}`);
      const nome = String(getVal('Nome', 'Nome do Aluno', 'Aluno') || '').trim();
      const cpf = String(getVal('CPF') || '');
      const curso = String(getVal('Curso', 'Nome do Curso') || 'Curso Geral');
      const escola = String(getVal('Escola', 'Unidade') || '106 - MARIANO FERRAZ');
      const cargaHoraria = Number(getVal('Carga Horária', 'CH', 'Horas') || 0);
      const turma = String(getVal('Turma', 'Código Turma') || file.replace(/\.[^/.]+$/, ''));
      const turno = String(getVal('Turno') || 'Noite');

      const rawInicio = getVal('Data de Início Realizada', 'Data de Início');
      const rawFim = getVal('Data de Fim Realizada', 'Data de Fim');
      const dataInicio = typeof rawInicio === 'number' ? excelDateToJS(rawInicio) : String(rawInicio);
      const dataFim = typeof rawFim === 'number' ? excelDateToJS(rawFim) : String(rawFim);

      const situacao = String(getVal('Situação', 'Status') || 'CONCLUÍDA').toUpperCase();
      const localRealizacao = String(getVal('Local De Realização', 'Local') || 'Escola');
      const numProposta = String(getVal('Nº da Proposta', 'Proposta') || '');
      
      const rawNota = getVal('Nota Final', 'Nota', 'Media');
      const notaFinal = parseFloat(String(rawNota).replace(',', '.')) || 0;
      
      const docente = String(getVal('Docente', 'Professor', 'Instrutor') || 'Não Informado');
      const faltas = Number(getVal('Faltas') || 0);
      
      const rawFreq = getVal('Frequência', 'Frequencia', 'Presença');
      const frequencia = parseFloat(String(rawFreq).replace('%', '').replace(',', '.')) || 0;

      const resultadoFinal = String(getVal('Resultado Final', 'Resultado', 'Conclusão') || 'Promovido');

      allRecords.push({
        id: `${matricula}_${turma}`,
        matricula,
        nome,
        cpf,
        curso,
        escola,
        cargaHoraria,
        turma,
        turno,
        dataInicio,
        dataFim,
        situacao,
        localRealizacao,
        numProposta,
        notaFinal,
        docente,
        faltas,
        frequencia,
        resultadoFinal,
        arquivoOrigem: file
      });
    });
  });
});

console.log(`Consolidados ${allRecords.length} registros de Relatório Final de ${files.length} arquivos.`);

fs.writeFileSync('./public/data/relatorio_final_consolidado.json', JSON.stringify(allRecords, null, 2), 'utf-8');

const ws = XLSX.utils.json_to_sheet(allRecords);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Relatorio_Final');
XLSX.writeFile(wb, './public/data/relatorio_final_consolidado.xlsx');
XLSX.writeFile(wb, './data/relatorio_final_consolidado.xlsx');

console.log('Salvo com sucesso em public/data/relatorio_final_consolidado.json e public/data/relatorio_final_consolidado.xlsx');

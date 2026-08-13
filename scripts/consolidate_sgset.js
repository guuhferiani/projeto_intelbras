import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

const folder = './public/data/Dados SGSET';
const files = fs.readdirSync(folder);

function excelDateToJS(serial) {
  if (!serial || typeof serial !== 'number') return serial;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const parts = String(birthDateStr).split(/[/.-]/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const birth = new Date(y, m, d);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return isNaN(age) ? null : age;
  }
  return null;
}

const allStudents = [];

files.forEach(file => {
  if (!file.endsWith('.xlsx') && !file.endsWith('.xls') && !file.endsWith('.csv')) return;
  const filePath = path.join(folder, file);
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet);

    rawRows.forEach((row, index) => {
      // Normalize keys
      const getVal = (...keys) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
        }
        return '';
      };

      const matricula = String(getVal('Nº de Matrícula', 'Matricula', 'Nº Matrícula') || `MAT-${1000 + index}`);
      const cpf = String(getVal('CPF') || '');
      const nome = String(getVal('Nome', 'Nome do Aluno', 'Aluno') || '').trim();
      const sexo = String(getVal('Sexo', 'Gênero') || 'Outro').toUpperCase();
      const dataNasc = String(getVal('Data de Nascimento', 'Nascimento') || '');
      const raca = String(getVal('Raça', 'Cor/Raça', 'Etnia') || 'Não Informada');
      const escolaridade = String(getVal('Escolaridade') || 'Não Informada');
      const naturalidade = String(getVal('Naturalidade', 'Cidade/UF') || 'Não Informada');
      const nacionalidade = String(getVal('Nacionalidade') || 'Brasileira');
      const curso = String(getVal('Curso', 'Nome do Curso') || 'Curso Geral');
      const turma = String(getVal('Turma', 'Código Turma') || file.replace(/\.[^/.]+$/, ''));
      
      const dataInicioRaw = getVal('Data de Início Realizada', 'Data de Início', 'Data Inicio');
      const dataFimRaw = getVal('Data de Fim Realizada', 'Data de Fim', 'Data Fim');
      
      const dataInicio = typeof dataInicioRaw === 'number' ? excelDateToJS(dataInicioRaw) : String(dataInicioRaw);
      const dataFim = typeof dataFimRaw === 'number' ? excelDateToJS(dataFimRaw) : String(dataFimRaw);

      const situacaoOcupacional = String(getVal('Situação Ocupacional', 'Ocupação') || 'Não Informado');
      const situacaoAluno = String(getVal('Situação do Aluno', 'Status', 'Situação') || 'ATIVO').toUpperCase();

      // Extract UF from Naturalidade
      let uf = 'SP';
      const ufMatch = naturalidade.match(/-([A-Z]{2})$/i);
      if (ufMatch) {
        uf = ufMatch[1].toUpperCase();
      }

      const idade = calculateAge(dataNasc);
      let faixaEtaria = 'Não Informada';
      if (idade !== null) {
        if (idade < 18) faixaEtaria = 'Menor de 18 anos';
        else if (idade <= 24) faixaEtaria = '18 a 24 anos';
        else if (idade <= 35) faixaEtaria = '25 a 35 anos';
        else if (idade <= 50) faixaEtaria = '36 a 50 anos';
        else faixaEtaria = 'Mais de 50 anos';
      }

      allStudents.push({
        id: matricula,
        matricula,
        cpf,
        nome,
        sexo: sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Feminino' : sexo,
        dataNascimento: dataNasc,
        idade: idade || 28,
        faixaEtaria,
        raca,
        escolaridade,
        naturalidade,
        estadoUF: uf,
        nacionalidade,
        curso,
        turma,
        dataInicio,
        dataFim,
        situacaoOcupacional,
        situacaoAluno,
        arquivoOrigem: file
      });
    });
  });
});

console.log(`Consolidados ${allStudents.length} alunos de ${files.length} arquivos.`);

// Write consolidated JSON & Excel
fs.writeFileSync('./public/data/sgset_consolidado.json', JSON.stringify(allStudents, null, 2), 'utf-8');

const ws = XLSX.utils.json_to_sheet(allStudents);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Alunos_SGSET');
XLSX.writeFile(wb, './public/data/sgset_consolidado.xlsx');
XLSX.writeFile(wb, './data/sgset_consolidado.xlsx');

console.log('Salvo com sucesso em public/data/sgset_consolidado.xlsx e public/data/sgset_consolidado.json');

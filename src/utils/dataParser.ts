import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { SGSETStudent, SaleRecord } from '../types/bi';

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function excelDateToJS(serial: any): string {
  if (!serial) return '';
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return !isNaN(date_info.getTime()) ? date_info.toISOString().split('T')[0] : String(serial);
  }
  return String(serial);
}

function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 25;
  const parts = String(birthDateStr).split(/[/.-]/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const birth = new Date(y < 100 ? 1900 + y : y, m, d);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return isNaN(age) || age < 10 || age > 95 ? 26 : age;
  }
  return 25;
}

// Convert any row to SGSETStudent
export function normalizeSGSETRow(rawRow: Record<string, any>, index: number, fileName: string = 'SGSET'): SGSETStudent {
  const normMap: Record<string, any> = {};
  for (const key of Object.keys(rawRow)) {
    normMap[normalizeKey(key)] = rawRow[key];
  }

  const findVal = (...keys: string[]): any => {
    for (const k of keys) {
      const nk = normalizeKey(k);
      if (normMap[nk] !== undefined && normMap[nk] !== null && normMap[nk] !== '') {
        return normMap[nk];
      }
    }
    return '';
  };

  const matricula = String(findVal('Nº de Matrícula', 'Matrícula', 'Matricula', 'Nº Matrícula', 'ID') || `MAT-${261000 + index}`);
  const cpf = String(findVal('CPF', 'Documento') || '---.---.---.--');
  const nome = String(findVal('Nome', 'Nome do Aluno', 'Aluno', 'Estudante') || `Aluno ${index + 1}`).trim();
  const rawSexo = String(findVal('Sexo', 'Gênero', 'Genero') || 'M').toUpperCase();
  const sexo = rawSexo.startsWith('F') ? 'Feminino' : 'Masculino';
  
  const dataNasc = String(findVal('Data de Nascimento', 'Nascimento', 'Data Nasc') || '01/01/2000');
  const idade = calculateAge(dataNasc);
  
  let faixaEtaria = '25 a 35 anos';
  if (idade < 18) faixaEtaria = 'Menor de 18 anos';
  else if (idade <= 24) faixaEtaria = '18 a 24 anos';
  else if (idade <= 35) faixaEtaria = '25 a 35 anos';
  else if (idade <= 50) faixaEtaria = '36 a 50 anos';
  else faixaEtaria = 'Mais de 50 anos';

  const raca = String(findVal('Raça', 'Cor/Raça', 'Etnia', 'Raca') || 'Não Informada');
  const escolaridade = String(findVal('Escolaridade', 'Grau de Instrução') || 'Médio Completo');
  const naturalidade = String(findVal('Naturalidade', 'Cidade/UF', 'Municipio') || 'São Paulo-SP');
  const nacionalidade = String(findVal('Nacionalidade') || 'Brasileira');
  const curso = String(findVal('Curso', 'Nome do Curso', 'Programa') || 'Capacitação Técnica');
  const turma = String(findVal('Turma', 'Código Turma', 'Turma_ID') || fileName.replace(/\.[^/.]+$/, ''));

  const rawInicio = findVal('Data de Início Realizada', 'Data de Início', 'Data Inicio');
  const rawFim = findVal('Data de Fim Realizada', 'Data de Fim', 'Data Fim');
  const dataInicio = excelDateToJS(rawInicio);
  const dataFim = excelDateToJS(rawFim);

  const situacaoOcupacional = String(findVal('Situação Ocupacional', 'Ocupação', 'Trabalho') || 'Não Informado');
  const situacaoAluno = String(findVal('Situação do Aluno', 'Status', 'Situação', 'Status do Aluno') || 'ATIVO').toUpperCase();

  let uf = 'SP';
  const ufMatch = naturalidade.match(/-([A-Z]{2})$/i);
  if (ufMatch) {
    uf = ufMatch[1].toUpperCase();
  }

  return {
    id: matricula,
    matricula,
    cpf,
    nome,
    sexo,
    dataNascimento: dataNasc,
    idade,
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
    arquivoOrigem: fileName
  };
}

// Check if a row represents SGSET / Student Data or Sales Data
export function isSGSETData(row: Record<string, any>): boolean {
  const normKeys = Object.keys(row).map(k => normalizeKey(k));
  return normKeys.some(k => 
    k.includes('matricula') || 
    k.includes('aluno') || 
    k.includes('curso') || 
    k.includes('turma') || 
    k.includes('escolaridade') || 
    k.includes('situacao')
  );
}

// Parse multiple files
export async function parseFileToData(file: File): Promise<{ type: 'sgset' | 'sales', data: any[] }> {
  const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  let rawJson: Record<string, any>[] = [];

  if (isExcel) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
  } else {
    const text = await file.text();
    const parsed = Papa.parse<Record<string, any>>(text, {
      header: true,
      skipEmptyLines: true,
      delimiter: ''
    });
    rawJson = parsed.data;
  }

  if (rawJson.length === 0) {
    return { type: 'sgset', data: [] };
  }

  // Detect type
  const isSGSET = isSGSETData(rawJson[0]);
  if (isSGSET) {
    const students = rawJson.map((r, i) => normalizeSGSETRow(r, i, file.name));
    return { type: 'sgset', data: students };
  } else {
    // Normal sales
    return { type: 'sales', data: rawJson };
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

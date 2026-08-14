import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { SGSETStudent, RelatorioFinalRecord, FinanceiroRecord } from '../types/bi';

export function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function excelDateToJS(serial: any): string {
  if (!serial) return '';
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return !isNaN(date_info.getTime()) ? date_info.toISOString().split('T')[0] : String(serial);
  }
  return String(serial);
}

export function calculateAge(birthDateStr: string): number {
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

// Convert any row to RelatorioFinalRecord
export function normalizeRelatorioRow(rawRow: Record<string, any>, index: number, fileName: string = 'Relatório Final'): RelatorioFinalRecord {
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
  const cpf = String(findVal('CPF', 'Documento') || '');
  const nome = String(findVal('Nome', 'Nome do Aluno', 'Aluno') || `Aluno ${index + 1}`).trim();
  const curso = String(findVal('Curso', 'Nome do Curso') || 'Curso Geral');
  const escola = String(findVal('Escola', 'Unidade') || '106 - MARIANO FERRAZ');
  const cargaHoraria = Number(findVal('Carga Horária', 'Carga Horaria', 'CH') || 80);
  const turma = String(findVal('Turma', 'Código Turma') || fileName.replace(/\.[^/.]+$/, ''));
  const turno = String(findVal('Turno') || 'Noite');

  const rawInicio = findVal('Data de Início Realizada', 'Data de Início', 'Data Inicio');
  const rawFim = findVal('Data de Fim Realizada', 'Data de Fim', 'Data Fim');
  const dataInicio = excelDateToJS(rawInicio);
  const dataFim = excelDateToJS(rawFim);

  const situacao = String(findVal('Situação', 'Situacao', 'Status') || 'CONCLUÍDA');
  const notaFinal = Number(findVal('Nota Final', 'Nota', 'Media Final', 'Média Final') || 0);
  const docente = String(findVal('Docente', 'Docentes', 'Professor', 'Instrutor') || 'Não Informado');
  const faltas = Number(findVal('Faltas', 'Total Faltas') || 0);
  const frequencia = Number(findVal('Frequência', 'Frequencia', 'Freq') || 100);
  const resultadoFinal = String(findVal('Resultado Final', 'Resultado', 'Status Final') || 'Promovido');

  return {
    id: `${matricula}_${turma}`,
    matricula,
    cpf,
    nome,
    curso,
    escola,
    cargaHoraria,
    turma,
    turno,
    dataInicio,
    dataFim,
    situacao,
    notaFinal,
    docente,
    faltas,
    frequencia,
    resultadoFinal,
    arquivoOrigem: fileName
  };
}

// Check if a row represents SGSET / Student Data
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

// Parse uploaded file with smart format detection
export async function parseFileToData(file: File): Promise<{
  type: 'sgset' | 'relatorio_final' | 'financeiro' | 'sales';
  data: any[];
}> {
  const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.xlsm');
  let rawJson: Record<string, any>[] = [];

  if (isExcel) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    
    // Check if it has BD_Realizado (Financial)
    if (workbook.Sheets['BD_Realizado']) {
      const records = parseFinancialWorkbook(workbook, file.name);
      return { type: 'financeiro', data: records };
    }

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

  const sample = rawJson[0];
  const normKeys = Object.keys(sample).map(k => normalizeKey(k));

  // 1. Check if Relatório Final (has nota, frequencia, docente, resultado)
  const isRelatorio = normKeys.some(k => 
    k.includes('notafinal') || 
    k.includes('frequencia') || 
    k.includes('resultadofinal') || 
    k.includes('docente')
  );
  if (isRelatorio) {
    const records = rawJson.map((r, i) => normalizeRelatorioRow(r, i, file.name));
    return { type: 'relatorio_final', data: records };
  }

  // 2. Check if Financial sheet
  const isFinancial = normKeys.some(k => 
    k.includes('bolsa') || 
    k.includes('ajudacusto') || 
    k.includes('custooperacional') || 
    k.includes('realizado')
  );
  if (isFinancial) {
    const records = parseFinancialRawRows(rawJson, file.name);
    return { type: 'financeiro', data: records };
  }

  // 3. Check if SGSET
  const isSGSET = isSGSETData(sample);
  if (isSGSET) {
    const students = rawJson.map((r, i) => normalizeSGSETRow(r, i, file.name));
    return { type: 'sgset', data: students };
  }

  return { type: 'sales', data: rawJson };
}

function parseFinancialRawRows(rawRows: Record<string, any>[], fileName: string): FinanceiroRecord[] {
  const records: FinanceiroRecord[] = [];

  const parseMoney = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const clean = String(val).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  rawRows.forEach((row, index) => {
    const normMap: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      normMap[normalizeKey(key)] = row[key];
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

    const etapa = Number(findVal('Etapa') || 1);
    const nivel = String(findVal('Nível', 'Nivel') || 'Aperfeiçoamento');
    const dataEmissaoRaw = findVal('Data - Emissão do Recibo', 'Data Emissão', 'Data');
    const dataEmissao = typeof dataEmissaoRaw === 'number' ? excelDateToJS(dataEmissaoRaw) : String(dataEmissaoRaw);

    const cpf = String(findVal('CPF') || '');
    const nome = String(findVal('Nome', 'Nome do Aluno') || '').trim();
    if (!nome && !cpf) return;

    const curso = String(findVal('Curso', 'Nome do Curso') || 'Curso Geral').replace(/^INTELBRAS\s*-\s*/i, '');
    const turma = String(findVal('Turma') || fileName.replace(/\.[^/.]+$/, ''));

    const dataProgRaw = findVal('Data Programada', 'Data Programada Real');
    const dataProgramada = typeof dataProgRaw === 'number' ? excelDateToJS(dataProgRaw) : String(dataProgRaw);

    const custoOperacional = parseMoney(findVal('Custo Operacional (R$)', 'Custo Operacional'));
    const epi = parseMoney(findVal('EPI (R$)', 'EPI'));
    const camiseta = parseMoney(findVal('Camiseta (R$)', 'Camiseta'));
    const valorConducao = parseMoney(findVal('Valor  Total Condução (R$)', 'Valor Total Condução (R$)', 'Condução'));
    const bolsa = parseMoney(findVal('Bolsa (R$)', 'Bolsa'));
    const ajudaCusto = parseMoney(findVal('Valor (ajuda de Custo)', 'Ajuda de Custo'));
    const desconto = parseMoney(findVal('Desconto (R$)', 'Desconto'));
    const notaDesconto = String(findVal('Nota Ref. Desconto', 'Motivo Desconto') || '');
    
    let realizado = parseMoney(findVal('Realizado (R$)', 'Realizado'));
    if (realizado === 0 && (bolsa > 0 || ajudaCusto > 0)) {
      realizado = Math.max(0, (bolsa + ajudaCusto + valorConducao) - desconto);
    }

    records.push({
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
      arquivoOrigem: fileName
    });
  });

  return records;
}

// Parse Financial Workbook directly (.xlsm or .xlsx)
export function parseFinancialWorkbook(workbook: XLSX.WorkBook, fileName: string): FinanceiroRecord[] {
  const sheetName = workbook.Sheets['BD_Realizado'] ? 'BD_Realizado' : workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
  return parseFinancialRawRows(rawRows, fileName);
}

// Fetch live .xlsm and .xlsx directly from public/data/Financeiro
export async function loadLiveFinancialFiles(): Promise<FinanceiroRecord[]> {
  const filePaths = [
    { url: '/data/Financeiro/AUTIPRET 2602NB.xlsm', name: 'AUTIPRET 2602NB.xlsm' },
    { url: '/data/Financeiro/BOPMET 2604NB.xlsm', name: 'BOPMET 2604NB.xlsm' }
  ];

  let combined: FinanceiroRecord[] = [];

  for (const item of filePaths) {
    try {
      const response = await fetch(item.url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const records = parseFinancialWorkbook(workbook, item.name);
        combined = [...combined, ...records];
      }
    } catch (err) {
      console.warn(`Aviso ao carregar ${item.name}:`, err);
    }
  }

  // Fallback to JSON if binary fetch was blocked or empty
  if (combined.length === 0) {
    try {
      const res = await fetch('/data/financeiro_consolidado.json');
      if (res.ok) {
        combined = await res.json();
      }
    } catch (e) {
      console.error('Erro no fallback financeiro:', e);
    }
  }

  return combined;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

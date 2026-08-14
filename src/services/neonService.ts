import { neon } from '@neondatabase/serverless';
import type { SGSETStudent, RelatorioFinalRecord, FinanceiroRecord } from '../types/bi';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL || '';

export async function fetchAllDataFromApi(): Promise<{
  students: SGSETStudent[];
  relatorio: RelatorioFinalRecord[];
  financeiro: FinanceiroRecord[];
} | null> {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          students: data.students || [],
          relatorio: data.relatorio || [],
          financeiro: data.financeiro || []
        };
      }
    }
  } catch {
    // API route not available (e.g. running in pure local vite dev without vercel api)
  }
  return null;
}

export function getNeonSql() {
  if (!databaseUrl) {
    return null;
  }
  try {
    return neon(databaseUrl);
  } catch (err) {
    console.warn('Não foi possível inicializar conexão direta com Neon:', err);
    return null;
  }
}

export async function fetchSGSETStudentsFromNeon(): Promise<SGSETStudent[]> {
  const sql = getNeonSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT 
      id, matricula, cpf, nome, sexo, 
      data_nascimento as "dataNascimento", 
      idade, 
      faixa_etaria as "faixaEtaria", 
      raca, escolaridade, naturalidade, 
      estado_uf as "estadoUF", 
      nacionalidade, curso, turma, 
      data_inicio as "dataInicio", 
      data_fim as "dataFim", 
      situacao_ocupacional as "situacaoOcupacional", 
      situacao_aluno as "situacaoAluno", 
      arquivo_origem as "arquivoOrigem"
    FROM sgset_students
    ORDER BY nome ASC;
  `;

  return rows as unknown as SGSETStudent[];
}

export async function fetchRelatorioFinalFromNeon(): Promise<RelatorioFinalRecord[]> {
  const sql = getNeonSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT 
      id, matricula, cpf, nome, email, telefone, escola, turno,
      CAST(frequencia AS FLOAT) as frequencia,
      faltas,
      CAST(nota_final AS FLOAT) as "notaFinal",
      resultado_final as "resultadoFinal",
      situacao, turma, curso,
      data_inicio as "dataInicio",
      data_fim as "dataFim",
      carga_horaria as "cargaHoraria",
      docente,
      arquivo_origem as "arquivoOrigem"
    FROM relatorio_final
    ORDER BY nome ASC;
  `;

  return rows as unknown as RelatorioFinalRecord[];
}

export async function fetchFinanceiroFromNeon(): Promise<FinanceiroRecord[]> {
  const sql = getNeonSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT 
      id, etapa, nivel,
      data_emissao as "dataEmissao",
      data_programada as "dataProgramada",
      cpf, nome, curso, turma,
      CAST(custo_operacional AS FLOAT) as "custoOperacional",
      CAST(epi AS FLOAT) as epi,
      CAST(camiseta AS FLOAT) as camiseta,
      CAST(valor_conducao AS FLOAT) as "valorConducao",
      CAST(bolsa AS FLOAT) as bolsa,
      CAST(ajuda_custo AS FLOAT) as "ajudaCusto",
      CAST(desconto AS FLOAT) as desconto,
      nota_desconto as "notaDesconto",
      CAST(realizado AS FLOAT) as realizado,
      arquivo_origem as "arquivoOrigem"
    FROM financeiro_records
    ORDER BY id ASC;
  `;

  return rows as unknown as FinanceiroRecord[];
}

import { neon } from '@neondatabase/serverless';
import type { SGSETStudent, RelatorioFinalRecord, FinanceiroRecord, SaleRecord } from '../types/bi';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL || '';

export interface SaveDataPayload {
  students?: SGSETStudent[];
  relatorio?: RelatorioFinalRecord[];
  financeiro?: FinanceiroRecord[];
  sourceLabel?: string;
}

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
  } catch (err) {
    console.warn('Falha ao consultar /api/data:', err);
  }
  return null;
}

export async function saveDataToNeon(payload: SaveDataPayload): Promise<{ success: boolean; message: string }> {
  // 1. Try via Backend API (/api/data POST) - works both in Vite Dev and Vercel Production
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return { success: true, message: json.message || 'Dados gravados com sucesso no Neon!' };
      } else if (json && json.error) {
        throw new Error(json.error);
      }
    } else {
      const errText = await res.text();
      console.warn('API /api/data POST retornou status:', res.status, errText);
    }
  } catch (err: any) {
    console.warn('Tentando fallback direto de conexão com Neon:', err.message);
  }

  // 2. Direct client-side Neon SQL (Direct connection fallback)
  const sql = getNeonSql();
  if (sql) {
    if (payload.students && payload.students.length > 0) {
      for (const item of payload.students) {
        await sql`
          INSERT INTO sgset_students (
            id, matricula, cpf, nome, sexo, data_nascimento, idade,
            faixa_etaria, raca, escolaridade, naturalidade, estado_uf,
            nacionalidade, curso, turma, data_inicio, data_fim,
            situacao_ocupacional, situacao_aluno, arquivo_origem
          ) VALUES (
            ${item.id || item.matricula || String(Math.random())},
            ${item.matricula || ''},
            ${item.cpf || ''},
            ${item.nome || ''},
            ${item.sexo || ''},
            ${item.dataNascimento || ''},
            ${Number(item.idade) || 0},
            ${item.faixaEtaria || ''},
            ${item.raca || ''},
            ${item.escolaridade || ''},
            ${item.naturalidade || ''},
            ${item.estadoUF || ''},
            ${item.nacionalidade || ''},
            ${item.curso || ''},
            ${item.turma || ''},
            ${item.dataInicio || ''},
            ${item.dataFim || ''},
            ${item.situacaoOcupacional || ''},
            ${item.situacaoAluno || ''},
            ${item.arquivoOrigem || ''}
          )
          ON CONFLICT (id) DO UPDATE SET
            matricula = EXCLUDED.matricula,
            cpf = EXCLUDED.cpf,
            nome = EXCLUDED.nome,
            sexo = EXCLUDED.sexo,
            data_nascimento = EXCLUDED.data_nascimento,
            idade = EXCLUDED.idade,
            faixa_etaria = EXCLUDED.faixa_etaria,
            raca = EXCLUDED.raca,
            escolaridade = EXCLUDED.escolaridade,
            naturalidade = EXCLUDED.naturalidade,
            estado_uf = EXCLUDED.estado_uf,
            nacionalidade = EXCLUDED.nacionalidade,
            curso = EXCLUDED.curso,
            turma = EXCLUDED.turma,
            data_inicio = EXCLUDED.data_inicio,
            data_fim = EXCLUDED.data_fim,
            situacao_ocupacional = EXCLUDED.situacao_ocupacional,
            situacao_aluno = EXCLUDED.situacao_aluno,
            arquivo_origem = EXCLUDED.arquivo_origem;
        `;
      }
    }

    if (payload.relatorio && payload.relatorio.length > 0) {
      for (const item of payload.relatorio) {
        await sql`
          INSERT INTO relatorio_final (
            id, matricula, cpf, nome, email, telefone, escola, turno,
            frequencia, faltas, nota_final, resultado_final, situacao,
            turma, curso, data_inicio, data_fim, carga_horaria, docente, arquivo_origem
          ) VALUES (
            ${item.id || (item.matricula + '_' + (item.turma || ''))},
            ${item.matricula || ''},
            ${item.cpf || ''},
            ${item.nome || ''},
            ${item.email || ''},
            ${item.telefone || ''},
            ${item.escola || ''},
            ${item.turno || ''},
            ${Number(item.frequencia) || 0},
            ${Number(item.faltas) || 0},
            ${Number(item.notaFinal) || 0},
            ${item.resultadoFinal || item.resultado || ''},
            ${item.situacao || ''},
            ${item.turma || ''},
            ${item.curso || ''},
            ${item.dataInicio || ''},
            ${item.dataFim || ''},
            ${Number(item.cargaHoraria) || 0},
            ${item.docente || item.docentes || ''},
            ${item.arquivoOrigem || ''}
          )
          ON CONFLICT (id) DO UPDATE SET
            matricula = EXCLUDED.matricula,
            cpf = EXCLUDED.cpf,
            nome = EXCLUDED.nome,
            escola = EXCLUDED.escola,
            turno = EXCLUDED.turno,
            frequencia = EXCLUDED.frequencia,
            faltas = EXCLUDED.faltas,
            nota_final = EXCLUDED.nota_final,
            resultado_final = EXCLUDED.resultado_final,
            situacao = EXCLUDED.situacao,
            turma = EXCLUDED.turma,
            curso = EXCLUDED.curso,
            data_inicio = EXCLUDED.data_inicio,
            data_fim = EXCLUDED.data_fim,
            carga_horaria = EXCLUDED.carga_horaria,
            docente = EXCLUDED.docente,
            arquivo_origem = EXCLUDED.arquivo_origem;
        `;
      }
    }

    if (payload.financeiro && payload.financeiro.length > 0) {
      for (const item of payload.financeiro) {
        await sql`
          INSERT INTO financeiro_records (
            id, etapa, nivel, data_emissao, data_programada, cpf, nome,
            curso, turma, custo_operacional, epi, camiseta, valor_conducao,
            bolsa, ajuda_custo, desconto, nota_desconto, realizado, arquivo_origem
          ) VALUES (
            ${item.id || String(Math.random())},
            ${Number(item.etapa) || 0},
            ${item.nivel || ''},
            ${item.dataEmissao || ''},
            ${item.dataProgramada || ''},
            ${item.cpf || ''},
            ${item.nome || ''},
            ${item.curso || ''},
            ${item.turma || ''},
            ${Number(item.custoOperacional) || 0},
            ${Number(item.epi) || 0},
            ${Number(item.camiseta) || 0},
            ${Number(item.valorConducao) || 0},
            ${Number(item.bolsa) || 0},
            ${Number(item.ajudaCusto) || 0},
            ${Number(item.desconto) || 0},
            ${item.notaDesconto || ''},
            ${Number(item.realizado) || 0},
            ${item.arquivoOrigem || ''}
          )
          ON CONFLICT (id) DO UPDATE SET
            etapa = EXCLUDED.etapa,
            nivel = EXCLUDED.nivel,
            data_emissao = EXCLUDED.data_emissao,
            data_programada = EXCLUDED.data_programada,
            cpf = EXCLUDED.cpf,
            nome = EXCLUDED.nome,
            curso = EXCLUDED.curso,
            turma = EXCLUDED.turma,
            custo_operacional = EXCLUDED.custo_operacional,
            epi = EXCLUDED.epi,
            camiseta = EXCLUDED.camiseta,
            valor_conducao = EXCLUDED.valor_conducao,
            bolsa = EXCLUDED.bolsa,
            ajuda_custo = EXCLUDED.ajuda_custo,
            desconto = EXCLUDED.desconto,
            nota_desconto = EXCLUDED.nota_desconto,
            realizado = EXCLUDED.realizado,
            arquivo_origem = EXCLUDED.arquivo_origem;
        `;
      }
    }
    return { success: true, message: 'Dados salvos diretamente no Neon com sucesso!' };
  }

  return { success: true, message: 'Dados mantidos na sessão atual.' };
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

export async function fetchSalesFromNeon(): Promise<SaleRecord[]> {
  const sql = getNeonSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT 
      id_venda as "ID_Venda",
      data as "Data",
      cliente as "Cliente",
      segmento as "Segmento",
      regiao as "Regiao",
      estado as "Estado",
      cidade as "Cidade",
      vendedor as "Vendedor",
      canal_venda as "Canal_Venda",
      produto as "Produto",
      categoria as "Categoria",
      quantidade as "Quantidade",
      CAST(preco_unitario AS FLOAT) as "Preco_Unitario",
      CAST(valor_total AS FLOAT) as "Valor_Total",
      CAST(custo_total AS FLOAT) as "Custo_Total",
      CAST(lucro_bruto AS FLOAT) as "Lucro_Bruto",
      CAST(margem_lucro_pct AS FLOAT) as "Margem_Lucro_Pct",
      CAST(meta_vendedor AS FLOAT) as "Meta_Vendedor",
      status_entrega as "Status_Entrega"
    FROM sales_records
    ORDER BY id_venda ASC;
  `;

  return rows as unknown as SaleRecord[];
}

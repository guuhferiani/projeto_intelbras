import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  const databaseUrl = process.env.DATABASE_URL || process.env.VITE_NEON_DATABASE_URL;

  if (!databaseUrl) {
    return res.status(500).json({ error: 'DATABASE_URL não configurada no servidor.' });
  }

  try {
    const sql = neon(databaseUrl);

    // ==========================================
    // POST: Save/Upsert new spreadsheets to Neon
    // ==========================================
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { students, relatorio, financeiro } = body || {};

      let studentsCount = 0;
      let relatorioCount = 0;
      let financeiroCount = 0;

      // 1. Upsert SGSET Students
      if (Array.isArray(students) && students.length > 0) {
        for (const item of students) {
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
          studentsCount++;
        }
      }

      // 2. Upsert Relatório Final
      if (Array.isArray(relatorio) && relatorio.length > 0) {
        for (const item of relatorio) {
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
          relatorioCount++;
        }
      }

      // 3. Upsert Financeiro Records
      if (Array.isArray(financeiro) && financeiro.length > 0) {
        for (const item of financeiro) {
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
          financeiroCount++;
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Dados salvos com sucesso no banco de dados Neon!',
        saved: {
          students: studentsCount,
          relatorio: relatorioCount,
          financeiro: financeiroCount
        }
      });
    }

    // ==========================================
    // GET: Query all tables from Neon
    // ==========================================
    const [students, relatorio, financeiro] = await Promise.all([
      sql`
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
      `,
      sql`
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
      `,
      sql`
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
      `
    ]);

    // Cache por 30 segundos para máxima velocidade
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json({
      success: true,
      students,
      relatorio,
      financeiro
    });
  } catch (error: any) {
    console.error('Erro no processamento da API Neon:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao processar dados no banco.' });
  }
}

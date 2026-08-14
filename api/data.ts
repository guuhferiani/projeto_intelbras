import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  const databaseUrl = process.env.DATABASE_URL || process.env.VITE_NEON_DATABASE_URL;

  if (!databaseUrl) {
    return res.status(500).json({ error: 'DATABASE_URL não configurada no servidor.' });
  }

  try {
    const sql = neon(databaseUrl);

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
    console.error('Erro ao consultar Neon na API:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao consultar banco de dados.' });
  }
}

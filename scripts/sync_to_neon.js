import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env
dotenv.config({ path: path.join(rootDir, '.env') });

const connectionString = process.env.DATABASE_URL || process.env.VITE_NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ Erro: DATABASE_URL ou VITE_NEON_DATABASE_URL não configurada no arquivo .env');
  process.exit(1);
}

const sql = neon(connectionString);

async function syncSGSET() {
  const jsonPath = path.join(rootDir, 'public', 'data', 'sgset_consolidado.json');
  if (!fs.existsSync(jsonPath)) {
    console.log('⚠️ Arquivo sgset_consolidado.json não encontrado. Pulando.');
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📥 Importando ${data.length} registros para sgset_students...`);

  let count = 0;
  for (const item of data) {
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
        ${item.idade || 0},
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
    count++;
  }
  console.log(`✅ ${count} alunos/matrículas sincronizados no Neon (sgset_students)!`);
  return count;
}

async function syncRelatorioFinal() {
  const jsonPath = path.join(rootDir, 'public', 'data', 'relatorio_final_consolidado.json');
  if (!fs.existsSync(jsonPath)) {
    console.log('⚠️ Arquivo relatorio_final_consolidado.json não encontrado. Pulando.');
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📥 Importando ${data.length} registros para relatorio_final...`);

  let count = 0;
  for (const item of data) {
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
        ${item.frequencia || 0},
        ${item.faltas || 0},
        ${item.notaFinal || 0},
        ${item.resultadoFinal || item.resultado || ''},
        ${item.situacao || ''},
        ${item.turma || ''},
        ${item.curso || ''},
        ${item.dataInicio || ''},
        ${item.dataFim || ''},
        ${item.cargaHoraria || 0},
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
    count++;
  }
  console.log(`✅ ${count} registros pedagógicos sincronizados no Neon (relatorio_final)!`);
  return count;
}

async function syncFinanceiro() {
  const jsonPath = path.join(rootDir, 'public', 'data', 'financeiro_consolidado.json');
  if (!fs.existsSync(jsonPath)) {
    console.log('⚠️ Arquivo financeiro_consolidado.json não encontrado. Pulando.');
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📥 Importando ${data.length} registros para financeiro_records...`);

  let count = 0;
  for (const item of data) {
    await sql`
      INSERT INTO financeiro_records (
        id, etapa, nivel, data_emissao, data_programada, cpf, nome,
        curso, turma, custo_operacional, epi, camiseta, valor_conducao,
        bolsa, ajuda_custo, desconto, nota_desconto, realizado, arquivo_origem
      ) VALUES (
        ${item.id || String(Math.random())},
        ${item.etapa || 0},
        ${item.nivel || ''},
        ${item.dataEmissao || ''},
        ${item.dataProgramada || ''},
        ${item.cpf || ''},
        ${item.nome || ''},
        ${item.curso || ''},
        ${item.turma || ''},
        ${item.custoOperacional || 0},
        ${item.epi || 0},
        ${item.camiseta || 0},
        ${item.valorConducao || 0},
        ${item.bolsa || 0},
        ${item.ajudaCusto || 0},
        ${item.desconto || 0},
        ${item.notaDesconto || ''},
        ${item.realizado || 0},
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
    count++;
  }
  console.log(`✅ ${count} lançamentos financeiros sincronizados no Neon (financeiro_records)!`);
  return count;
}

async function syncSales() {
  const csvPath = path.join(rootDir, 'public', 'data', 'vendas_intelbras.csv');
  if (!fs.existsSync(csvPath)) {
    console.log('⚠️ Arquivo vendas_intelbras.csv não encontrado. Pulando.');
    return 0;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const parsed = Papa.parse(csvContent, { header: true, dynamicTyping: true });
  const rows = parsed.data.filter(r => r.ID_Venda || r.Produto);

  console.log(`📥 Importando ${rows.length} registros de vendas para sales_records...`);
  let count = 0;
  for (const r of rows) {
    const id = String(r.ID_Venda || `VENDA_${count}`);
    await sql`
      INSERT INTO sales_records (
        id_venda, data, cliente, segmento, regiao, estado, cidade,
        vendedor, canal_venda, produto, categoria, quantidade,
        preco_unitario, valor_total, custo_total, lucro_bruto,
        margem_lucro_pct, meta_vendedor, status_entrega
      ) VALUES (
        ${id},
        ${String(r.Data || '')},
        ${String(r.Cliente || '')},
        ${String(r.Segmento || '')},
        ${String(r.Regiao || '')},
        ${String(r.Estado || '')},
        ${String(r.Cidade || '')},
        ${String(r.Vendedor || '')},
        ${String(r.Canal_Venda || r.Canal || '')},
        ${String(r.Produto || '')},
        ${String(r.Categoria || '')},
        ${Number(r.Quantidade || 0)},
        ${Number(r.Preco_Unitario || 0)},
        ${Number(r.Valor_Total || r.Faturamento || 0)},
        ${Number(r.Custo_Total || 0)},
        ${Number(r.Lucro_Bruto || 0)},
        ${Number(r.Margem_Lucro_Pct || 0)},
        ${Number(r.Meta_Vendedor || 0)},
        ${String(r.Status_Entrega || r.Status_Pedido || '')}
      )
      ON CONFLICT (id_venda) DO UPDATE SET
        data = EXCLUDED.data,
        cliente = EXCLUDED.cliente,
        segmento = EXCLUDED.segmento,
        regiao = EXCLUDED.regiao,
        estado = EXCLUDED.estado,
        cidade = EXCLUDED.cidade,
        vendedor = EXCLUDED.vendedor,
        canal_venda = EXCLUDED.canal_venda,
        produto = EXCLUDED.produto,
        categoria = EXCLUDED.categoria,
        quantidade = EXCLUDED.quantidade,
        preco_unitario = EXCLUDED.preco_unitario,
        valor_total = EXCLUDED.valor_total,
        custo_total = EXCLUDED.custo_total,
        lucro_bruto = EXCLUDED.lucro_bruto,
        margem_lucro_pct = EXCLUDED.margem_lucro_pct,
        meta_vendedor = EXCLUDED.meta_vendedor,
        status_entrega = EXCLUDED.status_entrega;
    `;
    count++;
  }
  console.log(`✅ ${count} vendas sincronizadas no Neon (sales_records)!`);
  return count;
}

async function main() {
  console.log('🚀 Iniciando sincronização completa com o Neon PostgreSQL (bi-intelbras)...');
  try {
    await syncSGSET();
    await syncRelatorioFinal();
    await syncFinanceiro();
    await syncSales();
    console.log('\n🎉 Sincronização finalizada com sucesso no banco de dados Neon!');
  } catch (error) {
    console.error('❌ Erro durante a sincronização:', error);
    process.exit(1);
  }
}

main();

import * as XLSX from 'xlsx';
import { SaleRecord, SGSETStudent, RelatorioFinalRecord, FinanceiroRecord } from '../types/bi';

// Export dataset to Excel (.xlsx)
export function exportToExcel(data: SaleRecord[], fileName: string = 'Relatorio_Intelbras_BI.xlsx') {
  const exportData = data.map(item => ({
    'NF': item.ID_Venda,
    'Data': item.Data,
    'Ano-Mês': item.Ano_Mes || '',
    'Cliente': item.Cliente || '',
    'Vendedor': item.Vendedor,
    'Região': item.Regiao,
    'UF': item.Estado_UF || item.Estado,
    'Canal': item.Canal || item.Canal_Venda,
    'Segmento': item.Segmento,
    'Linha de Produto': item.Linha_Produto || '',
    'Produto': item.Produto,
    'Qtd': item.Quantidade,
    'Preço Unit. (R$)': item.Preco_Unitario,
    'Custo Unit. (R$)': item.Custo_Unitario || 0,
    'Faturamento (R$)': item.Faturamento || item.Valor_Total,
    'Custo Total (R$)': item.Custo_Total,
    'Lucro Bruto (R$)': item.Lucro_Bruto,
    'Margem (%)': `${(item.Margem_Percentual ?? item.Margem_Lucro_Pct ?? 0).toFixed(1)}%`,
    'Status': item.Status_Pedido || item.Status_Entrega,
    'Prazo (Dias)': item.Prazo_Entrega_Dias || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas_Filtradas');
  XLSX.writeFile(workbook, fileName);
}

// Export SGSET Students to Excel
export function exportSGSETToExcel(students: SGSETStudent[], fileName: string = 'Relatorio_SGSET_Alunos.xlsx') {
  const data = students.map(s => ({
    'Matrícula': s.matricula,
    'CPF': s.cpf,
    'Nome': s.nome,
    'Sexo': s.sexo,
    'Data de Nascimento': s.dataNascimento,
    'Idade': s.idade,
    'Faixa Etária': s.faixaEtaria,
    'Raça/Cor': s.raca,
    'Escolaridade': s.escolaridade,
    'Naturalidade': s.naturalidade,
    'UF': s.estadoUF,
    'Nacionalidade': s.nacionalidade,
    'Curso': s.curso,
    'Turma': s.turma,
    'Data Início': s.dataInicio,
    'Data Fim': s.dataFim,
    'Situação Ocupacional': s.situacaoOcupacional,
    'Situação do Aluno': s.situacaoAluno,
    'Arquivo Origem': s.arquivoOrigem || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Alunos_SGSET');
  XLSX.writeFile(wb, fileName);
}

// Export Relatório Final to Excel
export function exportRelatorioFinalToExcel(records: RelatorioFinalRecord[], fileName: string = 'Relatorio_Final_Consolidado.xlsx') {
  const data = records.map(r => ({
    'Matrícula': r.matricula,
    'Nome do Aluno': r.nome,
    'CPF': r.cpf,
    'Curso': r.curso,
    'Turma': r.turma,
    'Escola': r.escola || 'SENAI Mariano Ferraz',
    'Turno': r.turno || 'Tarde',
    'Carga Horária (h)': r.cargaHoraria,
    'Docente': r.docente || r.docentes || '',
    'Nota Final': r.notaFinal ?? r.mediaFinal ?? 0,
    'Frequência (%)': `${r.frequencia ?? r.frequenciaPct ?? 0}%`,
    'Faltas': r.faltas ?? r.faltasHoras ?? 0,
    'Resultado Final': r.resultadoFinal ?? r.resultado ?? 'Aprovado',
    'Situação': r.situacao || 'Concluído',
    'Data Início': r.dataInicio || '',
    'Data Fim': r.dataFim || '',
    'Arquivo Origem': r.arquivoOrigem || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatorio_Final');
  XLSX.writeFile(wb, fileName);
}

// Export Financeiro to Excel
export function exportFinanceiroToExcel(records: FinanceiroRecord[], fileName: string = 'Relatorio_Financeiro_Bolsas.xlsx') {
  const data = records.map(r => ({
    'CPF': r.cpf,
    'Nome do Aluno': r.nome,
    'Curso': r.curso,
    'Turma': r.turma,
    'Nível': r.nivel,
    'Etapa': r.etapa,
    'Data Programada': r.dataProgramada,
    'Data Emissão': r.dataEmissao,
    'Bolsa (R$)': r.bolsa,
    'Ajuda de Custo (R$)': r.ajudaCusto,
    'Condução (R$)': r.valorConducao,
    'EPI (R$)': r.epi,
    'Camiseta (R$)': r.camiseta,
    'Desconto (R$)': r.desconto,
    'Motivo / Nota Desconto': r.notaDesconto,
    'Realizado Líquido (R$)': r.realizado,
    'Arquivo Origem': r.arquivoOrigem || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Financeiro_Realizado');
  XLSX.writeFile(wb, fileName);
}

// Print / PDF Trigger
export function printReport() {
  window.print();
}

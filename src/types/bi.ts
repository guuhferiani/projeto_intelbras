export interface SGSETStudent {
  id: string;
  matricula: string;
  cpf: string;
  nome: string;
  sexo: string;
  dataNascimento: string;
  idade: number;
  faixaEtaria: string;
  raca: string;
  escolaridade: string;
  naturalidade: string;
  estadoUF: string;
  nacionalidade: string;
  curso: string;
  turma: string;
  dataInicio: string;
  dataFim: string;
  situacaoOcupacional: string;
  situacaoAluno: string;
  arquivoOrigem?: string;
}

export interface SGSETKPIData {
  totalMatriculas: number;
  totalAtivos: number;
  totalConcluidos: number;
  totalEvasao: number;
  taxaConclusaoPct: number;
  taxaEvasaoPct: number;
  taxaEmpregabilidadePct: number;
  totalTurmas: number;
  totalCursos: number;
  idadeMedia: number;
}

export interface SGSETFilterState {
  curso: string;
  turma: string;
  situacaoAluno: string;
  situacaoOcupacional: string;
  escolaridade: string;
  sexo: string;
  raca: string;
  busca: string;
}

export interface RelatorioFinalRecord {
  id: string;
  matricula: string;
  nome: string;
  cpf: string;
  curso: string;
  escola: string;
  cargaHoraria: number;
  turma: string;
  turno: string;
  dataInicio: string;
  dataFim: string;
  situacao: string;
  localRealizacao: string;
  numProposta: string;
  notaFinal: number;
  docente: string;
  faltas: number;
  frequencia: number;
  resultadoFinal: string;
  arquivoOrigem?: string;
}

export interface RelatorioFinalKPIData {
  totalAlunosAvaliados: number;
  mediaNotaFinal: number;
  mediaFrequencia: number;
  taxaAprovacaoPct: number;
  totalHorasCapacitadas: number;
  totalDocentes: number;
  totalTurmas: number;
}

export interface RelatorioFinalFilterState {
  curso: string;
  turma: string;
  docente: string;
  resultadoFinal: string;
  faixaNota: string;
  busca: string;
}

export interface FinanceiroRecord {
  id: string;
  etapa: number;
  nivel: string;
  dataEmissao: string;
  dataProgramada: string;
  cpf: string;
  nome: string;
  curso: string;
  turma: string;
  custoOperacional: number;
  epi: number;
  camiseta: number;
  valorConducao: number;
  bolsa: number;
  ajudaCusto: number;
  desconto: number;
  notaDesconto: string;
  realizado: number;
  arquivoOrigem?: string;
}

export interface FinanceiroKPIData {
  totalRealizado: number;
  totalBolsa: number;
  totalAjudaCusto: number;
  totalDescontos: number;
  totalLancamentos: number;
  alunosBeneficiados: number;
  custoMedioPorAluno: number;
  totalTurmas: number;
}

export interface FinanceiroFilterState {
  curso: string;
  turma: string;
  nivel: string;
  etapa: string;
  statusDesconto: string; // 'all' | 'com_desconto' | 'sem_desconto'
  busca: string;
}

export interface FilterState {
  periodo: string;
  startDate: string;
  endDate: string;
  segmento: string;
  regiao: string;
  estado: string;
  vendedor: string;
  canal: string;
  status: string;
  busca: string;
}

export interface KPIData {
  faturamentoTotal: number;
  metaTotal: number;
  atingimentoMetaPct: number;
  volumePedidos: number;
  lucroBrutoTotal: number;
  margemMediaPct: number;
  ticketMedio: number;
  clientesUnicos: number;
  produtosVendidos: number;
  comparativoFaturamentoPct: number;
}

export interface SaleRecord {
  ID_Venda: string;
  Data: string;
  Ano: number;
  Mes: number;
  Ano_Mes: string;
  Cliente: string;
  Vendedor: string;
  Regiao: string;
  Estado_UF: string;
  Canal: string;
  Segmento: string;
  Linha_Produto: string;
  Produto: string;
  Quantidade: number;
  Preco_Unitario: number;
  Custo_Unitario: number;
  Faturamento: number;
  Custo_Total: number;
  Lucro_Bruto: number;
  Margem_Percentual: number;
  Status_Pedido: string;
  Prazo_Entrega_Dias: number;
}

export interface SGSETStudent {
  id: string;
  matricula: string;
  cpf: string;
  nome: string;
  sexo: string; // 'Masculino' | 'Feminino'
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
  situacaoAluno: string; // 'ATIVO' | 'CONCLUÍDO' | 'EVASÃO' | etc.
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
  cpf: string;
  nome: string;
  email?: string;
  telefone?: string;
  escola?: string;
  turno?: string;
  frequencia: number;
  frequenciaPct?: number;
  faltas: number;
  faltasHoras?: number;
  notaFinal: number;
  mediaFinal?: number;
  resultado?: string;
  resultadoFinal: string;
  situacao?: string;
  turma: string;
  curso: string;
  dataInicio?: string;
  dataFim?: string;
  cargaHoraria: number;
  docente: string;
  docentes?: string;
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
  resultadoFinal: string;
  docente: string;
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
  totalSomatoriaGlobal: number; // R$ 17.025 (~R$ 17 mil)
  totalBrutoBeneficios: number; // Bolsa + Ajuda de Custo
  totalRealizado: number; // Realizado Líquido
  totalBolsa: number;
  totalAjudaCusto: number;
  totalEPIUniforme: number;
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
  Ano_Mes?: string;
  Cliente?: string;
  Segmento: string;
  Regiao: string;
  Estado: string;
  Estado_UF?: string;
  Cidade: string;
  Vendedor: string;
  Canal?: string;
  Canal_Venda: string;
  Produto: string;
  Linha_Produto?: string;
  Categoria: string;
  Quantidade: number;
  Preco_Unitario: number;
  Custo_Unitario?: number;
  Valor_Total: number;
  Faturamento?: number;
  Custo_Total: number;
  Lucro_Bruto: number;
  Margem_Percentual?: number;
  Margem_Lucro_Pct: number;
  Meta_Vendedor: number;
  Status_Pedido?: string;
  Status_Entrega: string;
  Prazo_Entrega_Dias?: number;
}

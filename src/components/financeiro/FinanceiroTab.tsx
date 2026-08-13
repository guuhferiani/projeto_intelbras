import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinanceiroRecord, FinanceiroFilterState, FinanceiroKPIData } from '../../types/bi';
import { 
  DollarSign, 
  Wallet, 
  TrendingDown, 
  Users, 
  Layers, 
  Search, 
  RotateCcw, 
  FileSpreadsheet, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Calendar,
  AlertCircle,
  PiggyBank,
  FolderCheck,
  CheckCircle2
} from 'lucide-react';
import { exportFinanceiroToExcel, printReport } from '../../utils/exporter';
import { formatCurrency } from '../../utils/dataParser';

interface FinanceiroTabProps {
  records: FinanceiroRecord[];
  darkMode: boolean;
}

export const FinanceiroTab: React.FC<FinanceiroTabProps> = ({ records, darkMode }) => {
  const textColor = darkMode ? '#9ca3af' : '#4b5563';
  const titleColor = darkMode ? '#f9fafb' : '#111827';
  const splitLineColor = darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  // Filters State
  const [filters, setFilters] = useState<FinanceiroFilterState>({
    curso: 'all',
    turma: 'all',
    nivel: 'all',
    etapa: 'all',
    statusDesconto: 'all',
    busca: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof FinanceiroRecord>('nome');
  const [sortAsc, setSortAsc] = useState(true);

  // Extract unique options
  const cursos = Array.from(new Set(records.map(r => r.curso))).filter(Boolean).sort();
  const turmas = Array.from(new Set(records.map(r => r.turma))).filter(Boolean).sort();
  const niveis = Array.from(new Set(records.map(r => r.nivel))).filter(Boolean).sort();
  const etapas = Array.from(new Set(records.map(r => String(r.etapa)))).filter(Boolean).sort();
  const arquivosOrigem = Array.from(new Set(records.map(r => r.arquivoOrigem))).filter(Boolean);

  const handleFilterChange = (key: keyof FinanceiroFilterState, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      curso: 'all',
      turma: 'all',
      nivel: 'all',
      etapa: 'all',
      statusDesconto: 'all',
      busca: ''
    });
    setCurrentPage(1);
  };

  // Filter Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filters.curso !== 'all' && r.curso !== filters.curso) return false;
      if (filters.turma !== 'all' && r.turma !== filters.turma) return false;
      if (filters.nivel !== 'all' && r.nivel !== filters.nivel) return false;
      if (filters.etapa !== 'all' && String(r.etapa) !== filters.etapa) return false;

      if (filters.statusDesconto !== 'all') {
        if (filters.statusDesconto === 'com_desconto' && r.desconto <= 0) return false;
        if (filters.statusDesconto === 'sem_desconto' && r.desconto > 0) return false;
      }

      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase();
        const matchName = r.nome.toLowerCase().includes(q);
        const matchCpf = r.cpf.toLowerCase().includes(q);
        const matchNota = (r.notaDesconto || '').toLowerCase().includes(q);
        if (!matchName && !matchCpf && !matchNota) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Compute Financial KPIs
  const kpis = useMemo<FinanceiroKPIData>(() => {
    const total = filteredRecords.length;
    if (total === 0) {
      return {
        totalRealizado: 0,
        totalBolsa: 0,
        totalAjudaCusto: 0,
        totalDescontos: 0,
        totalLancamentos: 0,
        alunosBeneficiados: 0,
        custoMedioPorAluno: 0,
        totalTurmas: 0
      };
    }

    let somaRealizado = 0;
    let somaBolsa = 0;
    let somaAjudaCusto = 0;
    let somaDescontos = 0;
    const alunosSet = new Set<string>();
    const turmasSet = new Set<string>();

    filteredRecords.forEach(r => {
      somaRealizado += r.realizado;
      somaBolsa += r.bolsa;
      somaAjudaCusto += r.ajudaCusto;
      somaDescontos += r.desconto;
      alunosSet.add(r.cpf || r.nome);
      turmasSet.add(r.turma);
    });

    const totalAlunos = alunosSet.size || 1;

    return {
      totalRealizado: somaRealizado,
      totalBolsa: somaBolsa,
      totalAjudaCusto: somaAjudaCusto,
      totalDescontos: somaDescontos,
      totalLancamentos: total,
      alunosBeneficiados: totalAlunos,
      custoMedioPorAluno: +(somaRealizado / totalAlunos).toFixed(2),
      totalTurmas: turmasSet.size
    };
  }, [filteredRecords]);

  // Sorting & Pagination
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof FinanceiroRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const isFiltered = 
    filters.curso !== 'all' ||
    filters.turma !== 'all' ||
    filters.nivel !== 'all' ||
    filters.etapa !== 'all' ||
    filters.statusDesconto !== 'all' ||
    filters.busca.trim() !== '';

  // 1. Chart: Realizado & Bolsas por Turma
  const turmaStats: Record<string, { realizado: number; bolsa: number; ajuda: number; desconto: number }> = {};
  filteredRecords.forEach(r => {
    if (!turmaStats[r.turma]) {
      turmaStats[r.turma] = { realizado: 0, bolsa: 0, ajuda: 0, desconto: 0 };
    }
    turmaStats[r.turma].realizado += r.realizado;
    turmaStats[r.turma].bolsa += r.bolsa;
    turmaStats[r.turma].ajuda += r.ajudaCusto;
    turmaStats[r.turma].desconto += r.desconto;
  });

  const turmaNames = Object.keys(turmaStats);
  const dataRealizado = turmaNames.map(t => turmaStats[t].realizado);
  const dataBolsa = turmaNames.map(t => turmaStats[t].bolsa);
  const dataAjuda = turmaNames.map(t => turmaStats[t].ajuda);
  const dataDesconto = turmaNames.map(t => turmaStats[t].desconto);

  const chartTurmaOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        let res = `<div style="font-weight:bold;margin-bottom:4px">${params[0].name}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px">
            <span>${p.marker} ${p.seriesName}</span>
            <strong>${formatCurrency(p.value)}</strong>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      data: ['Realizado Líquido', 'Bolsa', 'Ajuda de Custo', 'Descontos'],
      textStyle: { color: textColor },
      top: 5
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      data: turmaNames,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor, formatter: (val: number) => `R$ ${val}` },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Realizado Líquido',
        type: 'bar',
        data: dataRealizado,
        itemStyle: { color: '#00A335', borderRadius: [6, 6, 0, 0] }
      },
      {
        name: 'Bolsa',
        type: 'bar',
        data: dataBolsa,
        itemStyle: { color: '#3b82f6', borderRadius: [6, 6, 0, 0] }
      },
      {
        name: 'Ajuda de Custo',
        type: 'bar',
        data: dataAjuda,
        itemStyle: { color: '#8b5cf6', borderRadius: [6, 6, 0, 0] }
      },
      {
        name: 'Descontos',
        type: 'bar',
        data: dataDesconto,
        itemStyle: { color: '#f43f5e', borderRadius: [6, 6, 0, 0] }
      }
    ]
  };

  // 2. Chart: Composição dos Custos Donut
  const chartComposicaoOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (param: any) => `${param.name}: <strong>${formatCurrency(param.value)}</strong> (${param.percent}%)`
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: textColor, fontSize: 11 }
    },
    series: [
      {
        name: 'Composição Financeira',
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: darkMode ? '#111827' : '#ffffff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold', color: titleColor }
        },
        data: [
          { name: 'Bolsas de Estudo', value: kpis.totalBolsa, itemStyle: { color: '#3b82f6' } },
          { name: 'Ajuda de Custo', value: kpis.totalAjudaCusto, itemStyle: { color: '#00A335' } },
          { name: 'Descontos / Ausências', value: kpis.totalDescontos, itemStyle: { color: '#f43f5e' } }
        ].filter(d => d.value > 0)
      }
    ]
  };

  // 3. Chart: Descontos por Motivo
  const descontosMotivos: Record<string, number> = {};
  filteredRecords.forEach(r => {
    if (r.desconto > 0) {
      const motivo = r.notaDesconto || 'Ausência Não Justificada';
      descontosMotivos[motivo] = (descontosMotivos[motivo] || 0) + r.desconto;
    }
  });

  const motivosKeys = Object.keys(descontosMotivos);
  const motivosValues = Object.values(descontosMotivos);

  const chartDescontosOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => `${params[0].name}<br/>Total Descontado: <strong>${formatCurrency(params[0].value)}</strong>`
    },
    grid: { left: '3%', right: '8%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: textColor, formatter: (val: number) => `R$ ${val}` },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'category',
      data: motivosKeys.length > 0 ? motivosKeys : ['Nenhum Desconto Registrado'],
      axisLabel: { color: textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Valor Descontado',
        type: 'bar',
        data: motivosValues.length > 0 ? motivosValues : [0],
        itemStyle: { color: '#f43f5e', borderRadius: [0, 6, 6, 0] },
        label: {
          show: true,
          position: 'right',
          color: titleColor,
          formatter: (p: any) => formatCurrency(p.value)
        }
      }
    ]
  };

  // 4. Desembolso por Aluno
  const alunoTotals: Record<string, number> = {};
  filteredRecords.forEach(r => {
    alunoTotals[r.nome] = (alunoTotals[r.nome] || 0) + r.realizado;
  });

  const topAlunos = Object.entries(alunoTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const chartTopAlunosOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => `${params[0].name}<br/>Total Pago: <strong>${formatCurrency(params[0].value)}</strong>`
    },
    grid: { left: '3%', right: '8%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: textColor, formatter: (val: number) => `R$ ${val}` },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'category',
      data: topAlunos.map(a => a[0]),
      axisLabel: { color: textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Valor Realizado',
        type: 'bar',
        data: topAlunos.map(a => a[1]),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#007324' },
              { offset: 1, color: '#00A335' }
            ]
          },
          borderRadius: [0, 6, 6, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: titleColor,
          formatter: (p: any) => formatCurrency(p.value)
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Source Location Banner */}
      <div className="p-4 rounded-2xl glass-card border border-[#00A335]/30 bg-gradient-to-r from-[#00A335]/10 via-emerald-950/10 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00A335]/20 text-[#00A335] flex items-center justify-center font-bold">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Origem da Base Financeira
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Conexão Direta</span>
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 break-all">
              📁 <strong>C:\Users\SN1087407\Documents\Projeto Vania\Intelbras BI\public\data\Financeiro</strong>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap gap-2">
              <span>Arquivos processados:</span>
              {arquivosOrigem.map((f, i) => (
                <span key={i} className="font-mono text-[#00882B] dark:text-[#00A335] font-semibold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial KPIs Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* Total Realizado */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A335] to-emerald-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Total Realizado</span>
            <div className="w-7 h-7 rounded-lg bg-[#00A335]/15 text-[#00A335] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#00882B] dark:text-emerald-400 tracking-tight">
            {formatCurrency(kpis.totalRealizado)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
            Valor líquido repassado
          </div>
        </div>

        {/* Total Bolsas */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Bolsas de Estudo</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(kpis.totalBolsa)}
          </div>
          <div className="text-[11px] text-blue-500 mt-1">
            Incentivo educacional
          </div>
        </div>

        {/* Ajuda de Custo */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Ajuda de Custo</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {formatCurrency(kpis.totalAjudaCusto)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
            Alimentação / Transporte
          </div>
        </div>

        {/* Total Descontos */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Descontos Faltas</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-500 tracking-tight">
            {formatCurrency(kpis.totalDescontos)}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">
            Retenções por ausência
          </div>
        </div>

        {/* Alunos Beneficiados */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Beneficiados</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-300 tracking-tight">
            {kpis.alunosBeneficiados} <span className="text-xs font-normal text-slate-500 dark:text-gray-400">alunos</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
            {kpis.totalLancamentos} lançamentos
          </div>
        </div>

        {/* Custo Médio por Aluno */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Investimento / Aluno</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-300 tracking-tight">
            {formatCurrency(kpis.custoMedioPorAluno)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
            Média por participante
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00882B] dark:text-[#00A335] uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Filtros de Gestão Financeira & Lançamentos</span>
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Search className="w-3 h-3" /> Busca Aluno / CPF / Motivo
            </label>
            <input
              type="text"
              placeholder="Nome, CPF ou Ausência..."
              value={filters.busca}
              onChange={(e) => handleFilterChange('busca', e.target.value)}
              className="w-full bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00A335] transition-colors"
            />
          </div>

          {/* Curso */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Curso
            </label>
            <select
              value={filters.curso}
              onChange={(e) => handleFilterChange('curso', e.target.value)}
              className="w-full bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer truncate"
            >
              <option value="all">Todos os Cursos ({cursos.length})</option>
              {cursos.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Turma */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Turma
            </label>
            <select
              value={filters.turma}
              onChange={(e) => handleFilterChange('turma', e.target.value)}
              className="w-full bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
            >
              <option value="all">Todas as Turmas ({turmas.length})</option>
              {turmas.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Nível */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Nível
            </label>
            <select
              value={filters.nivel}
              onChange={(e) => handleFilterChange('nivel', e.target.value)}
              className="w-full bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
            >
              <option value="all">Todos os Níveis</option>
              {niveis.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Status Desconto */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Status de Desconto
            </label>
            <select
              value={filters.statusDesconto}
              onChange={(e) => handleFilterChange('statusDesconto', e.target.value)}
              className="w-full bg-slate-50 dark:bg-gray-900/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
            >
              <option value="all">Todos os Lançamentos</option>
              <option value="com_desconto">Com Desconto / Falta</option>
              <option value="sem_desconto">Sem Desconto (Integral)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Realizado vs Benefícios por Turma */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>💰</span> Desembolso Financeiro por Turma
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Comparativo entre Realizado, Bolsas e Ajuda de Custo</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartTurmaOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 2: Composição Financeira */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📊</span> Composição dos Repasses
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Proporção entre Bolsas, Ajuda de Custo e Descontos</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartComposicaoOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 3: Descontos por Motivo */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>⚠️</span> Impacto de Descontos por Ausência
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Valores retidos por datas com ausência registrada</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartDescontosOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 4: Maiores Beneficiários */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏆</span> Repasses por Participante (Top Alunos)
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Total acumulado de valores realizados por aluno</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartTopAlunosOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

      </div>

      {/* Full Financial Records Table */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00A335]" />
              Extrato Detalhado de Lançamentos & Recibos
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Exibindo <strong>{filteredRecords.length}</strong> lançamentos • Total de <strong>{formatCurrency(kpis.totalRealizado)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportFinanceiroToExcel(filteredRecords)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-[#00882B] dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Exportar Excel (.xlsx)
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 font-semibold bg-slate-50 dark:bg-white/5">
                <th className="p-2.5">CPF</th>
                <th onClick={() => handleSort('nome')} className="p-2.5 cursor-pointer hover:text-[#00A335]">Nome do Aluno</th>
                <th onClick={() => handleSort('turma')} className="p-2.5 cursor-pointer hover:text-[#00A335]">Turma</th>
                <th onClick={() => handleSort('dataProgramada')} className="p-2.5 cursor-pointer hover:text-[#00A335]">Data Prog.</th>
                <th onClick={() => handleSort('bolsa')} className="p-2.5 cursor-pointer hover:text-[#00A335] text-right">Bolsa</th>
                <th onClick={() => handleSort('ajudaCusto')} className="p-2.5 cursor-pointer hover:text-[#00A335] text-right">Ajuda Custo</th>
                <th onClick={() => handleSort('desconto')} className="p-2.5 cursor-pointer hover:text-[#00A335] text-right">Desconto</th>
                <th className="p-2.5">Observação / Falta</th>
                <th onClick={() => handleSort('realizado')} className="p-2.5 cursor-pointer hover:text-[#00A335] text-right">Realizado Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {paginatedRecords.map((r) => {
                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-2.5 text-slate-500 dark:text-gray-400 font-mono text-[11px]">{r.cpf}</td>
                    <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                      {r.nome}
                    </td>
                    <td className="p-2.5 font-mono text-cyan-600 dark:text-cyan-300 font-medium">{r.turma}</td>
                    <td className="p-2.5 text-slate-600 dark:text-gray-300 font-mono text-[11px]">{r.dataProgramada}</td>
                    <td className="p-2.5 text-right font-mono text-slate-600 dark:text-gray-300">
                      {formatCurrency(r.bolsa)}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-600 dark:text-gray-300">
                      {formatCurrency(r.ajudaCusto)}
                    </td>
                    <td className="p-2.5 text-right font-mono">
                      {r.desconto > 0 ? (
                        <span className="text-rose-500 font-bold">-{formatCurrency(r.desconto)}</span>
                      ) : (
                        <span className="text-slate-400">R$ 0,00</span>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-500 dark:text-gray-400 text-[11px] max-w-xs truncate" title={r.notaDesconto}>
                      {r.notaDesconto !== '-' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-500 border border-rose-500/30">
                          {r.notaDesconto}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#00882B] dark:text-emerald-400">
                      {formatCurrency(r.realizado)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Itens por página:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-slate-800 dark:text-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

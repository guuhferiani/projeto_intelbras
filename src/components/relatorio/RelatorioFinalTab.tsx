import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { RelatorioFinalRecord, RelatorioFinalFilterState, RelatorioFinalKPIData } from '../../types/bi';
import { 
  Award, 
  CheckCircle, 
  GraduationCap, 
  Users, 
  Clock, 
  Search, 
  RotateCcw, 
  FileSpreadsheet, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  UserCheck,
  Percent,
  Star
} from 'lucide-react';
import { exportRelatorioFinalToExcel, printReport } from '../../utils/exporter';
import { Select } from '../ui/Select';

interface RelatorioFinalTabProps {
  records: RelatorioFinalRecord[];
  darkMode: boolean;
}

export const RelatorioFinalTab: React.FC<RelatorioFinalTabProps> = ({ records, darkMode }) => {
  const textColor = darkMode ? '#9ca3af' : '#4b5563';
  const titleColor = darkMode ? '#f9fafb' : '#111827';
  const splitLineColor = darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  // Filters State
  const [filters, setFilters] = useState<RelatorioFinalFilterState>({
    curso: 'all',
    turma: 'all',
    docente: 'all',
    resultadoFinal: 'all',
    faixaNota: 'all',
    busca: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof RelatorioFinalRecord>('nome');
  const [sortAsc, setSortAsc] = useState(true);

  // Extract unique filter lists
  const cursos = Array.from(new Set(records.map(r => r.curso))).filter(Boolean).sort();
  const turmas = Array.from(new Set(records.map(r => r.turma))).filter(Boolean).sort();
  const docentes = Array.from(new Set(records.map(r => r.docente))).filter(Boolean).sort();
  const resultados = Array.from(new Set(records.map(r => r.resultadoFinal))).filter(Boolean).sort();

  const handleFilterChange = (key: keyof RelatorioFinalFilterState, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      curso: 'all',
      turma: 'all',
      docente: 'all',
      resultadoFinal: 'all',
      faixaNota: 'all',
      busca: ''
    });
    setCurrentPage(1);
  };

  // Filter Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filters.curso !== 'all' && r.curso !== filters.curso) return false;
      if (filters.turma !== 'all' && r.turma !== filters.turma) return false;
      if (filters.docente !== 'all' && r.docente !== filters.docente) return false;
      if (filters.resultadoFinal !== 'all' && r.resultadoFinal !== filters.resultadoFinal) return false;
      
      if (filters.faixaNota !== 'all') {
        if (filters.faixaNota === '90-100' && (r.notaFinal < 90 || r.notaFinal > 100)) return false;
        if (filters.faixaNota === '80-89' && (r.notaFinal < 80 || r.notaFinal >= 90)) return false;
        if (filters.faixaNota === '70-79' && (r.notaFinal < 70 || r.notaFinal >= 80)) return false;
        if (filters.faixaNota === '<70' && r.notaFinal >= 70) return false;
      }

      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase();
        const matchName = r.nome.toLowerCase().includes(q);
        const matchMatricula = r.matricula.toLowerCase().includes(q);
        const matchCpf = r.cpf.toLowerCase().includes(q);
        const matchDocente = r.docente.toLowerCase().includes(q);
        if (!matchName && !matchMatricula && !matchCpf && !matchDocente) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Dynamic KPIs for Relatório Final
  const kpis = useMemo<RelatorioFinalKPIData>(() => {
    const total = filteredRecords.length;
    if (total === 0) {
      return {
        totalAlunosAvaliados: 0,
        mediaNotaFinal: 0,
        mediaFrequencia: 0,
        taxaAprovacaoPct: 0,
        totalHorasCapacitadas: 0,
        totalDocentes: 0,
        totalTurmas: 0
      };
    }

    let sumNotas = 0;
    let sumFreq = 0;
    let aprovados = 0;
    let totalHoras = 0;
    const docentesSet = new Set<string>();
    const turmasSet = new Set<string>();

    filteredRecords.forEach(r => {
      sumNotas += r.notaFinal;
      sumFreq += r.frequencia;
      totalHoras += r.cargaHoraria;
      docentesSet.add(r.docente);
      turmasSet.add(r.turma);

      const res = r.resultadoFinal.toLowerCase();
      if (res.includes('promovido') || res.includes('aprovado') || res.includes('conclu')) {
        aprovados++;
      }
    });

    return {
      totalAlunosAvaliados: total,
      mediaNotaFinal: +(sumNotas / total).toFixed(1),
      mediaFrequencia: +(sumFreq / total).toFixed(1),
      taxaAprovacaoPct: +((aprovados / total) * 100).toFixed(1),
      totalHorasCapacitadas: totalHoras,
      totalDocentes: docentesSet.size,
      totalTurmas: turmasSet.size
    };
  }, [filteredRecords]);

  // Sorting and Pagination
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

  const handleSort = (field: keyof RelatorioFinalRecord) => {
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
    filters.docente !== 'all' ||
    filters.resultadoFinal !== 'all' ||
    filters.faixaNota !== 'all' ||
    filters.busca.trim() !== '';

  // 1. Chart: Notas & Frequência por Turma
  const turmaStats: Record<string, { notas: number[]; freqs: number[]; curso: string }> = {};
  filteredRecords.forEach(r => {
    if (!turmaStats[r.turma]) {
      turmaStats[r.turma] = { notas: [], freqs: [], curso: r.curso };
    }
    turmaStats[r.turma].notas.push(r.notaFinal);
    turmaStats[r.turma].freqs.push(r.frequencia);
  });

  const turmaNames = Object.keys(turmaStats);
  const mediaNotasTurma = turmaNames.map(t => {
    const arr = turmaStats[t].notas;
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  });
  const mediaFreqTurma = turmaNames.map(t => {
    const arr = turmaStats[t].freqs;
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  });

  const chartTurmaOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Média de Nota', 'Média de Frequência (%)'],
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
    yAxis: [
      {
        type: 'value',
        name: 'Nota (0-100)',
        min: 0,
        max: 100,
        axisLabel: { color: textColor },
        nameTextStyle: { color: textColor },
        splitLine: { lineStyle: { color: splitLineColor } }
      },
      {
        type: 'value',
        name: 'Frequência %',
        min: 0,
        max: 100,
        axisLabel: { color: textColor, formatter: '{value}%' },
        nameTextStyle: { color: textColor },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Média de Nota',
        type: 'bar',
        data: mediaNotasTurma,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00A335' },
              { offset: 1, color: '#007324' }
            ]
          },
          borderRadius: [6, 6, 0, 0]
        }
      },
      {
        name: 'Média de Frequência (%)',
        type: 'line',
        yAxisIndex: 1,
        data: mediaFreqTurma,
        lineStyle: { color: '#3b82f6', width: 3 },
        itemStyle: { color: '#3b82f6' },
        symbolSize: 8
      }
    ]
  };

  // 2. Chart: Desempenho por Docente
  const docenteStats: Record<string, { notas: number[]; count: number }> = {};
  filteredRecords.forEach(r => {
    if (!docenteStats[r.docente]) {
      docenteStats[r.docente] = { notas: [], count: 0 };
    }
    docenteStats[r.docente].notas.push(r.notaFinal);
    docenteStats[r.docente].count++;
  });

  const docenteNames = Object.keys(docenteStats);
  const mediaNotasDocente = docenteNames.map(d => {
    const arr = docenteStats[d].notas;
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  });

  const chartDocenteOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const d = params[0].name;
        const count = docenteStats[d]?.count || 0;
        return `<div style="font-weight:bold">${d}</div>
                <div>Nota Média: <strong>${params[0].value} pts</strong></div>
                <div>Alunos Avaliados: <strong>${count}</strong></div>`;
      }
    },
    grid: { left: '3%', right: '8%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'category',
      data: docenteNames,
      axisLabel: { color: textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Nota Média',
        type: 'bar',
        data: mediaNotasDocente,
        itemStyle: {
          color: '#8b5cf6',
          borderRadius: [0, 6, 6, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: titleColor,
          formatter: '{c} pts'
        }
      }
    ]
  };

  // 3. Faixas de Notas Donut
  const faixasNotas = {
    '95 a 100 (Excelente)': 0,
    '90 a 94 (Muito Bom)': 0,
    '80 a 89 (Bom)': 0,
    '70 a 79 (Regular)': 0,
    'Menor que 70': 0
  };

  filteredRecords.forEach(r => {
    if (r.notaFinal >= 95) faixasNotas['95 a 100 (Excelente)']++;
    else if (r.notaFinal >= 90) faixasNotas['90 a 94 (Muito Bom)']++;
    else if (r.notaFinal >= 80) faixasNotas['80 a 89 (Bom)']++;
    else if (r.notaFinal >= 70) faixasNotas['70 a 79 (Regular)']++;
    else faixasNotas['Menor que 70']++;
  });

  const chartFaixasOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: <strong>{c} alunos</strong> ({d}%)' },
    legend: { orient: 'vertical', right: 5, top: 'center', textStyle: { color: textColor, fontSize: 10 } },
    series: [
      {
        name: 'Faixa de Nota',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: darkMode ? '#111827' : '#ffffff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold', color: titleColor }
        },
        data: Object.entries(faixasNotas).filter(([_, v]) => v > 0).map(([name, value], idx) => {
          const colors = ['#00A335', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
          return { name, value, itemStyle: { color: colors[idx % colors.length] } };
        })
      }
    ]
  };

  // 4. Scatter: Frequência vs Nota
  const scatterData = filteredRecords.map(r => [r.frequencia, r.notaFinal, r.nome, r.turma]);

  const chartScatterOption = {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (param: any) => {
        const [freq, nota, nome, turma] = param.data;
        return `<div style="font-weight:bold">${nome}</div>
                <div style="font-size:11px;color:#9ca3af">${turma}</div>
                <div>Frequência: <strong>${freq}%</strong></div>
                <div>Nota Final: <strong>${nota} pts</strong></div>`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Frequência %',
      min: 60,
      max: 100,
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'value',
      name: 'Nota Final',
      min: 60,
      max: 100,
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Aluno',
        type: 'scatter',
        symbolSize: 14,
        data: scatterData,
        itemStyle: {
          color: '#10b981',
          shadowBlur: 10,
          shadowColor: 'rgba(16, 185, 129, 0.5)'
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* Total Concluintes */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Avaliados</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
            {kpis.totalAlunosAvaliados}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            {kpis.totalTurmas} turmas concluídas
          </div>
        </div>

        {/* Média de Notas */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A335] to-emerald-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Média de Notas</span>
            <div className="w-7 h-7 rounded-lg bg-[#00A335]/15 text-[#00A335] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {kpis.mediaNotaFinal}
            </span>
            <span className="text-xs font-normal text-[var(--text-secondary)]">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <Star className="w-3 h-3 fill-current text-emerald-600 dark:text-emerald-400" />
            <span>Desempenho Excelente</span>
          </div>
        </div>

        {/* Média de Frequência */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Frequência Média</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-300 tracking-tight">
            {kpis.mediaFrequencia}%
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Alta assiduidade em aula
          </div>
        </div>

        {/* Taxa de Aprovação */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Aprovação</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-300 tracking-tight">
            {kpis.taxaAprovacaoPct}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            100% Promovidos
          </div>
        </div>

        {/* Total Carga Horária */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Horas Capacitadas</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {kpis.totalHorasCapacitadas}h
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Carga horária acumulada
          </div>
        </div>

        {/* Docentes */}
        <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Corpo Docente</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-300 tracking-tight">
            {kpis.totalDocentes} <span className="text-xs font-normal text-[var(--text-secondary)]">professores</span>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Instrutores SENAI / Intelbras
          </div>
        </div>

      </div>

      {/* Dynamic Filter Bar for Relatório Final */}
      <div className="glass-card p-4 border border-[var(--border-color)] shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--border-highlight)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--intelbras-green)] uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Filtros do Relatório Final de Conclusão de Turmas</span>
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <Search className="w-3 h-3" /> Busca Aluno / Docente
            </label>
            <input
              type="text"
              placeholder="Nome, CPF ou Docente..."
              value={filters.busca}
              onChange={(e) => handleFilterChange('busca', e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--intelbras-green)] transition-colors"
            />
          </div>

          {/* Curso */}
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Curso
            </label>
            <Select
              value={filters.curso}
              onChange={(val) => handleFilterChange('curso', val)}
              options={[
                { value: 'all', label: `Todos os Cursos (${cursos.length})` },
                ...cursos.map(c => ({ value: c, label: c }))
              ]}
            />
          </div>

          {/* Turma */}
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Turma
            </label>
            <Select
              value={filters.turma}
              onChange={(val) => handleFilterChange('turma', val)}
              options={[
                { value: 'all', label: `Todas as Turmas (${turmas.length})` },
                ...turmas.map(t => ({ value: t, label: t }))
              ]}
            />
          </div>

          {/* Docente */}
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Docente
            </label>
            <Select
              value={filters.docente}
              onChange={(val) => handleFilterChange('docente', val)}
              options={[
                { value: 'all', label: 'Todos os Docentes' },
                ...docentes.map(d => ({ value: d, label: d }))
              ]}
            />
          </div>

          {/* Faixa de Nota */}
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <Award className="w-3 h-3" /> Desempenho / Nota
            </label>
            <Select
              value={filters.faixaNota}
              onChange={(val) => handleFilterChange('faixaNota', val)}
              options={[
                { value: 'all', label: 'Todas as Notas' },
                { value: '90-100', label: '90 a 100 (Excelente)' },
                { value: '80-89', label: '80 a 89 (Bom)' },
                { value: '70-79', label: '70 a 79 (Regular)' },
                { value: '<70', label: 'Abaixo de 70' }
              ]}
            />
          </div>

        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Turma Notas e Frequência */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>📊</span> Médias de Nota & Frequência por Turma
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Comparativo de aproveitamento acadêmico e presença</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartTurmaOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 2: Desempenho por Docente */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>👨‍🏫</span> Desempenho Médio por Docente
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Média de notas dos alunos por instrutor responsável</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartDocenteOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 3: Faixas de Notas */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>🎯</span> Distribuição de Faixas de Desempenho
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Percentual de alunos por patamar de pontuação final</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartFaixasOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 4: Matriz Frequência vs Nota */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>📈</span> Correlação: Presença (%) vs Nota Final
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Impacto da assiduidade no rendimento dos estudantes</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartScatterOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

      </div>

      {/* Full Nominal Table for Relatório Final */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--border-highlight)]">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--intelbras-green)]" />
              Quadro de Resultados Finais dos Alunos Concluintes
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Exibindo <strong className="text-[var(--text-primary)]">{filteredRecords.length}</strong> alunos com formação concluída
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportRelatorioFinalToExcel(filteredRecords)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Exportar Excel (.xlsx)
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[var(--bg-primary)]">
              <tr className="border-b border-[var(--border-highlight)] text-[var(--text-secondary)] font-semibold">
                <th onClick={() => handleSort('matricula')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Matrícula</th>
                <th className="p-2.5">CPF</th>
                <th onClick={() => handleSort('nome')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Nome do Aluno</th>
                <th onClick={() => handleSort('curso')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Curso</th>
                <th onClick={() => handleSort('turma')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Turma</th>
                <th className="p-2.5">Carga Horária</th>
                <th onClick={() => handleSort('docente')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Docente</th>
                <th onClick={() => handleSort('notaFinal')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)] text-right">Nota Final</th>
                <th onClick={() => handleSort('frequencia')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Frequência</th>
                <th onClick={() => handleSort('resultadoFinal')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {paginatedRecords.map((r) => {
                const nota = r.notaFinal;
                let notaBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/40';
                if (nota < 80) notaBadge = 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/40';
                if (nota < 70) notaBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/40';

                return (
                  <tr key={r.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-2.5 font-mono text-[var(--intelbras-green)] font-bold">{r.matricula}</td>
                    <td className="p-2.5 text-[var(--text-secondary)] font-mono text-[11px]">{r.cpf}</td>
                    <td className="p-2.5 font-semibold text-[var(--text-primary)]">
                      {r.nome}
                    </td>
                    <td className="p-2.5 text-[var(--text-secondary)] max-w-xs truncate" title={r.curso}>
                      {r.curso}
                    </td>
                    <td className="p-2.5 font-mono text-cyan-600 dark:text-cyan-300 font-medium">{r.turma}</td>
                    <td className="p-2.5 text-[var(--text-secondary)]">{r.cargaHoraria}h</td>
                    <td className="p-2.5 text-[var(--text-secondary)] text-[11px] font-medium">{r.docente}</td>
                    <td className="p-2.5 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold border text-xs ${notaBadge}`}>
                        {r.notaFinal} pts
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[var(--border-highlight)] h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[var(--intelbras-green)] h-full rounded-full"
                            style={{ width: `${r.frequencia}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[var(--text-secondary)]">{r.frequencia}%</span>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                        {r.resultadoFinal}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border-highlight)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>Itens por página:</span>
            <Select
              value={String(pageSize)}
              onChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
              options={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' }
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <span>
              Página <strong className="text-[var(--text-primary)]">{currentPage}</strong> de <strong className="text-[var(--text-primary)]">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--intelbras-light-green)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors text-[var(--text-primary)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--intelbras-light-green)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors text-[var(--text-primary)]"
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

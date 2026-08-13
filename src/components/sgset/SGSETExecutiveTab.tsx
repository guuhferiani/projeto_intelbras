import React from 'react';
import ReactECharts from 'echarts-for-react';
import { SGSETStudent } from '../../types/bi';
import { Award, TrendingUp, Users, Building } from 'lucide-react';

interface SGSETExecutiveTabProps {
  students: SGSETStudent[];
  darkMode: boolean;
}

export const SGSETExecutiveTab: React.FC<SGSETExecutiveTabProps> = ({ students, darkMode }) => {
  const textColor = darkMode ? '#9ca3af' : '#4b5563';
  const titleColor = darkMode ? '#f9fafb' : '#111827';
  const splitLineColor = darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  // 1. Group by Turma / Curso for Stacked Bar
  const turmaStats: Record<string, { ativos: number; concluidos: number; evasao: number; curso: string }> = {};
  students.forEach(s => {
    if (!turmaStats[s.turma]) {
      turmaStats[s.turma] = { ativos: 0, concluidos: 0, evasao: 0, curso: s.curso };
    }
    const sit = s.situacaoAluno.toUpperCase();
    if (sit.includes('ATIVO')) turmaStats[s.turma].ativos++;
    else if (sit.includes('CONCLU') || sit.includes('APROV')) turmaStats[s.turma].concluidos++;
    else if (sit.includes('EVAS') || sit.includes('DESIST') || sit.includes('CANCEL')) turmaStats[s.turma].evasao++;
    else turmaStats[s.turma].ativos++;
  });

  const turmaNames = Object.keys(turmaStats);
  const dataAtivos = turmaNames.map(t => turmaStats[t].ativos);
  const dataConcluidos = turmaNames.map(t => turmaStats[t].concluidos);
  const dataEvasao = turmaNames.map(t => turmaStats[t].evasao);

  const chartTurmasOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        let res = `<div style="font-weight:bold;margin-bottom:4px;color:#fff">${params[0].name}</div>`;
        const turma = turmaStats[params[0].name];
        if (turma) res += `<div style="font-size:11px;color:#9ca3af;margin-bottom:6px">${turma.curso}</div>`;
        params.forEach(p => {
          res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px">
            <span>${p.marker} ${p.seriesName}</span>
            <strong>${p.value} alunos</strong>
          </div>`;
        });
        return res;
      }
    },
    legend: {
      data: ['Ativos', 'Concluídos', 'Evasão'],
      textStyle: { color: textColor },
      top: 5
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: turmaNames,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Ativos',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: '#00A335', borderRadius: [0, 0, 4, 4] },
        data: dataAtivos
      },
      {
        name: 'Concluídos',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: '#14b8a6' },
        data: dataConcluidos
      },
      {
        name: 'Evasão',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: '#f43f5e', borderRadius: [4, 4, 0, 0] },
        data: dataEvasao
      }
    ]
  };

  // 2. Situação Ocupacional Donut
  const ocupStats: Record<string, number> = {};
  students.forEach(s => {
    const o = s.situacaoOcupacional || 'Não Informado';
    ocupStats[o] = (ocupStats[o] || 0) + 1;
  });

  const chartOcupOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: <strong>{c} alunos</strong> ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: textColor, fontSize: 11 }
    },
    series: [
      {
        name: 'Situação Ocupacional',
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
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: titleColor
          }
        },
        data: Object.entries(ocupStats).map(([name, value], idx) => {
          const colors = ['#00A335', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6b7280'];
          return {
            name,
            value,
            itemStyle: { color: colors[idx % colors.length] }
          };
        })
      }
    ]
  };

  // 3. Faixa Etária
  const ageStats: Record<string, number> = {
    'Menor de 18': 0,
    '18 a 24 anos': 0,
    '25 a 35 anos': 0,
    '36 a 50 anos': 0,
    'Mais de 50 anos': 0
  };

  students.forEach(s => {
    if (s.idade < 18) ageStats['Menor de 18']++;
    else if (s.idade <= 24) ageStats['18 a 24 anos']++;
    else if (s.idade <= 35) ageStats['25 a 35 anos']++;
    else if (s.idade <= 50) ageStats['36 a 50 anos']++;
    else ageStats['Mais de 50 anos']++;
  });

  const chartAgeOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: Object.keys(ageStats),
      axisLabel: { color: textColor, fontSize: 10 },
      axisLine: { lineStyle: { color: splitLineColor } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      {
        name: 'Alunos',
        type: 'bar',
        data: Object.values(ageStats),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#1d4ed8' }
            ]
          },
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  };

  // 4. Escolaridade & Gênero
  const escStats: Record<string, number> = {};
  students.forEach(s => {
    const esc = s.escolaridade || 'Não Informado';
    escStats[esc] = (escStats[esc] || 0) + 1;
  });

  const chartEscOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: <strong>{c}</strong> ({d}%)' },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: { color: textColor, fontSize: 10 }
    },
    series: [
      {
        name: 'Escolaridade',
        type: 'pie',
        radius: '65%',
        center: ['50%', '42%'],
        roseType: 'radius',
        itemStyle: { borderRadius: 6 },
        data: Object.entries(escStats).map(([name, value], idx) => {
          const colors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'];
          return {
            name,
            value,
            itemStyle: { color: colors[idx % colors.length] }
          };
        })
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-card p-4 flex items-center gap-3.5 border-l-4 border-l-[#00A335]">
          <div className="w-10 h-10 rounded-xl bg-[#00A335]/20 text-[#00A335] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] font-medium">Turma Destaque</div>
            <div className="font-bold text-[var(--text-primary)] text-sm">
              {turmaNames[0] || 'AUTIPRET 2602NB'}
            </div>
            <div className="text-[11px] text-emerald-400">100% de engajamento ativo</div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3.5 border-l-4 border-l-blue-500">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] font-medium">Inserção no Mercado</div>
            <div className="font-bold text-[var(--text-primary)] text-sm">
              Emprego & Autonomia
            </div>
            <div className="text-[11px] text-blue-400">Maioria dos alunos já atua no setor</div>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3.5 border-l-4 border-l-purple-500">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] font-medium">Capacitação Tecnológica</div>
            <div className="font-bold text-[var(--text-primary)] text-sm">
              Automação & Boas Práticas
            </div>
            <div className="text-[11px] text-purple-400">Formação técnica integrada</div>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1 */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>🎓</span> Situação dos Alunos por Turma e Curso
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Distribuição entre Ativos, Concluídos e Evasão</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartTurmasOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 2 */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>💼</span> Perfil Ocupacional & Empregabilidade
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Situação de trabalho dos participantes no início do curso</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartOcupOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 3 */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>👥</span> Distribuição por Faixa Etária
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Concentração de idade calculada pela data de nascimento</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartAgeOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 4 */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>📚</span> Nível de Escolaridade dos Inscritos
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Grau de instrução formal informado no SGSET</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartEscOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

      </div>

    </div>
  );
};

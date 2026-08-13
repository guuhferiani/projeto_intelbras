import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  Calendar,
  Layers
} from 'lucide-react';
import { SGSETKPIData } from '../../types/bi';
import { formatNumber } from '../../utils/dataParser';

interface SGSETKPICardsProps {
  kpis: SGSETKPIData;
}

export const SGSETKPICards: React.FC<SGSETKPICardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      
      {/* Total Matrículas */}
      <div className="glass-panel glass-card-hover animate-fade-in-up p-4 relative overflow-hidden group" title="Soma total de todos os registros de alunos encontrados.">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Total Matrículas</span>
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[var(--text-primary)] tracking-tight group-hover:text-blue-500 transition-colors">
          {formatNumber(kpis.totalMatriculas)}
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-blue-500" />
          <span>{kpis.totalTurmas} turmas • {kpis.totalCursos} cursos</span>
        </div>
      </div>

      {/* Alunos Ativos */}
      <div className="glass-panel glass-card-hover animate-fade-in-up delay-100 p-4 relative overflow-hidden group" title="Alunos cuja situação indica andamento regular.">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A335] to-emerald-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Alunos Ativos</span>
          <div className="w-7 h-7 rounded-lg bg-[#00A335]/15 text-[#00A335] flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight group-hover:text-[#00A335] transition-colors">
            {formatNumber(kpis.totalAtivos)}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500">
            ({kpis.totalMatriculas > 0 ? ((kpis.totalAtivos / kpis.totalMatriculas) * 100).toFixed(0) : 0}%)
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1">
          Em andamento regular
        </div>
      </div>

      {/* Alunos Concluídos */}
      <div className="glass-panel glass-card-hover animate-fade-in-up delay-200 p-4 relative overflow-hidden group" title="Alunos que concluíram ou foram aprovados.">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Concluídos</span>
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-500 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-teal-600 dark:text-teal-300 tracking-tight group-hover:text-teal-500 transition-colors">
            {formatNumber(kpis.totalConcluidos)}
          </span>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            ({kpis.taxaConclusaoPct.toFixed(1)}%)
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1">
          Cursos finalizados
        </div>
      </div>

      {/* Taxa de Evasão */}
      <div className="glass-panel glass-card-hover animate-fade-in-up delay-300 p-4 relative overflow-hidden group" title="Percentual de alunos evadidos, desistentes ou cancelados sobre o total de matrículas.">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Evasão / Desistência</span>
          <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight group-hover:text-rose-500 transition-colors">
            {formatNumber(kpis.totalEvasao)}
          </span>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-300">
            ({kpis.taxaEvasaoPct.toFixed(1)}%)
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1">
          Índice de perda
        </div>
      </div>

      {/* Taxa de Empregabilidade */}
      <div className="glass-panel glass-card-hover animate-fade-in-up delay-400 p-4 relative overflow-hidden group" title="Percentual de alunos trabalhando formalmente ou como autônomos.">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Empregabilidade</span>
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-purple-600 dark:text-purple-300 tracking-tight group-hover:text-purple-500 transition-colors">
          {kpis.taxaEmpregabilidadePct.toFixed(1)}%
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1">
          Empregados / Autônomos
        </div>
      </div>

      {/* Idade Média */}
      <div className="glass-panel glass-card-hover animate-fade-in-up delay-500 p-4 relative overflow-hidden group" title="Média simples de idade de todos os registros (considerando 25 caso não informado).">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Idade Média</span>
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-amber-600 dark:text-amber-300 tracking-tight group-hover:text-amber-500 transition-colors">
          {kpis.idadeMedia.toFixed(0)} <span className="text-xs font-normal text-[var(--text-secondary)]">anos</span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1">
          Perfil etário geral
        </div>
      </div>

    </div>
  );
};

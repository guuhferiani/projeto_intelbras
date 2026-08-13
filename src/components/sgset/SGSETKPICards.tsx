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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 mb-6">
      
      {/* Total Matrículas */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Matrículas</span>
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {formatNumber(kpis.totalMatriculas)}
        </div>
        <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-blue-400" />
          <span>{kpis.totalTurmas} turmas • {kpis.totalCursos} cursos</span>
        </div>
      </div>

      {/* Alunos Ativos */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A335] to-emerald-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Alunos Ativos</span>
          <div className="w-7 h-7 rounded-lg bg-[#00A335]/15 text-[#00A335] flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-emerald-400 tracking-tight">
            {formatNumber(kpis.totalAtivos)}
          </span>
          <span className="text-xs font-semibold text-emerald-500">
            ({kpis.totalMatriculas > 0 ? ((kpis.totalAtivos / kpis.totalMatriculas) * 100).toFixed(0) : 0}%)
          </span>
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          Em andamento regular
        </div>
      </div>

      {/* Alunos Concluídos */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Concluídos</span>
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-teal-300 tracking-tight">
            {formatNumber(kpis.totalConcluidos)}
          </span>
          <span className="text-xs font-semibold text-teal-400">
            ({kpis.taxaConclusaoPct.toFixed(1)}%)
          </span>
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          Cursos finalizados
        </div>
      </div>

      {/* Taxa de Evasão */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Evasão / Desistência</span>
          <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-rose-400 tracking-tight">
            {formatNumber(kpis.totalEvasao)}
          </span>
          <span className="text-xs font-semibold text-rose-300">
            ({kpis.taxaEvasaoPct.toFixed(1)}%)
          </span>
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          Índice de perda
        </div>
      </div>

      {/* Taxa de Empregabilidade */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Empregabilidade</span>
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-purple-300 tracking-tight">
          {kpis.taxaEmpregabilidadePct.toFixed(1)}%
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          Empregados / Autônomos
        </div>
      </div>

      {/* Idade Média */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Idade Média</span>
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-amber-300 tracking-tight">
          {kpis.idadeMedia.toFixed(0)} <span className="text-xs font-normal text-gray-400">anos</span>
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          Perfil etário geral
        </div>
      </div>

    </div>
  );
};

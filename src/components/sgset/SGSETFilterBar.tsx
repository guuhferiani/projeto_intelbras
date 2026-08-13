import React from 'react';
import { Filter, Search, RotateCcw, BookOpen, Users, GraduationCap, Briefcase, UserCheck } from 'lucide-react';
import { SGSETFilterState, SGSETStudent } from '../../types/bi';

interface SGSETFilterBarProps {
  filters: SGSETFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SGSETFilterState>>;
  students: SGSETStudent[];
  onReset: () => void;
}

export const SGSETFilterBar: React.FC<SGSETFilterBarProps> = ({
  filters,
  setFilters,
  students,
  onReset
}) => {
  const cursos = Array.from(new Set(students.map(s => s.curso))).filter(Boolean).sort();
  const turmas = Array.from(new Set(students.map(s => s.turma))).filter(Boolean).sort();
  const situacoesAluno = Array.from(new Set(students.map(s => s.situacaoAluno))).filter(Boolean).sort();
  const situacoesOcup = Array.from(new Set(students.map(s => s.situacaoOcupacional))).filter(Boolean).sort();
  const escolaridades = Array.from(new Set(students.map(s => s.escolaridade))).filter(Boolean).sort();

  const handleFilterChange = (key: keyof SGSETFilterState, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const isFiltered = 
    filters.curso !== 'all' ||
    filters.turma !== 'all' ||
    filters.situacaoAluno !== 'all' ||
    filters.situacaoOcupacional !== 'all' ||
    filters.escolaridade !== 'all' ||
    filters.sexo !== 'all' ||
    filters.busca.trim() !== '';

  return (
    <div className="glass-card p-4 mb-6 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A335] uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Filtros do Sistema SGSET (Capacitação Técnica & Alunos)</span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        
        {/* Search */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Search className="w-3 h-3" /> Busca Aluno / CPF
          </label>
          <input
            type="text"
            placeholder="Nome, CPF ou Matrícula..."
            value={filters.busca}
            onChange={(e) => handleFilterChange('busca', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00A335] transition-colors"
          />
        </div>

        {/* Curso */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Curso
          </label>
          <select
            value={filters.curso}
            onChange={(e) => handleFilterChange('curso', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer truncate"
          >
            <option value="all">Todos os Cursos ({cursos.length})</option>
            {cursos.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Turma */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3" /> Turma
          </label>
          <select
            value={filters.turma}
            onChange={(e) => handleFilterChange('turma', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todas as Turmas</option>
            {turmas.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Situação Aluno */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Situação Aluno
          </label>
          <select
            value={filters.situacaoAluno}
            onChange={(e) => handleFilterChange('situacaoAluno', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            {situacoesAluno.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Situação Ocupacional */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> Ocupação
          </label>
          <select
            value={filters.situacaoOcupacional}
            onChange={(e) => handleFilterChange('situacaoOcupacional', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer truncate"
          >
            <option value="all">Todas Ocupações</option>
            {situacoesOcup.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Escolaridade */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> Escolaridade
          </label>
          <select
            value={filters.escolaridade}
            onChange={(e) => handleFilterChange('escolaridade', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer truncate"
          >
            <option value="all">Todas Escolaridades</option>
            {escolaridades.map(esc => (
              <option key={esc} value={esc}>{esc}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

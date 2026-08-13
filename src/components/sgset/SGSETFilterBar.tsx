import React from 'react';
import { Filter, Search, RotateCcw, BookOpen, Users, GraduationCap, Briefcase, UserCheck } from 'lucide-react';
import { SGSETFilterState, SGSETStudent } from '../../types/bi';
import { Select } from '../ui/Select';

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
    <div className="glass-card p-4 mb-6 border border-[var(--border-color)] shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--border-color)]">
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
      
      {/* Active Badges */}
      {isFiltered && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.busca && (
            <span className="inline-flex items-center gap-1 bg-[#00A335]/20 text-[#00A335] px-2 py-1 rounded text-[10px] font-bold">
              Busca: {filters.busca}
              <button onClick={() => handleFilterChange('busca', '')} className="hover:text-[var(--text-primary)]">&times;</button>
            </span>
          )}
          {filters.curso !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-[#00A335]/20 text-[#00A335] px-2 py-1 rounded text-[10px] font-bold">
              Curso: {filters.curso}
              <button onClick={() => handleFilterChange('curso', 'all')} className="hover:text-[var(--text-primary)]">&times;</button>
            </span>
          )}
          {filters.turma !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-[#00A335]/20 text-[#00A335] px-2 py-1 rounded text-[10px] font-bold">
              Turma: {filters.turma}
              <button onClick={() => handleFilterChange('turma', 'all')} className="hover:text-[var(--text-primary)]">&times;</button>
            </span>
          )}
          {filters.situacaoAluno !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-[#00A335]/20 text-[#00A335] px-2 py-1 rounded text-[10px] font-bold">
              Status: {filters.situacaoAluno}
              <button onClick={() => handleFilterChange('situacaoAluno', 'all')} className="hover:text-[var(--text-primary)]">&times;</button>
            </span>
          )}
          {filters.situacaoOcupacional !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-[#00A335]/20 text-[#00A335] px-2 py-1 rounded text-[10px] font-bold">
              Ocupação: {filters.situacaoOcupacional}
              <button onClick={() => handleFilterChange('situacaoOcupacional', 'all')} className="hover:text-[var(--text-primary)]">&times;</button>
            </span>
          )}
          {filters.escolaridade !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-[#00A335]/20 text-[#00A335] px-2 py-1 rounded text-[10px] font-bold">
              Escolaridade: {filters.escolaridade}
              <button onClick={() => handleFilterChange('escolaridade', 'all')} className="hover:text-[var(--text-primary)]">&times;</button>
            </span>
          )}
        </div>
      )}

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
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#00A335] transition-colors"
          />
        </div>

        {/* Curso */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
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
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3" /> Turma
          </label>
          <Select
            value={filters.turma}
            onChange={(val) => handleFilterChange('turma', val)}
            options={[
              { value: 'all', label: 'Todas as Turmas' },
              ...turmas.map(t => ({ value: t, label: t }))
            ]}
          />
        </div>

        {/* Situação Aluno */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Situação Aluno
          </label>
          <Select
            value={filters.situacaoAluno}
            onChange={(val) => handleFilterChange('situacaoAluno', val)}
            options={[
              { value: 'all', label: 'Todos os Status' },
              ...situacoesAluno.map(s => ({ value: s, label: s }))
            ]}
          />
        </div>

        {/* Situação Ocupacional */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> Ocupação
          </label>
          <Select
            value={filters.situacaoOcupacional}
            onChange={(val) => handleFilterChange('situacaoOcupacional', val)}
            options={[
              { value: 'all', label: 'Todas Ocupações' },
              ...situacoesOcup.map(o => ({ value: o, label: o }))
            ]}
          />
        </div>

        {/* Escolaridade */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> Escolaridade
          </label>
          <Select
            value={filters.escolaridade}
            onChange={(val) => handleFilterChange('escolaridade', val)}
            options={[
              { value: 'all', label: 'Todas Escolaridades' },
              ...escolaridades.map(esc => ({ value: esc, label: esc }))
            ]}
          />
        </div>

      </div>
    </div>
  );
};

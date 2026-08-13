import React, { useState } from 'react';
import { SGSETStudent, SGSETKPIData } from '../../types/bi';
import { Select } from '../ui/Select';
import { 
  FileSpreadsheet, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  GraduationCap
} from 'lucide-react';
import { exportSGSETToExcel, printReport } from '../../utils/exporter';

interface SGSETStudentsTableTabProps {
  students: SGSETStudent[];
  kpis: SGSETKPIData;
}

export const SGSETStudentsTableTab: React.FC<SGSETStudentsTableTabProps> = ({ students, kpis }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof SGSETStudent>('nome');
  const [sortAsc, setSortAsc] = useState(true);

  // Sorting
  const sortedStudents = [...students].sort((a, b) => {
    const valA = a[sortField] || '';
    const valB = b[sortField] || '';
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = sortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof SGSETStudent) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="glass-card p-5">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--border-highlight)]">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[var(--intelbras-green)]" />
            Relação Nominal de Alunos & Matrículas SGSET
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Exibindo <strong className="text-[var(--text-primary)]">{students.length}</strong> alunos filtrados • {kpis.totalTurmas} turmas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSGSETToExcel(students)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Exportar Excel (.xlsx)
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg border border-[var(--border-color)]">
        <table className="w-full text-left text-xs border-collapse relative">
          <thead className="sticky top-0 z-10 bg-[var(--bg-primary)] backdrop-blur-md shadow-sm">
            <tr className="border-b border-[var(--border-highlight)] text-[var(--text-secondary)] font-semibold">
              <th onClick={() => handleSort('matricula')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Matrícula</th>
              <th className="p-2.5">CPF</th>
              <th onClick={() => handleSort('nome')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Nome do Aluno</th>
              <th className="p-2.5">Sexo / Idade</th>
              <th onClick={() => handleSort('curso')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Curso</th>
              <th onClick={() => handleSort('turma')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Turma</th>
              <th className="p-2.5">Escolaridade</th>
              <th className="p-2.5">Ocupação</th>
              <th onClick={() => handleSort('situacaoAluno')} className="p-2.5 cursor-pointer hover:text-[var(--text-primary)]">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {paginatedStudents.map((s) => {
              const sit = s.situacaoAluno.toUpperCase();
              let badgeColor = 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-highlight)]';
              if (sit.includes('ATIVO')) badgeColor = 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 border-emerald-500/40';
              else if (sit.includes('CONCLU')) badgeColor = 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border-teal-500/40';
              else if (sit.includes('EVAS') || sit.includes('DESIST')) badgeColor = 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40';

              return (
                <tr key={s.id + s.turma} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="p-2.5 font-mono text-[var(--intelbras-green)] font-bold">{s.matricula}</td>
                  <td className="p-2.5 text-[var(--text-secondary)] font-mono text-[11px]">{s.cpf}</td>
                  <td className="p-2.5 font-semibold text-[var(--text-primary)]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      <span>{s.nome}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-[var(--text-secondary)]">
                    {s.sexo} • <strong className="text-[var(--text-primary)]">{s.idade} anos</strong>
                  </td>
                  <td className="p-2.5 text-[var(--text-secondary)] max-w-xs truncate" title={s.curso}>
                    {s.curso}
                  </td>
                  <td className="p-2.5 font-mono text-cyan-600 dark:text-cyan-300 font-medium">{s.turma}</td>
                  <td className="p-2.5 text-[var(--text-secondary)] text-[11px]">{s.escolaridade}</td>
                  <td className="p-2.5 text-[var(--text-secondary)]">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[11px]">
                      {s.situacaoOcupacional}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                      {s.situacaoAluno}
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
              { value: '50', label: '50' }
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
  );
};

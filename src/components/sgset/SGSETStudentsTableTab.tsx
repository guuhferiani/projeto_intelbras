import React, { useState } from 'react';
import { SGSETStudent, SGSETKPIData } from '../../types/bi';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#00A335]" />
            Relação Nominal de Alunos & Matrículas SGSET
          </h3>
          <p className="text-xs text-gray-400">
            Exibindo <strong>{students.length}</strong> alunos filtrados • {kpis.totalTurmas} turmas
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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 font-semibold bg-white/5">
              <th onClick={() => handleSort('matricula')} className="p-2.5 cursor-pointer hover:text-white">Matrícula</th>
              <th className="p-2.5">CPF</th>
              <th onClick={() => handleSort('nome')} className="p-2.5 cursor-pointer hover:text-white">Nome do Aluno</th>
              <th className="p-2.5">Sexo / Idade</th>
              <th onClick={() => handleSort('curso')} className="p-2.5 cursor-pointer hover:text-white">Curso</th>
              <th onClick={() => handleSort('turma')} className="p-2.5 cursor-pointer hover:text-white">Turma</th>
              <th className="p-2.5">Escolaridade</th>
              <th className="p-2.5">Ocupação</th>
              <th onClick={() => handleSort('situacaoAluno')} className="p-2.5 cursor-pointer hover:text-white">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedStudents.map((s) => {
              const sit = s.situacaoAluno.toUpperCase();
              let badgeColor = 'bg-gray-700 text-gray-200 border-gray-600';
              if (sit.includes('ATIVO')) badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              else if (sit.includes('CONCLU')) badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
              else if (sit.includes('EVAS') || sit.includes('DESIST')) badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

              return (
                <tr key={s.id + s.turma} className="hover:bg-white/5 transition-colors">
                  <td className="p-2.5 font-mono text-[#00A335] font-bold">{s.matricula}</td>
                  <td className="p-2.5 text-gray-400 font-mono text-[11px]">{s.cpf}</td>
                  <td className="p-2.5 font-semibold text-white">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>{s.nome}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-gray-300">
                    {s.sexo} • <strong className="text-white">{s.idade} anos</strong>
                  </td>
                  <td className="p-2.5 text-gray-200 max-w-xs truncate" title={s.curso}>
                    {s.curso}
                  </td>
                  <td className="p-2.5 font-mono text-cyan-300 font-medium">{s.turma}</td>
                  <td className="p-2.5 text-gray-300 text-[11px]">{s.escolaridade}</td>
                  <td className="p-2.5 text-gray-300">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
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
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>Itens por página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-900 border border-white/10 rounded px-2 py-1 text-white"
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
              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

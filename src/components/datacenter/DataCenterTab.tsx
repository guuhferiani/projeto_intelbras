import React from 'react';
import { 
  FolderCheck, 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  HardDrive,
  Database,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { exportSGSETToExcel, exportRelatorioFinalToExcel, exportFinanceiroToExcel } from '../../utils/exporter';
import { SGSETStudent, RelatorioFinalRecord, FinanceiroRecord } from '../../types/bi';

interface DataCenterTabProps {
  students: SGSETStudent[];
  relatorioRecords: RelatorioFinalRecord[];
  financeiroRecords: FinanceiroRecord[];
  onOpenUploadModal: () => void;
}

export const DataCenterTab: React.FC<DataCenterTabProps> = ({
  students,
  relatorioRecords,
  financeiroRecords,
  onOpenUploadModal
}) => {
  const folders = [
    {
      name: 'Dados SGSET (Matrículas & Alunos)',
      path: 'public/data/Dados SGSET',
      files: ['AUTIPRET 2602NB.xlsx', 'BOPMET 2604NB.xlsx'],
      count: students.length,
      unit: 'alunos',
      desc: 'Dados demográficos, escolaridade, curso, turma, gênero e situação ocupacional.',
      onExport: () => exportSGSETToExcel(students),
      badgeColor: 'bg-blue-500/15 text-blue-500 border-blue-500/30'
    },
    {
      name: 'Relatório Final (Notas & Frequência)',
      path: 'public/data/Relatório_Final',
      files: ['AUTIPRET 2602NB.xlsx', 'BOPMET 2604NB.xlsx'],
      count: relatorioRecords.length,
      unit: 'concluintes avaliados',
      desc: 'Médias acadêmicas, frequência em aula, faltas, docentes responsáveis e resultado final.',
      onExport: () => exportRelatorioFinalToExcel(relatorioRecords),
      badgeColor: 'bg-[#00A335]/15 text-[#00A335] border-[#00A335]/30'
    },
    {
      name: 'Financeiro (Bolsas & Ajuda de Custo)',
      path: 'public/data/Financeiro',
      files: ['AUTIPRET 2602NB.xlsm', 'BOPMET 2604NB.xlsm'],
      count: financeiroRecords.length,
      unit: 'lançamentos financeiros',
      desc: 'Valores de bolsa auxílio, ajuda de custo, descontos por ausência e total realizado.',
      onExport: () => exportFinanceiroToExcel(financeiroRecords),
      badgeColor: 'bg-purple-500/15 text-purple-500 border-purple-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#00882B] via-[#00A335] to-[#00B33C] text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-3">
            <Database className="w-3.5 h-3.5" />
            <span>Central de Dados Integrados</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Gestão de Bases de Dados & Planilhas Excel
          </h2>
          <p className="text-xs text-emerald-50 leading-relaxed">
            O Intelbras BI processa automaticamente planilhas salvas nas pastas locais ou enviadas diretamente pelo navegador, recalculando todos os dashboards em tempo real.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 rounded-xl bg-white text-[#00882B] hover:bg-emerald-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Importar Nova Planilha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Folders & Databases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {folders.map((f, idx) => (
          <div key={idx} className="glass-card p-5 flex flex-col justify-between group hover:border-[#00A335]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A335]/15 text-[#00A335] flex items-center justify-center font-bold">
                  <FolderCheck className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${f.badgeColor}`}>
                  {f.count} {f.unit}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                {f.name}
              </h3>
              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg mb-3 break-all">
                📂 {f.path}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {f.desc}
              </p>

              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Arquivos integrados:
              </div>
              <ul className="space-y-1 mb-4">
                {f.files.map((file, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#00A335]" />
                    <span>{file}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={f.onExport}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-[#00A335]/30 text-[#00A335] hover:bg-[#00A335] hover:text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Base Completa (.xlsx)</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

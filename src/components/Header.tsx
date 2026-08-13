import React from 'react';
import { 
  UploadCloud, 
  Download, 
  Moon, 
  Sun, 
  RefreshCw, 
  CheckCircle2,
  Menu
} from 'lucide-react';
import { IntelbrasLogo } from './logos/IntelbrasLogo';
import { printReport } from '../utils/exporter';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  recordCount: number;
  dataSourceName: string;
  onRefresh: () => void;
  onOpenUploadModal: () => void;
  activeTab: string;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  recordCount,
  dataSourceName,
  onRefresh,
  onOpenUploadModal,
  activeTab,
  onToggleSidebar
}) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    executive: {
      title: 'Dashboard Executivo & Indicadores',
      subtitle: 'Visão consolidada de matrículas, turmas e engajamento SGSET'
    },
    commercial: {
      title: 'Relação Nominal de Alunos & Cadastros',
      subtitle: 'Quadro completo de estudantes, perfil demográfico e situação'
    },
    relatorio_final: {
      title: 'Relatório Final & Avaliação Pedagógica',
      subtitle: 'Médias acadêmicas, frequência, corpo docente e aprovação'
    },
    financeiro: {
      title: 'Gestão Financeira, Bolsas & Benefícios',
      subtitle: 'Demonstrativo de valores realizados, auxílios e retenções por falta'
    },
    datacenter: {
      title: 'Central de Bases de Dados & Integrações',
      subtitle: 'Gerenciamento de arquivos Excel das pastas de dados e exportações'
    }
  };

  const currentInfo = titles[activeTab] || titles.executive;

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#0b1120]/70 border-b border-white/20 dark:border-white/5 backdrop-blur-xl px-6 py-4 transition-all duration-400 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left Side: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5">
              <IntelbrasLogo variant="green" size="sm" />
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">
                {currentInfo.title}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F8EE] dark:bg-[#00A335]/15 border border-[#00A335]/30 text-[#00882B] dark:text-[#00A335] text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{recordCount.toLocaleString('pt-BR')} registros ativos</span>
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00A335] hover:bg-[#00882B] text-white font-semibold text-xs shadow-lg shadow-[#00A335]/30 hover:shadow-[#00A335]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            title="Importar novas planilhas de dados"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden md:inline">Importar Planilhas</span>
          </button>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md p-1 rounded-xl border border-white/40 dark:border-white/10 shadow-sm">
            <button
              onClick={printReport}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              title="Imprimir / Exportar Relatório em PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#00A335] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              title="Recarregar Bases de Dados"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              title="Alternar Tema Claro / Escuro"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

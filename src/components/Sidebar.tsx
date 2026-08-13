import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Award, 
  DollarSign, 
  FolderCheck,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { IntelbrasLogo } from './logos/IntelbrasLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (val: boolean) => void;
  onOpenUploadModal: () => void;
  totalAlunos: number;
  totalLancamentos: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileMenuOpen = false,
  setMobileMenuOpen,
  onOpenUploadModal,
  totalAlunos,
  totalLancamentos
}) => {
  const menuItems = [
    {
      id: 'executive',
      label: 'Dashboard Executivo',
      icon: LayoutDashboard,
      badge: 'Geral',
      desc: 'Indicadores SGSET'
    },
    {
      id: 'commercial',
      label: 'Relação de Alunos',
      icon: GraduationCap,
      badge: `${totalAlunos}`,
      desc: 'Cadastros e Turmas'
    },
    {
      id: 'relatorio_final',
      label: 'Relatório Final & Notas',
      icon: Award,
      badge: 'Conclusão',
      desc: 'Desempenho e Docentes'
    },
    {
      id: 'financeiro',
      label: 'Gestão Financeira & Bolsas',
      icon: DollarSign,
      badge: `${totalLancamentos}`,
      desc: 'Extrato e Repasses'
    },
    {
      id: 'datacenter',
      label: 'Central de Bases & Upload',
      icon: FolderCheck,
      badge: '3 Bases',
      desc: 'Gerenciador de Arquivos'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[var(--bg-card)] backdrop-blur-xl border-r border-[var(--border-color)] transition-all duration-400 ease-in-out flex flex-col justify-between shadow-[4px_0_24px_-4px_rgba(0,0,0,0.1)] dark:shadow-none 
          ${collapsed ? 'hidden md:flex w-20' : 'w-72'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
      {/* Top Header / Brand Block */}
      <div>
        <div className="h-20 bg-gradient-to-r from-[#00882B] via-[#00A335] to-[#00B33C] px-4 flex items-center justify-between text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center">
                <IntelbrasLogo variant="green" size="sm" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span>BI ANALYTICS</span>
                </div>
                <div className="text-[10px] text-emerald-100 font-medium tracking-wide opacity-90 uppercase">
                  Gestão & Inteligência
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center">
                <IntelbrasLogo variant="green" size="sm" />
              </div>
            </div>
          )}

          {/* Toggle Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Section Title */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Módulos do Sistema
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-300 ease-out cursor-pointer relative group ${
                  isActive
                    ? 'bg-[#E8F8EE]/80 dark:bg-[#00A335]/15 text-[#00882B] dark:text-[#00A335] font-bold shadow-sm backdrop-blur-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-medium hover:translate-x-1'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#00A335] rounded-r-full shadow-md shadow-[#00A335]/40" />
                )}

                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-[#00A335] text-white shadow-md shadow-[#00A335]/30' 
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-[#00A335] group-hover:bg-[#E8F8EE] dark:group-hover:bg-[#00A335]/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-none">{item.label}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] mt-1 truncate">
                        {item.desc}
                      </div>
                    </div>

                    {item.badge && (
                      <span 
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? 'bg-[#00A335] text-white shadow-sm'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Footer Block */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] backdrop-blur-md">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#00A335]" />
                <span>Base Conectada</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
                SGSET • Relatório Final • Financeiro
              </p>
            </div>

            <button
              onClick={onOpenUploadModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#00A335] hover:bg-[#00882B] text-white font-semibold text-xs shadow-lg shadow-[#00A335]/30 hover:shadow-[#00A335]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Importar Planilha</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenUploadModal}
            className="w-full flex justify-center py-2.5 rounded-xl bg-[#00A335] hover:bg-[#00882B] text-white shadow-lg shadow-[#00A335]/30 hover:shadow-[#00A335]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            title="Importar Planilhas"
          >
            <UploadCloud className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
    </>
  );
};

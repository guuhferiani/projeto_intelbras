import { useState, useEffect, useMemo } from 'react';
import type { SGSETStudent, SGSETKPIData, SGSETFilterState, RelatorioFinalRecord, FinanceiroRecord } from './types/bi';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SGSETKPICards } from './components/sgset/SGSETKPICards';
import { SGSETFilterBar } from './components/sgset/SGSETFilterBar';
import { SGSETExecutiveTab } from './components/sgset/SGSETExecutiveTab';
import { SGSETStudentsTableTab } from './components/sgset/SGSETStudentsTableTab';
import { RelatorioFinalTab } from './components/relatorio/RelatorioFinalTab';
import { FinanceiroTab } from './components/financeiro/FinanceiroTab';
import { DataCenterTab } from './components/datacenter/DataCenterTab';
import { SGSETUploadModal } from './components/sgset/SGSETUploadModal';
import { loadLiveFinancialFiles } from './utils/dataParser';
import { 
  fetchAllDataFromApi,
  fetchSGSETStudentsFromNeon, 
  fetchRelatorioFinalFromNeon, 
  fetchFinanceiroFromNeon 
} from './services/neonService';

export function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState<SGSETStudent[]>([]);
  const [relatorioFinalRecords, setRelatorioFinalRecords] = useState<RelatorioFinalRecord[]>([]);
  const [financeiroRecords, setFinanceiroRecords] = useState<FinanceiroRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSourceName, setDataSourceName] = useState('Bases Integradas Intelbras');
  const [activeTab, setActiveTab] = useState<'executive' | 'commercial' | 'relatorio_final' | 'financeiro' | 'datacenter'>('executive');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filters for SGSET General
  const [filters, setFilters] = useState<SGSETFilterState>({
    curso: 'all',
    turma: 'all',
    situacaoAluno: 'all',
    situacaoOcupacional: 'all',
    escolaridade: 'all',
    sexo: 'all',
    raca: 'all',
    busca: ''
  });

  // Load All Real Data on Mount (Vercel API / Neon DB First, Fallback to Local JSON)
  const loadDefaultData = async () => {
    setLoading(true);
    let neonSuccess = false;
    try {
      // 1. Try Vercel Serverless Backend API (/api/data)
      const apiData = await fetchAllDataFromApi();
      if (apiData && (apiData.students.length > 0 || apiData.relatorio.length > 0 || apiData.financeiro.length > 0)) {
        if (apiData.students.length > 0) setStudents(apiData.students);
        if (apiData.relatorio.length > 0) setRelatorioFinalRecords(apiData.relatorio);
        if (apiData.financeiro.length > 0) setFinanceiroRecords(apiData.financeiro);
        setDataSourceName('Neon PostgreSQL (bi-intelbras)');
        neonSuccess = true;
      }

      // 2. If API not present (e.g. direct client dev), try direct Neon query
      if (!neonSuccess) {
        const [neonStudents, neonRelatorio, neonFinanceiro] = await Promise.all([
          fetchSGSETStudentsFromNeon().catch(() => []),
          fetchRelatorioFinalFromNeon().catch(() => []),
          fetchFinanceiroFromNeon().catch(() => [])
        ]);

        if (neonStudents.length > 0 || neonRelatorio.length > 0 || neonFinanceiro.length > 0) {
          if (neonStudents.length > 0) setStudents(neonStudents);
          if (neonRelatorio.length > 0) setRelatorioFinalRecords(neonRelatorio);
          if (neonFinanceiro.length > 0) setFinanceiroRecords(neonFinanceiro);
          setDataSourceName('Neon PostgreSQL (bi-intelbras)');
          neonSuccess = true;
        }
      }
    } catch (err) {
      console.warn('Neon connection failed, falling back to local files:', err);
    }

    if (!neonSuccess) {
      try {
        // 1. SGSET Students Fallback
        const resStudents = await fetch('/data/sgset_consolidado.json');
        if (resStudents.ok) {
          const dataStudents: SGSETStudent[] = await resStudents.json();
          setStudents(dataStudents);
        }

        // 2. Relatório Final Records Fallback
        const resRelatorio = await fetch('/data/relatorio_final_consolidado.json');
        if (resRelatorio.ok) {
          const dataRelatorio: RelatorioFinalRecord[] = await resRelatorio.json();
          setRelatorioFinalRecords(dataRelatorio);
        }

        // 3. Financeiro Records - Direct Live Load from public/data/Financeiro
        const liveFinanceData = await loadLiveFinancialFiles();
        setFinanceiroRecords(liveFinanceData);

        setDataSourceName('AUTIPRET 2602NB & BOPMET 2604NB (Local)');
      } catch (err) {
        console.error('Erro ao carregar dados locais:', err);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDefaultData();
  }, []);

  // Filtered Students for SGSET General
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (filters.curso !== 'all' && s.curso !== filters.curso) return false;
      if (filters.turma !== 'all' && s.turma !== filters.turma) return false;
      if (filters.situacaoAluno !== 'all' && s.situacaoAluno !== filters.situacaoAluno) return false;
      if (filters.situacaoOcupacional !== 'all' && s.situacaoOcupacional !== filters.situacaoOcupacional) return false;
      if (filters.escolaridade !== 'all' && s.escolaridade !== filters.escolaridade) return false;
      if (filters.sexo !== 'all' && s.sexo !== filters.sexo) return false;
      
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase();
        const matchName = s.nome.toLowerCase().includes(q);
        const matchMatricula = s.matricula.toLowerCase().includes(q);
        const matchCpf = s.cpf.toLowerCase().includes(q);
        const matchCurso = s.curso.toLowerCase().includes(q);
        const matchTurma = s.turma.toLowerCase().includes(q);
        if (!matchName && !matchMatricula && !matchCpf && !matchCurso && !matchTurma) return false;
      }

      return true;
    });
  }, [students, filters]);

  // Compute SGSET KPIs dynamically
  const kpis = useMemo<SGSETKPIData>(() => {
    const total = filteredStudents.length;
    if (total === 0) {
      return {
        totalMatriculas: 0,
        totalAtivos: 0,
        totalConcluidos: 0,
        totalEvasao: 0,
        taxaConclusaoPct: 0,
        taxaEvasaoPct: 0,
        taxaEmpregabilidadePct: 0,
        totalTurmas: 0,
        totalCursos: 0,
        idadeMedia: 0
      };
    }

    let ativos = 0;
    let concluidos = 0;
    let evasao = 0;
    let empregados = 0;
    let sumIdade = 0;

    const turmasSet = new Set<string>();
    const cursosSet = new Set<string>();

    filteredStudents.forEach(s => {
      turmasSet.add(s.turma);
      cursosSet.add(s.curso);
      sumIdade += s.idade || 25;

      const sit = s.situacaoAluno.toUpperCase();
      if (sit.includes('ATIVO')) ativos++;
      else if (sit.includes('CONCLU') || sit.includes('APROV')) concluidos++;
      else if (sit.includes('EVAS') || sit.includes('DESIST') || sit.includes('CANCEL')) evasao++;
      else ativos++;

      const ocup = (s.situacaoOcupacional || '').toLowerCase();
      if (ocup.includes('empregado') || ocup.includes('autonomo') || ocup.includes('autônomo') || ocup.includes('empregador')) {
        empregados++;
      }
    });

    return {
      totalMatriculas: total,
      totalAtivos: ativos,
      totalConcluidos: concluidos,
      totalEvasao: evasao,
      taxaConclusaoPct: +((concluidos / total) * 100).toFixed(1),
      taxaEvasaoPct: +((evasao / total) * 100).toFixed(1),
      taxaEmpregabilidadePct: +((empregados / total) * 100).toFixed(1),
      totalTurmas: turmasSet.size,
      totalCursos: cursosSet.size,
      idadeMedia: Math.round(sumIdade / total)
    };
  }, [filteredStudents]);

  const handleResetFilters = () => {
    setFilters({
      curso: 'all',
      turma: 'all',
      situacaoAluno: 'all',
      situacaoOcupacional: 'all',
      escolaridade: 'all',
      sexo: 'all',
      raca: 'all',
      busca: ''
    });
  };

  const handleDataLoaded = (newStudents: SGSETStudent[], sourceLabel: string) => {
    setStudents(newStudents);
    setDataSourceName(sourceLabel);
  };

  const currentRecordCount = activeTab === 'relatorio_final' 
    ? relatorioFinalRecords.length 
    : activeTab === 'financeiro'
    ? financeiroRecords.length
    : filteredStudents.length;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : 'light'}`}>
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenUploadModal={() => setIsUploadOpen(true)}
        totalAlunos={students.length}
        totalLancamentos={financeiroRecords.length}
      />

      {/* 2. Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}
      >
        {/* Top Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          recordCount={currentRecordCount}
          dataSourceName={dataSourceName}
          onRefresh={loadDefaultData}
          onOpenUploadModal={() => setIsUploadOpen(true)}
          activeTab={activeTab}
          onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
          
          {/* Dynamic Views */}
          {loading ? (
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-4 h-28 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="skeleton-box h-4 w-20"></div>
                      <div className="skeleton-box h-7 w-7 rounded-lg"></div>
                    </div>
                    <div className="skeleton-box h-8 w-16 mt-2"></div>
                    <div className="skeleton-box h-3 w-24 mt-3"></div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-4 h-24 mb-6">
                <div className="skeleton-box h-6 w-48 mb-4"></div>
                <div className="grid grid-cols-6 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton-box h-10 w-full"></div>
                  ))}
                </div>
              </div>
              <div className="glass-card h-[500px] w-full skeleton-box"></div>
            </div>
          ) : (
            <div>
              {/* Module 1: Dashboard Executivo SGSET */}
              {activeTab === 'executive' && (
                <>
                  <SGSETKPICards kpis={kpis} />
                  <SGSETFilterBar
                    filters={filters}
                    setFilters={setFilters}
                    students={students}
                    onReset={handleResetFilters}
                  />
                  {filteredStudents.length === 0 ? (
                    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🔍</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Nenhum aluno encontrado</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">Tente ajustar os filtros para encontrar os resultados desejados.</p>
                      <button onClick={handleResetFilters} className="px-4 py-2 bg-[#00A335] text-white font-semibold text-sm rounded-lg hover:bg-[#00882B] transition-colors cursor-pointer">
                        Limpar Filtros
                      </button>
                    </div>
                  ) : (
                    <SGSETExecutiveTab students={filteredStudents} darkMode={darkMode} />
                  )}
                </>
              )}

              {/* Module 2: Relação Nominal de Alunos */}
              {activeTab === 'commercial' && (
                <>
                  <SGSETKPICards kpis={kpis} />
                  <SGSETFilterBar
                    filters={filters}
                    setFilters={setFilters}
                    students={students}
                    onReset={handleResetFilters}
                  />
                  {filteredStudents.length === 0 ? (
                    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📭</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">A tabela está vazia</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">Nenhum registro corresponde aos filtros atuais.</p>
                      <button onClick={handleResetFilters} className="px-4 py-2 bg-[#00A335] text-white font-semibold text-sm rounded-lg hover:bg-[#00882B] transition-colors cursor-pointer">
                        Limpar Filtros
                      </button>
                    </div>
                  ) : (
                    <SGSETStudentsTableTab students={filteredStudents} kpis={kpis} />
                  )}
                </>
              )}

              {/* Module 3: Relatório Final & Desempenho */}
              {activeTab === 'relatorio_final' && (
                <RelatorioFinalTab records={relatorioFinalRecords} darkMode={darkMode} />
              )}

              {/* Module 4: Gestão Financeira & Bolsas */}
              {activeTab === 'financeiro' && (
                <FinanceiroTab records={financeiroRecords} darkMode={darkMode} />
              )}

              {/* Module 5: Central de Bases & Upload */}
              {activeTab === 'datacenter' && (
                <DataCenterTab
                  students={students}
                  relatorioRecords={relatorioFinalRecords}
                  financeiroRecords={financeiroRecords}
                  onOpenUploadModal={() => setIsUploadOpen(true)}
                />
              )}
            </div>
          )}

        </main>

        {/* 3. Footer with Official SENAI & Intelbras Logos */}
        <Footer />
      </div>

      {/* Upload Modal */}
      <SGSETUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
      />

    </div>
  );
}

export default App;

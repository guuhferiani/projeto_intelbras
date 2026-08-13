import React from 'react';
import { Filter, Search, RotateCcw, Calendar, MapPin, Tag, UserCheck, ShieldCheck } from 'lucide-react';
import { FilterState, SaleRecord } from '../types/bi';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  rawData: SaleRecord[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  rawData,
  onReset
}) => {
  // Extract unique options dynamically from rawData
  const segmentos = Array.from(new Set(rawData.map(r => r.Segmento))).filter(Boolean).sort();
  const regioes = Array.from(new Set(rawData.map(r => r.Regiao))).filter(Boolean).sort();
  const estados = Array.from(new Set(rawData.map(r => r.Estado_UF))).filter(Boolean).sort();
  const vendedores = Array.from(new Set(rawData.map(r => r.Vendedor))).filter(Boolean).sort();
  const canais = Array.from(new Set(rawData.map(r => r.Canal))).filter(Boolean).sort();
  const statuses = Array.from(new Set(rawData.map(r => r.Status_Pedido))).filter(Boolean).sort();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isFiltered = 
    filters.periodo !== 'all' ||
    filters.segmento !== 'all' ||
    filters.regiao !== 'all' ||
    filters.estado !== 'all' ||
    filters.vendedor !== 'all' ||
    filters.canal !== 'all' ||
    filters.status !== 'all' ||
    filters.busca.trim() !== '';

  return (
    <div className="glass-card p-4 mb-6 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00A335] uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Filtros Dinâmicos de Inteligência</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
        
        {/* Search */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Search className="w-3 h-3" /> Busca Geral
          </label>
          <input
            type="text"
            placeholder="Cliente, NF, Produto..."
            value={filters.busca}
            onChange={(e) => handleFilterChange('busca', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00A335] transition-colors"
          />
        </div>

        {/* Período */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Período
          </label>
          <select
            value={filters.periodo}
            onChange={(e) => handleFilterChange('periodo', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todo o Histórico</option>
            <option value="2026">Ano 2026</option>
            <option value="2025">Ano 2025</option>
            <option value="last90">Últimos 90 dias</option>
            <option value="last30">Últimos 30 dias</option>
          </select>
        </div>

        {/* Segmento */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Segmento
          </label>
          <select
            value={filters.segmento}
            onChange={(e) => handleFilterChange('segmento', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todos os Segmentos</option>
            {segmentos.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
        </div>

        {/* Região / UF */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Região / UF
          </label>
          <select
            value={filters.regiao}
            onChange={(e) => handleFilterChange('regiao', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todas as Regiões</option>
            {regioes.map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>

        {/* Vendedor */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Vendedor
          </label>
          <select
            value={filters.vendedor}
            onChange={(e) => handleFilterChange('vendedor', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todos os Vendedores</option>
            {vendedores.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Canal */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1">
            Canal de Venda
          </label>
          <select
            value={filters.canal}
            onChange={(e) => handleFilterChange('canal', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todos os Canais</option>
            {canais.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Status Pedido
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full bg-gray-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00A335] transition-colors cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

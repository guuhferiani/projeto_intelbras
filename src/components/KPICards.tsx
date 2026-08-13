import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  ShoppingBag, 
  Users, 
  Target, 
  CreditCard 
} from 'lucide-react';
import { KPIData } from '../types/bi';
import { formatCurrency, formatNumber } from '../utils/dataParser';

interface KPICardsProps {
  kpis: KPIData;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const isPositiveGrowth = kpis.comparativoFaturamentoPct >= 0;
  const isMetaBatida = kpis.atingimentoMetaPct >= 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* Card 1: Faturamento Total */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A335] to-emerald-400"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Faturamento Total</span>
          <div className="w-8 h-8 rounded-lg bg-[#00A335]/15 text-[#00A335] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight mb-1">
          {formatCurrency(kpis.faturamentoTotal)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
          <div className={`flex items-center gap-1 font-semibold ${isPositiveGrowth ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveGrowth ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositiveGrowth ? '+' : ''}{kpis.comparativoFaturamentoPct.toFixed(1)}% vs anterior</span>
          </div>
          <span className="text-[11px] text-gray-400">Histórico</span>
        </div>
      </div>

      {/* Card 2: Atingimento de Meta */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Atingimento de Meta</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <div className="text-2xl font-black text-white tracking-tight">
            {kpis.atingimentoMetaPct.toFixed(1)}%
          </div>
          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${isMetaBatida ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
            {isMetaBatida ? 'Meta Batida' : 'Em Progresso'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 text-gray-400">
          <span>Meta: <strong className="text-gray-200">{formatCurrency(kpis.metaTotal)}</strong></span>
        </div>
      </div>

      {/* Card 3: Margem Bruta & Lucro */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Margem Bruta Média</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight mb-1">
          {kpis.margemMediaPct.toFixed(1)}%
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 text-gray-400">
          <span>Lucro Bruto: <strong className="text-emerald-400">{formatCurrency(kpis.lucroBrutoTotal)}</strong></span>
        </div>
      </div>

      {/* Card 4: Ticket Médio */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ticket Médio / Venda</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight mb-1">
          {formatCurrency(kpis.ticketMedio)}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 text-gray-400">
          <span>Itens Vendidos: <strong className="text-gray-200">{formatNumber(kpis.produtosVendidos)} un</strong></span>
        </div>
      </div>

      {/* Card 5: Volume de Pedidos & Clientes */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-400"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pedidos & Clientes</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight mb-1">
          {formatNumber(kpis.volumePedidos)} <span className="text-xs font-normal text-gray-400">pedidos</span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-gray-200">{kpis.clientesUnicos}</strong> clientes ativos</span>
          </div>
        </div>
      </div>

    </div>
  );
};

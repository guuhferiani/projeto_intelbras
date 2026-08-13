import React from 'react';
import { SenaiLogo } from './logos/SenaiLogo';
import { IntelbrasLogo } from './logos/IntelbrasLogo';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] py-8 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logos Pair */}
        <div className="flex items-center gap-6">
          {/* Intelbras Logo */}
          <div className="flex items-center gap-2">
            <IntelbrasLogo variant="green" size="md" />
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* SENAI Logo */}
          <div className="flex items-center gap-2">
            <SenaiLogo size="sm" />
          </div>
        </div>

        {/* Partnership & Institution Details */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#00A335]" />
            <span>Parceria Estratégica de Educação & Tecnologia</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Intelbras S.A. & Serviço Nacional de Aprendizagem Industrial (SENAI-SP) • Unidade 106 - Mariano Ferraz
          </p>
        </div>

        {/* System Info */}
        <div className="text-center md:text-right text-[11px] text-slate-400 dark:text-slate-500">
          <div>Intelbras BI • SGSET Analytics v2.0</div>
          <div className="text-[10px] mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center md:justify-end gap-1">
            <span>Ambiente Seguro e Atualizado</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

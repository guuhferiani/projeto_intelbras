import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseFileToData } from '../../utils/dataParser';
import { SGSETStudent, RelatorioFinalRecord, FinanceiroRecord } from '../../types/bi';
import { saveDataToNeon } from '../../services/neonService';

export interface LoadedDataPayload {
  students?: SGSETStudent[];
  relatorio?: RelatorioFinalRecord[];
  financeiro?: FinanceiroRecord[];
  sourceLabel: string;
}

interface SGSETUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (payload: LoadedDataPayload) => void;
}

export const SGSETUploadModal: React.FC<SGSETUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    setStatusMsg(null);

    try {
      let combinedStudents: SGSETStudent[] = [];
      let combinedRelatorio: RelatorioFinalRecord[] = [];
      let combinedFinanceiro: FinanceiroRecord[] = [];
      const fileNames: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileNames.push(file.name);
        const res = await parseFileToData(file);

        if (res.type === 'sgset') {
          combinedStudents = [...combinedStudents, ...(res.data as SGSETStudent[])];
        } else if (res.type === 'relatorio_final') {
          combinedRelatorio = [...combinedRelatorio, ...(res.data as RelatorioFinalRecord[])];
        } else if (res.type === 'financeiro') {
          combinedFinanceiro = [...combinedFinanceiro, ...(res.data as FinanceiroRecord[])];
        }
      }

      const totalItems = combinedStudents.length + combinedRelatorio.length + combinedFinanceiro.length;

      if (totalItems > 0) {
        const payload: LoadedDataPayload = {
          students: combinedStudents.length > 0 ? combinedStudents : undefined,
          relatorio: combinedRelatorio.length > 0 ? combinedRelatorio : undefined,
          financeiro: combinedFinanceiro.length > 0 ? combinedFinanceiro : undefined,
          sourceLabel: fileNames.join(', ')
        };

        // 1. Save permanently to Neon Cloud Database
        await saveDataToNeon(payload);

        // 2. Update local state
        onDataLoaded(payload);

        const details = [
          combinedStudents.length > 0 ? `${combinedStudents.length} alunos` : '',
          combinedRelatorio.length > 0 ? `${combinedRelatorio.length} notas` : '',
          combinedFinanceiro.length > 0 ? `${combinedFinanceiro.length} lançamentos` : ''
        ].filter(Boolean).join(', ');

        setStatusMsg({
          type: 'success',
          text: `Sucesso! Salvo no banco Neon e sincronizado: ${details}.`
        });

        setTimeout(() => {
          onClose();
          setStatusMsg(null);
        }, 1800);
      } else {
        setStatusMsg({
          type: 'error',
          text: 'Nenhum dado reconhecido (SGSET, Relatório Final ou Financeiro) nas planilhas selecionadas.'
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: `Erro ao processar: ${err.message || 'Formato inválido'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card max-w-lg w-full p-6 relative border border-[var(--border-color)] shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--intelbras-light-green)] text-[var(--intelbras-green)] flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Importar Novas Planilhas</h2>
            <p className="text-xs text-[var(--text-secondary)]">Os dados serão acrescentados às turmas existentes sem apagar nada</p>
          </div>
        </div>

        {/* Drag Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-[var(--intelbras-green)] bg-[var(--intelbras-tint)]'
              : 'border-[var(--border-color)] hover:border-[var(--intelbras-green)] bg-[var(--bg-secondary)]'
          }`}
          onClick={() => document.getElementById('file-upload-input')?.click()}
        >
          <input
            id="file-upload-input"
            type="file"
            multiple
            accept=".xlsx,.xls,.xlsm,.csv"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <FileSpreadsheet className="w-10 h-10 text-[var(--intelbras-green)] mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            Arraste e solte suas planilhas aqui
          </p>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Suporta SGSET, Relatório Final ou Financeiro (.xlsx, .xlsm, .csv)
          </p>
          
          <span className="inline-block px-3.5 py-2 rounded-lg bg-[var(--intelbras-green)] text-white text-xs font-semibold shadow-md shadow-[var(--intelbras-green)]/30">
            Selecionar Arquivos
          </span>
        </div>

        {loading && (
          <div className="mt-4 text-center text-xs text-[var(--intelbras-green)] font-semibold animate-pulse">
            Processando e mesclando dados com as bases ativas...
          </div>
        )}

        {statusMsg && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[var(--border-highlight)] text-[11px] text-[var(--text-secondary)]">
          ✨ <strong>Modo Incremental Ativo:</strong> Novos alunos e turmas serão somados aos dados já carregados.
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseFileToData } from '../../utils/dataParser';
import { SGSETStudent } from '../../types/bi';

interface SGSETUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (students: SGSETStudent[], fileName: string) => void;
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
      const fileNames: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileNames.push(file.name);
        const res = await parseFileToData(file);
        if (res.type === 'sgset') {
          combinedStudents = [...combinedStudents, ...(res.data as SGSETStudent[])];
        }
      }

      if (combinedStudents.length > 0) {
        onDataLoaded(combinedStudents, fileNames.join(', '));
        setStatusMsg({
          type: 'success',
          text: `Sucesso! Carregados ${combinedStudents.length} alunos de ${files.length} arquivo(s).`
        });
        setTimeout(() => {
          onClose();
          setStatusMsg(null);
        }, 1200);
      } else {
        setStatusMsg({
          type: 'error',
          text: 'Nenhum dado de aluno/SGSET reconhecido nas planilhas selecionadas.'
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
      <div className="glass-card max-w-lg w-full p-6 relative border border-white/20 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00A335]/20 text-[#00A335] flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Importar Planilhas SGSET</h2>
            <p className="text-xs text-gray-400">Adicione novos arquivos .xlsx ou .csv de turmas</p>
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
              ? 'border-[#00A335] bg-[#00A335]/10'
              : 'border-white/20 hover:border-[#00A335]/50 bg-white/5'
          }`}
          onClick={() => document.getElementById('file-upload-input')?.click()}
        >
          <input
            id="file-upload-input"
            type="file"
            multiple
            accept=".xlsx,.xls,.csv"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <FileSpreadsheet className="w-10 h-10 text-[#00A335] mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-white mb-1">
            Arraste e solte planilhas Excel aqui
          </p>
          <p className="text-xs text-gray-400 mb-4">
            ou clique para navegar nos seus arquivos (.xlsx, .xls, .csv)
          </p>
          
          <span className="inline-block px-3 py-1.5 rounded-lg bg-[#00A335] text-white text-xs font-semibold shadow-md shadow-[#00A335]/30">
            Selecionar Arquivos
          </span>
        </div>

        {loading && (
          <div className="mt-4 text-center text-xs text-[#00A335] font-semibold animate-pulse">
            Processando planilhas e calculando métricas...
          </div>
        )}

        {statusMsg && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400">
          💡 <strong>Dica:</strong> Você também pode salvar os arquivos permanentemente na pasta:
          <div className="font-mono text-[10px] text-gray-300 mt-1 bg-black/40 p-1.5 rounded border border-white/5 truncate">
            ...\public\data\Dados SGSET\
          </div>
        </div>

      </div>
    </div>
  );
};

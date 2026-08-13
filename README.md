# Intelbras BI & SGSET Analytics 📊

Aplicação web moderna de Business Intelligence (BI) para gestão educacional, pedagógica e financeira de cursos e turmas em parceria **Intelbras & SENAI São Paulo (Escola Mariano Ferraz)**.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS v4 + Identidade Visual Oficial Intelbras (Verde `#00A335`)
- **Gráficos:** Apache ECharts (`echarts` + `echarts-for-react`)
- **Ícones:** Lucide React
- **Processamento de Planilhas:** SheetJS (`xlsx`) e PapaParse

---

## 🔒 Segurança e Proteção de Dados Sensíveis

> [!IMPORTANT]
> Por questões de privacidade, conformidade com a **LGPD** e proteção de dados sensíveis (nomes de alunos, CPFs, notas e valores financeiros), **nenhuma planilha com dados reais é versionada no repositório**.

### Como a proteção funciona:
1. Todas as pastas de dados (`public/data/Dados SGSET/`, `public/data/Relatório_Final/`, `public/data/Financeiro/`) e extensões (`*.xlsx`, `*.xlsm`, `*.xls`, `*.csv`, `*.json`) estão incluídas no arquivo [`.gitignore`](.gitignore).
2. Seus dados permanecem **100% locais no seu computador** e nunca são transmitidos para o GitHub.

### Como adicionar seus dados localmente:
Basta criar as pastas e colocar suas planilhas correspondentes em:
- `public/data/Dados SGSET/` (Planilhas de matrículas e alunos)
- `public/data/Relatório_Final/` (Planilhas de notas, frequência e docentes)
- `public/data/Financeiro/` (Planilhas de bolsas, auxílios e descontos)

Ou simplesmente clicar em **"Importar Planilha"** no painel da aplicação para processar qualquer arquivo diretamente no navegador.

---

## 🛠️ Como Executar o Projeto Localmente

1. Clone o repositório:
```bash
git clone https://github.com/guuhferiani/projeto_intelbras.git
cd projeto_intelbras
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

---

## 👥 Parceria Estratégica
- **Intelbras S.A.**
- **SENAI São Paulo** — Escola SENAI Mariano Ferraz

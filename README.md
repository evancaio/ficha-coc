# 📜 Ficha de Personagem - Call of Cthulhu 7ª Edição

Uma aplicação web moderna e visualmente impressionante para criar e gerenciar fichas de personagem para Call of Cthulhu 7ª Edição.

## ✨ Características

- 🎨 **Design Temático**: Estética vintage anos 1920 com elementos de horror cósmico
- 🔢 **Cálculos Automáticos**: Stats derivados calculados automaticamente (HP, MP, Sanidade, Bônus de Dano, etc.)
- 💾 **Salvamento Local**: Personagens salvos no navegador (localStorage)
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile
- 🇧🇷 **100% em Português**: Todas as perícias e ocupações traduzidas
- ⚡ **Performance**: Construído com Next.js 16 e React 19

## 🎮 Funcionalidades Implementadas

### ✅ Completo
- Informações básicas do personagem
- 8 características principais (STR, CON, SIZ, DEX, APP, INT, POW, EDU)
- Valores derivados (metade e um quinto) calculados automaticamente
- Stats derivados: HP, MP, Sanidade, Sorte, Movimento, Bônus de Dano, Corpo
- Pontos de perícia ocupacionais e pessoais
- Sistema de backstory completo
- Salvamento e carregamento de personagens

### 🚧 Em Desenvolvimento
- Sistema completo de perícias (95+ perícias catalogadas)
- Gerenciamento de armas e combate
- Múltiplos personagens
- Exportação para PDF

## 🚀 Como Usar

### Desenvolvimento Local

1. **Instalar dependências** (já feito):
```bash
npm install
```

2. **Iniciar servidor de desenvolvimento**:
```bash
npm run dev
```

3. **Abrir no navegador**:
```
http://localhost:3000
```

### Build para Produção

```bash
npm run build
npm start
```

## 📦 Deploy no Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Inicializar Git** (se ainda não fez):
```bash
git init
git add .
git commit -m "Initial commit: CoC character sheet"
```

2. **Criar repositório no GitHub**:
   - Vá para https://github.com/new
   - Crie um novo repositório
   - Copie a URL do repositório

3. **Push para GitHub**:
```bash
git remote add origin <URL-DO-SEU-REPOSITORIO>
git branch -M main
git push -u origin main
```

4. **Deploy no Vercel**:
   - Acesse https://vercel.com
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - Vercel detectará automaticamente que é Next.js
   - Clique em "Deploy"

### Opção 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

## 🎨 Design System

### Paleta de Cores
- **Papel Envelhecido**: `#f4e8d0`, `#e8dcc4`
- **Sépia**: `#3d2f1f`, `#6b5644`, `#a89176`
- **Tinta**: `#1a1410`, `#4a3f35`
- **Místico**: Roxo eldritch `#4a2c5e`, Verde `#2d4a3e`
- **Acentos**: Dourado `#d4af37`, Vermelho sangue `#8b2e2e`

### Tipografia
- **Display**: IM Fell English (títulos)
- **Typewriter**: Special Elite (inputs)
- **Body**: Crimson Text (texto geral)

## 📁 Estrutura do Projeto

```
coc-ficha/
├── app/
│   ├── globals.css          # Design system global
│   └── page.tsx              # Página principal
├── components/
│   ├── CharacterSheet.tsx    # Componente principal da ficha
│   └── CharacterSheet.module.css
├── data/
│   └── skills.ts             # 95+ perícias em português
├── types/
│   └── character.ts          # TypeScript types
└── utils/
    ├── calculations.ts       # Cálculos de stats
    └── storage.ts            # LocalStorage helpers
```

## 🎯 Próximos Passos

1. Implementar lista completa de perícias com alocação de pontos
2. Sistema de armas e combate
3. Gerenciador de múltiplos personagens
4. Exportação para PDF
5. Temas alternativos (modo escuro total)
6. Sistema de ocupações com perícias pré-definidas

## 📝 Notas Técnicas

- **Framework**: Next.js 16 (App Router)
- **React**: 19
- **TypeScript**: Sim
- **Styling**: CSS Modules + CSS Variables
- **Estado**: React Hooks (useState, useEffect)
- **Persistência**: localStorage (navegador)

## 🐛 Problemas Conhecidos

Nenhum no momento! 🎉

## 📄 Licença

Este projeto é para uso pessoal. Call of Cthulhu é uma marca registrada da Chaosium Inc.

---

**Desenvolvido com ❤️ para mestres e jogadores de Call of Cthulhu**

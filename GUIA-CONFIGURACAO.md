# ⚙️ CrankCat Pro — Guia Completo de Configuração
## Google Sheets como banco de dados gratuito + GitHub Pages

---

## 📋 Visão geral

```
[App no GitHub Pages] ←→ [Apps Script API] ←→ [Google Sheets]
        ↕
[IndexedDB local — funciona offline]
```

- O **App** fica hospedado no GitHub Pages (gratuito)
- O **Apps Script** funciona como uma API REST gratuita
- O **Google Sheets** é o banco de dados (você vê tudo em planilha!)
- O **IndexedDB** guarda uma cópia local para funcionar offline

---

## 🗂️ Arquivos necessários

| Arquivo | Onde usar |
|---|---|
| `index.html` | GitHub Pages (app principal) |
| `manifest.json` | GitHub Pages (config PWA) |
| `sw.js` | GitHub Pages (offline) |
| `icon-192.png` | GitHub Pages (ícone) |
| `icon-512.png` | GitHub Pages (ícone) |
| `Code.gs` | Google Apps Script (API backend) |

---

## 🚀 PARTE 1 — Configurar o banco de dados (Google Sheets + Apps Script)

### Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Clique em **"+"** para criar uma planilha nova
3. Dê o nome: **CrankCat Pro**
4. Deixe a planilha aberta

### Passo 2 — Abrir o Apps Script

1. No menu da planilha: **Extensões → Apps Script**
2. Uma nova aba abrirá com o editor de código
3. Você verá um arquivo `Código.gs` com uma função vazia

### Passo 3 — Colar o código

1. **Selecione todo o código** que já existe no editor (Ctrl+A)
2. **Delete** tudo
3. Abra o arquivo `Code.gs` que está no ZIP
4. **Copie todo o conteúdo** e cole no editor do Apps Script
5. Clique no ícone de **💾 salvar** (ou Ctrl+S)
6. Dê o nome ao projeto: **CrankCat API**

### Passo 4 — Implantar como Web App

1. Clique em **"Implantar"** (botão azul, canto superior direito)
2. Selecione **"Nova implantação"**
3. Clique no ícone de engrenagem ⚙ ao lado de "Tipo"
4. Selecione **"App da Web"**
5. Preencha:
   - **Descrição:** `CrankCat API v1`
   - **Executar como:** `Eu (seu e-mail)`
   - **Quem pode acessar:** `Qualquer pessoa`
6. Clique em **"Implantar"**
7. Aparecerá uma janela pedindo autorização:
   - Clique em **"Autorizar acesso"**
   - Escolha sua conta Google
   - Clique em **"Avançado"** → **"Acessar CrankCat API (não seguro)"**
   - Clique em **"Permitir"**
8. Copie a **URL da Web App** — parece com:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   ⚠️ **Guarde essa URL!** Você vai precisar dela no app.

---

## 🌐 PARTE 2 — Publicar no GitHub Pages

### Passo 1 — Criar repositório

1. Acesse [github.com](https://github.com) (crie conta grátis se não tiver)
2. Clique em **"New"** (botão verde)
3. Nome do repositório: `crankcat`
4. Visibilidade: **Public**
5. Clique em **"Create repository"**

### Passo 2 — Upload dos arquivos

1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste estes 6 arquivos de uma vez:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
3. Clique em **"Commit changes"**

### Passo 3 — Ativar GitHub Pages

1. Vá em **Settings** (engrenagem) → **Pages** (menu lateral esquerdo)
2. Em **"Build and deployment"**:
   - Source: **Deploy from a branch**
   - Branch: **main** / Folder: **/ (root)**
3. Clique em **"Save"**
4. Aguarde ~2 minutos
5. Acesse: `https://SEU_USUARIO.github.io/crankcat`

---

## 🔗 PARTE 3 — Conectar o App ao Google Sheets

1. Abra o app: `https://SEU_USUARIO.github.io/crankcat`
2. Toque na aba **"Config"** (ícone de engrenagem, última aba)
3. No campo **"URL do Apps Script"**, cole a URL que você copiou no Passo 4
4. Toque em **"Salvar & Testar"**
5. Se aparecer **"✅ API conectada!"** — está funcionando! 🎉
6. O app vai sincronizar automaticamente com o Google Sheets

---

## 📱 PARTE 4 — Instalar como app no Android

1. Abra o endereço do seu app no **Chrome para Android**
2. O Chrome mostrará um banner **"Adicionar à tela inicial"**
   - Ou toque nos **3 pontos ⋮** → **"Adicionar à tela inicial"** → **"Instalar"**
3. O ícone CrankCat aparece na tela inicial ✅

---

## 🔄 Como funciona a sincronização

| Situação | O que acontece |
|---|---|
| Online + API configurada | Salva no Sheets em tempo real |
| Offline | Salva apenas no IndexedDB local |
| Volta online | Badge muda para "Sincronizado" |
| Botão "Enviar local → Nuvem" | Força envio de todos os dados locais |
| Botão "Nuvem → Local" | Baixa todos os dados do Sheets |

---

## 👁️ Ver os dados no Google Sheets

Após cadastrar os primeiros eixos no app, abra sua planilha no Google Sheets. 
Você verá uma aba **"eixos"** criada automaticamente com todos os dados em colunas.

Você pode:
- ✅ **Ver** todos os dados
- ✅ **Filtrar** e **ordenar** pela planilha
- ✅ **Imprimir** direto da planilha
- ⚠️ **Não edite** os dados diretamente na planilha — use sempre o app

---

## ❓ Problemas comuns

**"Erro: verifique a URL e as permissões"**
→ Certifique-se de que "Quem pode acessar" está como **"Qualquer pessoa"** na implantação

**O badge fica "Sem nuvem" mesmo com internet**
→ Tente reimplantar o Apps Script com uma **nova implantação** (não editar a existente)

**Dados não aparecem depois de reimplantar**
→ Quando reimplanta, a URL muda! Copie a nova URL e cole novamente no Config do app.

**Dados aparecendo duplicados**
→ Use o botão "Nuvem → Local" para sincronizar. O sistema detecta IDs duplicados automaticamente.

---

*CrankCat Pro — Feito para retificadores profissionais* ⚙️

# Toy Store — Protótipo ServiceNow Studio

Protótipo navegável que reproduz a identidade visual do **ServiceNow Studio** para a aplicação **Toy Store**, construído a partir dos dois update sets exportados (XML) e dos screenshots do ambiente original.

![preview](preview.png)

## O que está incluído

O protótipo replica as quatro abas vistas no Studio:

1. **Toy Store** — visão geral da aplicação (componentes, tabelas, update sets).
2. **Solicitar Brinquedo** — preview do *Record Producer* que grava em `u_pedido`.
   Campos:
   - `Produto` (Reference → `u_u_produto`) — obrigatório
   - `Comentários adicionais` (Multi Line Text)
   - `Data da entrega` (Date) — obrigatório
   - `Digite seu nome` (Single Line Text) — obrigatório
   - `Prioridade` (Lookup Select → `priority`)
3. **Nova Categoria** — preview do *Catalog Item*.
   Campos:
   - `Categoria` (Single Line Text) — obrigatório
   - `Cadastro é urgente?` (Yes/No) — obrigatório
   - `Receber retorno?` (CheckBox, com tooltip)
4. **Solicitação de brinquedos** — *Flow* completo com trigger `Pedido Created`, bloco *If prioridade crítica → Send Email*, e ações de `Update Record` / `Wait For Condition`. Clique em cada etapa para abrir os detalhes.

## Interações disponíveis

- Alternar entre abas (e fechar qualquer uma com o `×`)
- Alternar o preview entre **Portal**, **Now Mobile** e **Virtual Agent**
- Preencher os formulários — as *pills* em "Required information" vão ficando riscadas à medida que os campos obrigatórios são preenchidos; quando tudo está preenchido o botão **Submit** é habilitado
- Clicar em cada passo do Flow para ver configuração simulada em um modal
- Expandir / recolher os grupos do painel **Data** no designer do Flow

## Como rodar localmente

Como é HTML/CSS/JS puro, basta abrir o `index.html` direto no navegador — ou, para evitar qualquer surpresa de CORS, servir com um servidor local:

### Opção 1 — abrir direto

```bash
# macOS / Linux
open index.html

# Windows (PowerShell)
start index.html
```

### Opção 2 — servidor local (recomendado)

```bash
# Python 3 (já vem instalado em Mac/Linux e em Windows moderno)
python3 -m http.server 8080
# depois abra http://localhost:8080
```

```bash
# Node (se tiver o npx disponível)
npx serve .
```

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub, por exemplo `toy-store-prototype`.
2. Dentro da pasta deste projeto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Toy Store prototype"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/toy-store-prototype.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages** e selecione o branch `main` (`/` root). O protótipo ficará disponível em
   `https://<seu-usuario>.github.io/toy-store-prototype/`.

## Estrutura dos arquivos

```
toy-store-prototype/
├── index.html    # estrutura do Studio + panes de cada aba
├── styles.css    # identidade visual (header verde ServiceNow, sidebar, tabs, flow canvas)
├── app.js        # interatividade (tabs, required fields, flow modal, data panel)
└── README.md
```

## Notas de fidelidade visual

- Paleta derivada direto dos screenshots: header em `#032d42`, verde do logo em `#62d84e`, acento azul em `#2f79d1`, vermelho obrigatório em `#d6414d`.
- Tipografia **Source Sans 3** (mesma família usada pela SN Now Experience, sem licenças proprietárias).
- Ícones em SVG inline — nenhuma dependência externa além da fonte do Google.
- Submit desabilitado / habilitado seguindo a regra visual do Service Portal (cinza → azul ServiceNow).

## Limitações

Isso é um **protótipo de UI** — os XMLs foram usados apenas para extrair a **estrutura** (nomes, tipos, ordem dos campos, obrigatoriedade, tooltip). Não há persistência nem integração real com nenhuma instância ServiceNow.

O conteúdo do Flow (passos 1–5, condições, e-mail, update record) foi reconstruído a partir do screenshot — se você tiver um update set do próprio Flow, dá para refinar ainda mais os detalhes de cada ação.

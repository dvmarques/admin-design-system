## Context

Ver `proposal.md` para a motivação. A biblioteca distribui tokens como variáveis CSS públicas e metadados TypeScript, enquanto componentes React são estilizados internamente com Tailwind CSS. Como os tokens alcançam todos os componentes e aplicações consumidoras, a mudança exige uma camada semântica que evite valores de cor e tipografia específicos em cada componente.

Após a fundação inicial, uma segunda passagem de propagação alinhará as proporções e a hierarquia aos padrões públicos de bibliotecas de componentes estabelecidas. A ordem de referência é PrimeReact, shadcn/ui, Ant Design e Chakra UI. A intenção é compatibilidade de linguagem visual, não reprodução de implementações, temas ou ativos de terceiros.

## Goals / Non-Goals

**Goals:**

- Definir uma fundação visual moderna, sóbria e legível que se propague pelos componentes existentes.
- Tornar papéis tipográficos e de cor consistentes, personalizáveis e verificáveis nos dois temas.
- Preservar a compatibilidade dos tokens públicos; novos aliases semânticos terão precedência sobre remoções.
- Atualizar o catálogo e os baselines visuais para tornar o refinamento revisável.
- Consolidar uma densidade compacta e moderna de interface administrativa nos componentes existentes.

**Non-Goals:**

- Redesenhar fluxos, criar componentes, variantes, dependências de runtime ou APIs públicas de componentes.
- Tornar uma fonte remota obrigatória para consumidores; a pilha precisa funcionar integralmente com fallbacks locais.
- Substituir a marca de uma aplicação consumidora ou impedir sua personalização de tokens.

## Decisions

### 1. Pilha tipográfica e escala

O padrão será `Inter, Roboto, sans-serif`. Inter (SIL Open Font License 1.1) será a fonte principal e Roboto (Apache License 2.0), o fallback opcional; ambas permitem uso e redistribuição comercial. A distribuição incluirá somente os arquivos de fontes livres efetivamente empacotados e seus textos de licença. Famílias proprietárias, como Segoe UI, Helvetica Neue e Arial, não integrarão a pilha documentada nem os artefatos distribuídos. A fonte será declarada pelo token público de família, permitindo substituição por marca.

A escala seguirá uma progressão compacta, apropriada para administração: `12, 14, 16, 18, 20, 24, 30, 36 px`, com corpo padrão de `14 px`. Os pesos padrão serão `400`, `500`, `600` e `700`; os line-heights serão `1.5` para corpo, `1.4` para texto de interface e `1.2–1.3` para títulos. Esta combinação cria hierarquia sem inflar telas densas.

O corpo, rótulos e conteúdo comum de controles usarão a base de `14 px`; textos auxiliares usarão `12 px`. Os títulos principais usarão tokens semânticos de `20`, `24`, `30` e `36 px`. Dialogs, drawers, toasts e tooltips seguem a mesma hierarquia; qualquer exceção deve ser representada por um token semântico, e não por uma declaração local.

Alternativas consideradas:

- `16 px` como corpo padrão: favorece leitura longa, mas ocupa espaço excessivo em tabelas, filtros e formulários administrativos.
- Fonte exclusiva de marca: rejeitada como padrão porque aumenta acoplamento e risco de FOUT; permanece possível via sobrescrita de token, desde que a aplicação consumidora detenha a licença necessária.

### 1.1 Densidade, forma e referências visuais

Os controles interativos compartilharão alturas de `32 px` (`sm`), `36 px` (`md`) e `40 px` (`lg`). O raio padrão de controles será `6 px`, enquanto superfícies e overlays usarão `8 px`. Formas completamente arredondadas serão reservadas a elementos intencionalmente em pílula, como tags e avatares. Controles somente de ícone permanecem quadrados e devem alinhar o ícone de forma óptica e geométrica à mesma escala.

PrimeReact orienta prioritariamente a densidade prática e as proporções administrativas. shadcn/ui orienta a aplicação contida de tokens semânticos e superfícies. Ant Design orienta a base de conteúdo de `14 px` e a organização sistemática de controles. Chakra UI orienta variantes de tamanho e de estado previsíveis. As referências são empregadas somente como princípios de design público: nenhum código, CSS, tema, ativo visual, nome ou arquivo dessas bibliotecas será copiado.

### 2. Cores primitivas e papéis semânticos

Os valores são organizados em duas camadas: uma escala interna de cores e tokens públicos de papel semântico. Os componentes só consomem a segunda camada. Isso permite trocar os valores de uma paleta sem modificar estilos de componentes, e evita expor detalhes do Tailwind na API pública.

Base clara proposta:

| Papel          | Valor     |
| -------------- | --------- |
| canvas         | `#F8FAFC` |
| surface        | `#FFFFFF` |
| surface-muted  | `#F1F5F9` |
| text-primary   | `#0F172A` |
| text-secondary | `#475569` |
| border         | `#E2E8F0` |
| primary        | `#2563EB` |
| focus          | `#2563EB` |
| info           | `#0369A1` |
| success        | `#15803D` |
| warning        | `#B45309` |
| danger         | `#B91C1C` |

Base escura proposta:

| Papel          | Valor     |
| -------------- | --------- |
| canvas         | `#0F172A` |
| surface        | `#111827` |
| surface-muted  | `#1E293B` |
| text-primary   | `#F8FAFC` |
| text-secondary | `#CBD5E1` |
| border         | `#334155` |
| primary        | `#60A5FA` |
| focus          | `#93C5FD` |
| info           | `#7DD3FC` |
| success        | `#86EFAC` |
| warning        | `#FCD34D` |
| danger         | `#FDA4AF` |

Cada estado terá tokens separados para conteúdo, fundo sutil e borda. Para ações preenchidas, o token de conteúdo sobre a cor de ação será escolhido e testado como par, em vez de pressupor que branco serve para todo tom. Estados desabilitados continuam semanticamente distintos, sem serem usados para transmitir informação essencial.

Alternativas consideradas:

- Usar valores hex diretamente por componente: rejeitado por impedir coerência entre temas e substituição global.
- Usar apenas cores primitivas públicas: rejeitado porque transfere a decisão semântica para cada consumidor.

### 2.1 Tema de overlays e controles de fechar

Dialog, drawer e toast continuarão usando `surfaceRaised` como fundo da caixa: `#FFFFFF` no tema claro e `#1E293B` no tema escuro. O portal MUST preservar o `data-theme` mais próximo do ponto de origem e acompanhar alterações do tema enquanto o overlay estiver aberto, mesmo quando o conteúdo for anexado a `document.body`.

Os controles de fechar compartilharão papéis semânticos próprios para fundo, conteúdo e hover. Os valores iniciais serão:

| Papel do controle de fechar | Tema claro | Tema escuro |
| --------------------------- | ---------- | ----------- |
| fundo                       | `#F1F5F9`  | `#334155`   |
| conteúdo (ícone X)          | `#0F172A`  | `#F8FAFC`   |
| fundo no hover              | `#E2E8F0`  | `#475569`   |

O ícone MUST atingir contraste mínimo de `4.5:1` contra os fundos padrão e de hover. O foco continuará usando o papel semântico `focus`, com contraste mínimo de `3:1` contra a superfície adjacente. A dimensão de `32 px`, o SVG atual e o feedback de pressionamento permanecem inalterados.

Alternativas consideradas:

- Usar `textMuted` sobre fundo transparente: rejeitado porque aproxima visualmente o ícone da superfície e não oferece contraste estável em todos os escopos de tema.
- Ler somente o tema do elemento `html`: rejeitado porque aplicações consumidoras e o Storybook podem aplicar `data-theme` em um escopo local.

### 3. Contraste e foco

Os pares críticos buscarão no mínimo `4.5:1` para texto normal e `3:1` para texto grande, controles e indicadores gráficos aplicáveis. O anel de foco terá contraste mínimo de `3:1` com a superfície adjacente, espessura visível e não dependerá somente de mudança de cor. A validação cobrirá canvas/surface, conteúdo primário/secundário, ação preenchida, estados e foco nos dois temas.

### 4. Integração e distribuição

As variáveis CSS públicas usarão o prefixo `--ads-` e serão declaradas no escopo de tema existente. As configurações e mapeamentos estáticos do Tailwind devem referenciar essas variáveis; não serão construídas classes dinamicamente. A folha compilada continua sendo o artefato distribuído, portanto apps Next.js e consumidores sem Tailwind recebem os mesmos tokens sem escanear o código-fonte da biblioteca.

Esta mudança não altera a fronteira entre Server e Client Components: tokens e estilos permanecem independentes de JavaScript do cliente; componentes interativos preservam seus limites `"use client"` existentes.

### 5. Histórias, snapshots e documentação

Cada história afetada deverá selecionar explicitamente tema claro e escuro e expor estados visuais representativos já suportados pelo componente. Os snapshots aprovados serão renovados somente após revisão humana dos dois temas. A documentação pública incluirá a nova pilha, escala, tokens customizáveis e os critérios de contraste relevantes.

## Risks / Trade-offs

- [Tokens públicos com uso não mapeado] → Fazer inventário antes da alteração e manter aliases de compatibilidade; qualquer remoção exige migração e versionamento apropriado.
- [Contraste suficiente no token isolado, mas insuficiente em sobreposições] → Validar os pares reais de foreground/background e as superfícies de overlay nos dois temas.
- [Portal escapar do escopo de tema local] → Propagar e observar o `data-theme` do ponto de origem no host do portal, com testes de troca de tema durante um overlay aberto.
- [Diferenças de métrica entre fontes fallback] → Usar uma escala em pixels e line-heights relativos, com revisão visual usando Inter e Roboto.
- [Distribuição indevida de fonte proprietária] → Restringir o pacote a Inter e Roboto, incluir seus avisos de licença e revisar os artefatos publicados antes da versão.
- [Snapshots excessivamente amplos ocultarem a intenção da mudança] → Organizar cenários por componente, tema e estado, com aprovação visual direcionada.

## Migration Plan

1. Inventariar os tokens atuais e seu consumo por componentes, histórias e aplicação de demonstração.
2. Introduzir a camada revisada e aliases compatíveis; migrar gradualmente os componentes para papéis semânticos.
3. Atualizar documentação, histórias e snapshots após revisão visual nos temas claro e escuro.
4. Executar verificações de contraste, testes, build e consumo do pacote distribuído.
5. Se houver regressão visual ou de contraste, restaurar os aliases/valores anteriores e reverter os baselines associados sem alteração de API de componente.

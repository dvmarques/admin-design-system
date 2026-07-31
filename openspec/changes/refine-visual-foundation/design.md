## Context

Ver `proposal.md` para a motivação. A biblioteca distribui tokens como variáveis CSS públicas e metadados TypeScript, enquanto componentes React são estilizados internamente com Tailwind CSS. Como os tokens alcançam todos os componentes e aplicações consumidoras, a mudança exige uma camada semântica que evite valores de cor e tipografia específicos em cada componente.

## Goals / Non-Goals

**Goals:**

- Definir uma fundação visual moderna, sóbria e legível que se propague pelos componentes existentes.
- Tornar papéis tipográficos e de cor consistentes, personalizáveis e verificáveis nos dois temas.
- Preservar a compatibilidade dos tokens públicos; novos aliases semânticos terão precedência sobre remoções.
- Atualizar o catálogo e os baselines visuais para tornar o refinamento revisável.

**Non-Goals:**

- Redesenhar fluxos, criar componentes, variantes, dependências de runtime ou APIs públicas de componentes.
- Tornar uma fonte remota obrigatória para consumidores; a pilha precisa funcionar integralmente com fallbacks locais.
- Substituir a marca de uma aplicação consumidora ou impedir sua personalização de tokens.

## Decisions

### 1. Pilha tipográfica e escala

O padrão será `Inter, Roboto, sans-serif`. Inter (SIL Open Font License 1.1) será a fonte principal e Roboto (Apache License 2.0), o fallback opcional; ambas permitem uso e redistribuição comercial. A distribuição incluirá somente os arquivos de fontes livres efetivamente empacotados e seus textos de licença. Famílias proprietárias, como Segoe UI, Helvetica Neue e Arial, não integrarão a pilha documentada nem os artefatos distribuídos. A fonte será declarada pelo token público de família, permitindo substituição por marca.

A escala seguirá uma progressão compacta, apropriada para administração: `12, 14, 16, 18, 20, 24, 30, 36 px`, com corpo padrão de `14 px`. Os pesos padrão serão `400`, `500`, `600` e `700`; os line-heights serão `1.5` para corpo, `1.4` para texto de interface e `1.2–1.3` para títulos. Esta combinação cria hierarquia sem inflar telas densas.

Alternativas consideradas:

- `16 px` como corpo padrão: favorece leitura longa, mas ocupa espaço excessivo em tabelas, filtros e formulários administrativos.
- Fonte exclusiva de marca: rejeitada como padrão porque aumenta acoplamento e risco de FOUT; permanece possível via sobrescrita de token, desde que a aplicação consumidora detenha a licença necessária.

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
- [Diferenças de métrica entre fontes fallback] → Usar uma escala em pixels e line-heights relativos, com revisão visual usando Inter e Roboto.
- [Distribuição indevida de fonte proprietária] → Restringir o pacote a Inter e Roboto, incluir seus avisos de licença e revisar os artefatos publicados antes da versão.
- [Snapshots excessivamente amplos ocultarem a intenção da mudança] → Organizar cenários por componente, tema e estado, com aprovação visual direcionada.

## Migration Plan

1. Inventariar os tokens atuais e seu consumo por componentes, histórias e aplicação de demonstração.
2. Introduzir a camada revisada e aliases compatíveis; migrar gradualmente os componentes para papéis semânticos.
3. Atualizar documentação, histórias e snapshots após revisão visual nos temas claro e escuro.
4. Executar verificações de contraste, testes, build e consumo do pacote distribuído.
5. Se houver regressão visual ou de contraste, restaurar os aliases/valores anteriores e reverter os baselines associados sem alteração de API de componente.

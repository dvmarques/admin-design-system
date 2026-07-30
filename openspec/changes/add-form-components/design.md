## Context

O pacote `@admin-ds/components` já expõe primitivas React prefixadas por `Ads` e um CSS compilado que consome tokens `--ads-*`. A nova família precisa preservar esse contrato para aplicações Next.js, oferecer controles semânticos e evitar transformar a biblioteca em um gerenciador de formulários. Consulte `proposal.md` para a motivação e as specs da change para os comportamentos públicos.

## Goals / Non-Goals

**Goals:**

- Entregar uma API pública pequena e consistente para controles e composição de campos no pacote existente.
- Priorizar elementos HTML nativos e associações semânticas reutilizáveis, mantendo a maior parte dos componentes compatível com Server Components.
- Incorporar estilos estáticos ao CSS distribuído, sustentados por tokens semânticos e isolados com o prefixo público `ads-`.
- Validar o contrato por testes unitários, acessibilidade, documentação, consumo externo e fluxos críticos de teclado.

**Non-Goals:**

- Criar um provedor, hook ou estado global de formulário, nem executar regras de validação de negócio.
- Simular controles nativos com elementos genéricos ou introduzir dependências de runtime para a família.
- Incluir controles avançados que demandam interações especializadas, como calendários, autocomplete e upload.

## Decisions

### Controles nativos serão a base das APIs

`AdsInput`, `AdsTextarea`, `AdsSelect`, `AdsCheckbox` e `AdsRadio` encaminharão atributos nativos relevantes ao elemento HTML correspondente. `AdsSwitch` usará uma entrada checkbox semanticamente associada ao seu rótulo, com aparência de switch, em vez de reimplementar estado e teclado com um elemento genérico.

Isso preserva integração com formulários HTML, estados controlados e não controlados, foco e teclado. Alternativa considerada: controles baseados em `div` com ARIA. Ela amplia significativamente a superfície de comportamento a reproduzir e é desnecessária para a primeira versão.

### Composição explícita associa metadados ao controle

Os componentes de campo exporão peças compostas para rótulo, descrição, mensagem e grupos. Uma convenção de identificadores ou contexto local associará `label`, `aria-describedby` e `aria-invalid` ao controle sem exigir que o consumidor repita a fiação acessível; o controle continuará aceitanto identificadores e atributos nativos para integrações especiais.

Alternativa considerada: uma única API monolítica que recebe todos os conteúdos como propriedades. A composição explícita preserva flexibilidade para layouts e evita uma API excessivamente configurável.

### Estados visuais usam atributos e tokens semânticos

O estado de validação será exposto por propriedade pública consistente e refletido com atributos HTML/ARIA válidos. Os estilos serão mapeamentos Tailwind estáticos que consomem tokens de formulário definidos em `@admin-ds/tokens`, abrangendo superfícies, bordas, foco, texto e estados de sucesso e erro em ambos os temas.

Alternativa considerada: gerar classes por concatenação conforme a variante. Essa opção quebra a análise estática do Tailwind e o contrato de CSS pré-compilado.

### Interatividade no cliente fica restrita ao necessário

Controles que apenas renderizam atributos e callbacks do React não precisarão declarar `"use client"`; uma aplicação cliente continuará podendo controlá-los. Caso a composição de campo use geração estável de identificadores no cliente, o limite de cliente ficará no menor módulo possível, com segurança para hidratação. Nenhum componente acessará diretamente APIs do navegador sem necessidade.

Alternativa considerada: marcar a família inteira como Client Components. Isso aumentaria JavaScript transferido e reduziria a utilidade em árvores Server Components.

### Documentação e validação tratam cada estado como contrato

Storybook demonstrará controles isolados, composição, estados de validação, tamanhos de tela e temas. Os testes cobrirão encaminhamento de atributos, interação por teclado, associações acessíveis, temas, CSS distribuído e consumo somente por APIs públicas no admin demo.

Alternativa considerada: validar somente a aparência no Storybook. Isso não protege o contrato de interação e acessibilidade das aplicações consumidoras.

## Risks / Trade-offs

- [A composição automática pode conflitar com identificadores fornecidos pelo consumidor] → Mitigação: documentar precedência e preservar atributos nativos explicitamente informados.
- [A aparência nativa de `select` varia por navegador] → Mitigação: limitar a personalização ao escopo estável do controle e testar os comportamentos essenciais em navegadores suportados.
- [Novos tokens aumentam a superfície de temas] → Mitigação: definir somente tokens semânticos reutilizáveis e validar ambos os temas em histórias e testes.
- [Mensagens de validação dinâmicas podem ser anunciadas em excesso] → Mitigação: usar semântica ARIA adequada e testar a associação, sem criar anúncios automáticos globais.

## Migration Plan

1. Adicionar tokens necessários, módulos de componentes, tipos, exports e estilos compiláveis ao pacote existente.
2. Adicionar documentação e exemplos de consumo público no Storybook e no admin demo.
3. Executar testes de tipos, comportamento, acessibilidade, CSS, build e fluxos críticos antes da integração.
4. Publicar como adição compatível; se houver regressão, remover os novos exports e estilos em uma correção sem impactar APIs existentes.

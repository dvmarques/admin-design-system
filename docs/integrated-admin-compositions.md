# Composições administrativas integradas — #320

## Percurso na Demo e no Storybook

O índice `/exemplos/integracao` é um Server Component com links para os três exemplos existentes e as variantes do shell. O `(admin)/layout.tsx` fornece um único `main`, cabeçalho, sidebar, conta, menu e controle de tema; o footer permanece opt-in na consulta. Não há um segundo shell.

| Cenário    | Rota                                                   | Composição e estados                                                                                                          |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Consulta   | `/exemplos/composicao-semantica/consulta`              | `AdsPageHeader`, H2, `AdsField` + `AdsInput`, `AdsTable`, `AdsPagination`, ações de linha, filtro, vazio, carregamento e erro |
| Formulário | `/exemplos/composicao-semantica/formulario`            | H1/H2/H3, `AdsField` e `AdsButton`, validação, feedback, campo desabilitado                                                   |
| Shell      | Índice e rotas acima; `/catalogo-shell` para variantes | `AdsAdminShell`, sidebar normal/recolhida/mobile, menu, tema, footer opcional                                                 |
| Resumos    | `/exemplos/composicao-semantica/dashboard`             | `AdsMetricCard` e `AdsCard` apenas em indicadores e conteúdo autocontido, não como contêiner de página                        |

O Storybook inclui **Patterns / Page composition / Integrated admin** e os exemplos separados **Consultation**, **Validated form** e **Dashboard**. O catálogo da aplicação aponta para a matriz integrada.

## Escolha entre primitivos e composições

- Use `AdsPageHeader` e HTML nativo `section` + `AdsTypography` para hierarquia H1–H4. Não use `AdsCard` como wrapper obrigatório.
- Use `AdsTable` para uma listagem simples com filtro local, e `AdsSmartTable` ou `AdsListFlow` quando precisar de seleção, ordenação e fluxos mais complexos (veja `/clientes`).
- Use `AdsMetricCard` para indicadores, `AdsCard` para resumos autocontidos e `AdsSurface` para delimitar apenas quando acrescentar informação.
- O layout e o tema pertencem ao consumidor. `AdsAdminShell.Footer` é opt-in e ícones não obrigam fornecedor de biblioteca.

## Contratos públicos

A Demo importa os componentes apenas de `@dvmarques/admin-ds-components` e `@dvmarques/admin-ds-admin`. O layout raiz importa os CSS públicos compilados **na ordem** `tokens/styles.css`, `components/styles.css` e `admin/styles.css`. Classes responsivas `ads-layout-*` não exigem Tailwind no consumidor. Não se criaram exports, dependências de runtime ou tokens nesta change. Ações e estados usam exclusivamente memória local com dados fictícios; sem serviços, sessão ou persistência.

## Validação

Com Node 24/npm 11.19.1, executar `npm run validate`, `npm run inspect:packages`, `npm run verify:optional-peer` e `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`. A suíte `e2e/integrated-admin-compositions.spec.ts` inclui 320/390/768/1440px e light/dark com axe WCAG, H1/landmark, ausência de overflow, erros de hidratação, teclado, filtro, paginação, erro/carregamento e campo desabilitado. As suites existentes verificam shell, portais, tema, footer, teclado e reflow equivalente.

Zoom **nativo** 200%, NVDA/VoiceOver e aprovação visual das capturas **exigem inspeção humana**. Emulação por viewport ou CSS zoom não é equivalente. Não atualize snapshots automaticamente.

## Orçamentos e comparação

Os três arquivos de orçamento permanecem intactos: [distribuição](bundle-baseline.json), [JS/CSS publicado](browser-budget.json) e [cenários tree-shaken](scenario-budget.json). `inspect:packages` aponta estouros de limite; `public-consumption.test.ts` valida imports públicos, CSS e proíbe Tailwind e imports profundos.

**Medições anteriores, apenas históricas:** a [PR #328](https://github.com/dvmarques/admin-design-system/pull/328) registrou components 306.805 B (gzip 92.067 B) e admin 173.020 B (gzip 46.886 B) de JS/CSS publicados. Não são medições da #320. O diff desta change não altera `packages/`; não há aumento de bundle de pacote intencional. Bytes de rotas Next/Storybook podem mudar e não são inferidos desses números.

Registre no PR SHA, data, versões de Node/npm e métricas de `inspect:packages` da CI **antes de afirmar comparação comprovada**. Se houver regressão, investigue import massivo, CSS duplicado e SSR/hidratação sem elevar o budget para silenciar a falha.

## Dependências e limites

Épico #315: #316/PR #321, #317/PR #326, #318/PR #327 e #319/PR #328 integrados em `develop` antes desta branch. Sem archive, merge ou fechamento administrativo nesta etapa.

## 1. Planejamento e contratos

- [x] 1.1 Conferir issue #316, exports atuais, licenças, arquitetura, consumidores e change ativa.
- [x] 1.2 Registrar proposta Critical, alternativas ReactNode/ComponentType, design e cenários OpenSpec.
- [x] 1.3 Validar a change com OpenSpec 1.15.0 (strict) no ambiente oficial.

## 2. API e componentes

- [x] 2.1 Implementar e exportar `AdsIconSlot` para ReactNode sem clone e sem catálogo externo.
- [x] 2.2 Preservar `AdsIcon`, seus 20 nomes e testes de compatibilidade.
- [x] 2.3 Inventariar ícones internos e implementar overrides opcionais prioritários preservando defaults.
- [x] 2.4 Testar tamanho, cor, acessibilidade, SSR, hidratação, foco, disabled e claro/escuro.

## 3. Exemplos, impacto e distribuição

- [x] 3.1 Criar story funcional e exemplo no Admin Demo com dois fornecedores externos distintos e SVG local (catálogos apenas dev/demonstração).
- [x] 3.2 Documentar defaults, overrides, integração Next, inventário, licenças e trade-offs.
- [x] 3.3 Medir footprint, tree-shaking e bundles (ADS isolado e cenários de demonstração), registrar números e notices.

## 4. Validação e entrega

Evidência local (Linux, Chromium): `npm run format`, `lint`, `build`, `test:output`, `verify:optional-peer`, `typecheck`, `test:quality` e OpenSpec 1.15.0 strict (70/70) aprovados; E2E Chromium com 467 aprovados e 9 snapshots visuais de rotas não alteradas por esta change (diferença ~1% de pixels, Chromium local de outra revisão que o da CI). Firefox e WebKit não estão instalados neste ambiente e foram cobertos pela CI. CI no SHA `fbc6f50`: [CI #43627655725](https://github.com/dvmarques/admin-design-system/actions/runs/43627655725), [Security Gate #43627655673](https://github.com/dvmarques/admin-design-system/actions/runs/43627655673) e [Pages #43627655668](https://github.com/dvmarques/admin-design-system/actions/runs/43627655668) em sucesso; PR #321 aberta para `develop`, aguardando revisão humana. A cobertura de `iconNode` do menu de conta foi acrescentada à revisão final.

- [x] 4.1 Revisar diff, API, tipos, regressões visuais e snapshots de forma independente.
- [x] 4.2 Executar `prettier --write` nos arquivos modificados e confirmar `npm run format`, lint, build, typecheck, test:quality, `npm run test:e2e`, consumo Next e OpenSpec strict.
- [x] 4.3 Abrir PR para develop e verificar CI em SHA atual, corrigindo falhas e solicitando revisão.

## 1. Planejamento e contratos

- [x] 1.1 Conferir issue #316, exports atuais, licenças, arquitetura, consumidores e change ativa.
- [x] 1.2 Registrar proposta Critical, alternativas ReactNode/ComponentType, design e cenários OpenSpec.
- [ ] 1.3 Validar a change com OpenSpec 1.15.0 (strict) no ambiente oficial.

## 2. API e componentes

- [ ] 2.1 Implementar e exportar `AdsIconSlot` para ReactNode sem clone e sem catálogo externo.
- [ ] 2.2 Preservar `AdsIcon`, seus 20 nomes e testes de compatibilidade.
- [ ] 2.3 Inventariar ícones internos e implementar overrides opcionais prioritários preservando defaults.
- [ ] 2.4 Testar tamanho, cor, acessibilidade, SSR, hidratação, foco, disabled e claro/escuro.

## 3. Exemplos, impacto e distribuição

- [ ] 3.1 Criar story funcional e exemplo no Admin Demo com dois fornecedores externos distintos e SVG local (catálogos apenas dev/demonstração).
- [ ] 3.2 Documentar defaults, overrides, integração Next, inventário, licenças e trade-offs.
- [ ] 3.3 Medir footprint, tree-shaking e bundles (ADS isolado e cenários de demonstração), registrar números e notices.

## 4. Validação e entrega

- [ ] 4.1 Revisar diff, API, tipos, regressões visuais e snapshots de forma independente.
- [ ] 4.2 Executar `prettier --write` nos arquivos modificados e confirmar `npm run format`, lint, build, typecheck, test:quality, `npm run test:e2e`, consumo Next e OpenSpec strict.
- [ ] 4.3 Abrir PR para develop e verificar CI em SHA atual, corrigindo falhas e solicitando revisão.

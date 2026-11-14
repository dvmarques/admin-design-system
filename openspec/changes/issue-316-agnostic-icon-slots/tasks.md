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

Evidência inicial: [CI #43624407692](https://github.com/dvmarques/admin-design-system/actions/runs/43624407692) com `Qualidade rápida`, `Política de develop` (OpenSpec strict), distribuição, Chromium 1/2 e 2/2, WebKit e Firefox em sucesso; Security Gate e Pages também em sucesso, SHA `b8036a0`. A documentação/checklist deste commit altera o SHA; verificar novamente o último antes de concluir a tarefa 4.3. O comando local agregado `npm run validate` e execução local integral de `npm run test:e2e` permanecem não comprovados, embora a CI execute os respectivos gates; por isso 4.2 não está marcada.

- [x] 4.1 Revisar diff, API, tipos, regressões visuais e snapshots de forma independente.
- [ ] 4.2 Executar `prettier --write` nos arquivos modificados e confirmar `npm run format`, lint, build, typecheck, test:quality, `npm run test:e2e`, consumo Next e OpenSpec strict.
- [ ] 4.3 Abrir PR para develop e verificar CI em SHA atual, corrigindo falhas e solicitando revisão.

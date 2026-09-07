## 1. Automação de validação local

- [x] 1.1 Adicionar o script raiz `test:e2e` para a suíte Playwright e encadeá-lo após o build em `npm run validate`; verificar que `npm run validate` propaga uma falha E2E e que `npm run test:e2e` executa a suíte isoladamente.
- [x] 1.2 Confirmar que a aplicação de referência usada pelo Playwright consome os artefatos construídos necessários, sem introduzir dependências de runtime; verificar a sequência local equivalente aos gates de qualidade e E2E do CI.

## 2. Contratos e cobertura E2E

- [x] 2.1 Substituir os seletores E2E baseados em conteúdo editorial por funções ARIA, headings de seção estáveis ou identificadores semânticos no admin demo, somente quando necessários; verificar que os fluxos de tema, foco, overlays e hidratação continuam cobertos.
- [x] 2.2 Revisar os snapshots visuais existentes e documentar o comando de atualização; verificar que uma diferença não aprovada falha localmente e que uma mudança visual intencional é atualizada com `npm run test:e2e -- --update-snapshots` e revisada.

## 3. Processo de entrega e documentação

- [x] 3.1 Atualizar `docs/quality.md` com o script E2E, o pré-requisito do navegador, a política de snapshots e a checklist pré-PR com format, lint, typecheck, test, build e E2E; verificar que os comandos podem ser copiados e executados na raiz.
- [x] 3.2 Atualizar `openspec/config.yaml` para que tarefas e orientações de aplicação de changes exijam E2E sem falhas e atualização deliberada de snapshots visuais quando aplicável; verificar que as instruções OpenSpec refletem os novos critérios.

## 4. Validação final

- [x] 4.1 Executar `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e `npm run test:e2e`; verificar que todos terminam sem falha e registrar qualquer pré-requisito ambiental utilizado.
- [x] 4.2 Executar `npm run validate` como validação integrada e confirmar que ele inclui a suíte E2E após o build; verificar que a sequência final reproduz os controles locais esperados antes do PR.
- [x] 4.3 Executar `openspec.cmd validate strengthen-pre-pr-validation --strict` e verificar que todos os artefatos da change permanecem válidos.

## 5. Saída de testes e diagnóstico

- [ ] 5.1 Adicionar entradas raiz para testes silenciosos ou concisos e comandos verbosos equivalentes; verificar que o modo padrão reduz logs de testes aprovados sem alterar códigos de saída.
- [ ] 5.2 Configurar os scripts Vitest dos workspaces para usar silêncio que preserve logs de falhas e o script Playwright para reporter compacto; verificar que uma falha continua visível e retorna código diferente de zero.
- [ ] 5.3 Atualizar `test:quality`, `validate` e a checklist pré-PR para usarem as entradas concisas, mantendo os comandos verbosos documentados para diagnóstico; verificar que a mesma suíte é executada em ambos os modos.
- [ ] 5.4 Atualizar a documentação OpenSpec e `docs/quality.md` com a política de saída e exemplos de diagnóstico; verificar que uma pessoa consegue alternar entre os modos sem conhecer detalhes internos dos workspaces.
- [ ] 5.5 Executar os testes em modo conciso e verboso, além de `npm run validate`, e confirmar que ambos preservam resultados e falhas; verificar novamente `openspec.cmd validate strengthen-pre-pr-validation --strict`.

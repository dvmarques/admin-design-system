## Why

Os testes end-to-end são executados no GitHub Actions, mas não fazem parte da validação principal disponível localmente. Essa diferença permite que regressões de integração, acessibilidade, hidratação e apresentação sejam descobertas somente depois do push, atrasando a revisão do PR.

## What Changes

- Adicionar o script raiz `test:e2e` para executar a suíte Playwright configurada pelo projeto.
- Incluir os testes E2E no comando raiz `npm run validate`, para que a validação local cubra o mesmo fluxo de qualidade do CI.
- Documentar a execução local de E2E, a atualização deliberada de snapshots visuais e a confirmação de uma suíte E2E sem falhas antes do commit ou PR.
- Criar uma checklist pré-PR com formatação, lint, tipos, testes, build e E2E.
- Tornar os seletores E2E dependentes de contratos de interface estáveis, como funções ARIA, identificadores semânticos e headings de seção, em vez de textos editoriais frágeis quando houver alternativa.

## Capabilities

### New Capabilities

- `pre-pr-validation`: processo local verificável antes de um PR, incluindo E2E, snapshots visuais e checklist de conclusão.

### Modified Capabilities

- `quality-assurance`: a verificação obrigatória da base passa a incluir fluxos E2E e requisitos para manter seletores e snapshots E2E confiáveis.

## Impact

- Arquivos de automação e documentação: `package.json`, `docs/quality.md`, nova documentação de contribuição ou checklist pré-PR e orientações OpenSpec de tarefas.
- Testes E2E em `e2e/` e, se necessário, os elementos estáveis expostos pelo admin demo para suportar seletores semânticos.
- O contrato público dos pacotes distribuídos não muda; a mudança fortalece a entrega e a validação da integração pelo `apps/admin-demo`.
- Não adiciona dependências de runtime. A execução local exigirá que o Chromium do Playwright esteja instalado, como já ocorre no CI.

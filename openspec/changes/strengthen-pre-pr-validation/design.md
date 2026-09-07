## Context

O CI executa uma etapa E2E Playwright separada após a produção dos artefatos necessários. No repositório, `npm run validate` encerra no build; a execução E2E local depende de invocar Playwright manualmente. A configuração do Playwright inicia o admin demo e a suíte atual mistura contratos de interação, verificações de estilos computados e snapshots visuais locais.

Consulte `proposal.md` para a motivação e as delta specs para os comportamentos obrigatórios.

## Goals / Non-Goals

**Goals:**

- Oferecer uma única validação raiz que inclua E2E depois do build.
- Manter um comando E2E explícito e documentado para diagnóstico e preparação de PRs.
- Dar visibilidade à atualização deliberada de snapshots e à escolha de seletores E2E duráveis.
- Alinhar os critérios de entrega definidos pelo OpenSpec, a documentação e o fluxo efetivamente executado.

**Non-Goals:**

- Alterar APIs públicas, componentes ou tokens sem necessidade para expor contratos de teste estáveis.
- Tornar snapshots visuais obrigatórios no CI nesta change; eles continuam uma proteção local contra regressões visuais e precisam de atualização intencional.
- Substituir os testes unitários, de acessibilidade ou as verificações atuais do CI.

## Decisions

### Encadear a suíte E2E no script de validação raiz

Será criado `npm run test:e2e` como a entrada pública para a suíte Playwright, e `npm run validate` o executará após build. Isso preserva a possibilidade de rodar somente E2E ao investigar uma falha e remove a divergência principal entre a rotina local e o fluxo do CI.

Alternativa considerada: apenas documentar `npx playwright test`. Ela não impede a omissão na rotina normal; o script nomeado também evita expor o detalhe da ferramenta como contrato do repositório.

### Preservar a separação entre E2E de contrato e snapshots locais

Os fluxos E2E funcionais devem continuar executáveis em CI e localmente. A validação visual baseada em screenshot continuará explicitamente local enquanto a configuração atual a omite sob CI; a documentação e as tarefas exigirão que uma alteração visual deliberada atualize os artefatos esperados usando o fluxo Playwright apropriado.

Alternativa considerada: habilitar snapshots no CI agora. Isso amplia o escopo para tratar determinismo de ambiente, fontes e armazenamento de baselines, sem ser necessário para garantir que o desenvolvedor os rode antes do PR.

### Preferir âncoras semânticas na suíte E2E

Os testes passarão a localizar fluxos por função e nome acessível, `data-testid` ou identificador semântico quando justificável, e headings de seção estáveis. Um texto de marketing atual não será usado como âncora de navegação. Novos atributos de teste só serão introduzidos no admin demo quando não houver contrato semântico suficiente, preservando a biblioteca reutilizável livre de detalhes de teste do app.

Alternativa considerada: manter os textos completos. Eles cobrem conteúdo visível, mas tornam testes de integração sensíveis a revisões editoriais que não afetam o contrato do fluxo.

### Manter uma única fonte para o processo de entrega

`docs/quality.md` reunirá o comando e a checklist pré-PR. As regras em `openspec/config.yaml` serão estendidas para que novas changes incluam E2E, atualização intencional de snapshots e confirmação de ausência de falhas E2E nas tarefas aplicáveis. Isso evita uma checklist isolada e requisitos OpenSpec desatualizados.

### Preferir saída concisa nos testes

Os comandos usados pelo gate pré-PR devem reduzir ruído sem transformar falhas em mensagens opacas. Para Vitest, será adotada a opção de silêncio que mantém logs de testes aprovados ocultos e preserva logs de falhas; para Playwright, será usado um reporter compacto no comando padrão. Cada família de testes terá uma entrada verbosa documentada para diagnóstico, e os códigos de saída permanecerão inalterados.

Alternativa considerada: aplicar silêncio absoluto a todos os processos. Isso reduz mais o log, mas pode esconder contexto essencial quando um teste falha e torna o diagnóstico mais lento.

## Risks / Trade-offs

- [O navegador Playwright não está instalado em uma máquina local] → Documentar a instalação de Chromium e manter a mensagem de falha como pré-requisito explícito.
- [A validação raiz ficará mais lenta] → Manter `test:e2e` independente para ciclos de diagnóstico; a validação completa passa a representar deliberadamente o custo do gate pré-PR.
- [Seletores semânticos podem não existir para uma região de demonstração] → Preferir o menor contrato estável no admin demo e limitar identificadores de teste a esse app, sem adicioná-los à API pública dos pacotes.
- [Snapshot é atualizado sem revisão visual] → Documentar que a atualização só é aceitável junto de uma mudança visual intencional e revisão do diff.
- [Saída concisa omite contexto útil] → Preservar mensagens de falha e documentar comandos verbosos equivalentes para investigação.

## Migration Plan

1. Introduzir scripts, documentação, regras OpenSpec e seletores E2E estáveis na mesma alteração.
2. Executar a nova sequência local de validação, incluindo E2E e a verificação visual local quando houver baseline afetado.
3. O CI continua com sua etapa E2E até uma mudança futura que consolide a topologia dos jobs; não há migração de consumidores nem rollback de dados.

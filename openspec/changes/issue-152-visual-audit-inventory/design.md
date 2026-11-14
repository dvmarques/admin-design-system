# Decisões da fase 1

O catálogo `apps/admin-demo/app/catalogo/catalog-data.ts` é a fonte de nomes/grupos/rotas. A tabela em `docs/admin-demo-catalog.md` é a fonte de Storybook. O teste AST da #151 continua garantindo cobertura dos exports de runtime; o script da #152 não substitui esse teste.

O extrator é deliberadamente estrito quanto ao formato literal atual. Se ele mudar, a verificação falha em vez de tratar uma matriz parcial como completa. `--print` produz stdout e não sobrescreve status ou evidência. `--check` confronta as três fontes, valida stories existentes e requer evidência para status não pendente.

Não há aplicação Client Component, import privado de pacote, alteração de dependência, CSS ou bundle. Teste Node integrado ao `test:ci`. Risco: reestruturações de sintaxe do catálogo/Markdown exigirão adaptar o extrator; rollback simples reverte script, matriz, docs e entrada de teste.

## Motor de auditoria e relatório

`playwright.visual-audit.config.ts` estende a configuração E2E (mesmo servidor de produção e build stamp), usando um diretório de testes separado para NÃO aumentar a suíte regular. A nova varredura percorre os exports registrados no catálogo e cobre o preview em Chromium, nos temas light/dark e viewport 390/1440px. Os testes emitem manifestos isolados por combinação; o globalTeardown agrega um relatório com contagem esperada, capturas válidas, sinais, falhas e ausência de execução. O globalSetup limpa artefatos antigos para impedir falso positivo por sobra de execução anterior.

Capturas e JSON são efêmeros em `visual-audit-results/` e ignorados no Git. Um workflow manual, sem schedule nem push automático, publica esse diretório em artifact de 14 dias. Sinais geométricos são **suspeitas**, não regressões confirmadas. Não usamos comparação de pixels nem atualização de snapshots. Estados interativos e zoom 200% continuam tarefas posteriores; nenhum componente passa a "Sem divergência" sem revisão humana e evidência.

Risco de custo: ~328 capturas por execução completa; isolamento da CI normal evita sobrecarga contínua. Em falha de rota/captura, a suíte acusa falha, mas o aggregator gera um relatório parcial indicando explicitamente amostras não executadas. Nenhuma nova dependência: reutiliza @playwright/test já instalado.

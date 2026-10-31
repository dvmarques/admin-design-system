## Arquitetura e políticas

- Workflow de segurança separado, com três jobs independentes: CodeQL, SCA/npm audit e Gitleaks. Os triggers PR/push/schedule são explícitos e o filtro Draft é aplicado em cada job, não no workflow, de modo que eventos ready_for_review executem o scan e Draft apareça como skipped.
- PR de fork usa pull_request, nunca pull_request_target, checkout read-only, sem secrets do repositório ou código de terceiros com token de escrita. Apenas o job CodeQL declara security-events: write, necessário ao upload do SARIF; a disponibilidade do upload em fork não foi exercitada e deve falhar fechado. O job Gitleaks usa somente pull-requests: read.
- CodeQL usa a action oficial fixada por SHA, linguagem JavaScript/TypeScript, sem filtros de paths que silenciem alterações na supply chain. Após gerar e subir o SARIF, um script resolve regras em `tool.driver` e `tool.extensions` pela referência de componente e índice/ID; resultado sem regra resolvível falha fechado. Achados high/critical (score >=7.0) não aceitos bloqueiam; exceções específicas por ruleId e arquivo exigem responsável, justificativa e data de revisão. As dependências são instaladas com npm ci --ignore-scripts, Node 24/npm 11 para reproduzir o lockfile.
- SCA faz npm audit --audit-level=high --json no lockfile da raiz, abrangendo dev e produção, e um recorte --omit=dev. O interpretador do audit deve falhar também em erros de rede/formato e jamais confundir erro operacional com zero riscos. Exceções são estritas por pacote e URL de advisory, com responsável, justificativa, prazo de expiração e revisão. Não silenciar globalmente o audit.
- Gitleaks usa a action versão Node 24 e SHA imutável, sem comentários ou upload de artefatos com segredos; um arquivo de configuração versionado estende os padrões padrão. Segredos reais nunca são publicados em issues; rotacionar fora do repositório.
- Dependabot agrupa updates semanais com limite de PRs; alerta de vulnerabilidade não implica atualização segura automática de todo pacote. GitHub CodeQL/SCA/Dependabot podem depender da habilitação/capacidade de recursos do repositório.

## Provas e reversão

- Testes sintéticos validam aceite e rejeição do gate, expiração de exceção, falha de auditoria operacional e política Draft/Ready/Push/Schedule. Usar somente segredos de teste não reais.
- Na PR: provar Draft = security jobs skipped; Ready = executados, capturar resultados, avisos e links. Verificar CI e Pages não regressarem.
- Aferir pelo menos três runs comparáveis antes/depois, registrar tempo de jobs e duração ponta a ponta e consumo de runner (não somar duração de jobs paralelos à latência). Histórico e datas na issue #267.
- Rollback: reverter workflow, documentação, scripts e config, sem mexer nas bibliotecas. Não arquivar change enquanto critérios não forem efetivamente verificados; nenhum merge sem autorização.

## Impactos de produto

- Nenhuma alteração em bundling, React Server/Client, acessibilidade, temas, Tailwind, tokens ou APIs de pacote. Não são necessários stories ou E2E visuais novos; a CI existente é o mecanismo de regressão.
- A reprodução do npm audit usa invocação do npm compatível com Windows e POSIX; os argumentos são definidos internamente pelo script.
- A CI revelou `js/file-system-race` em `scripts/generate-storybook-api.mjs`; leitura direta substitui checagens de existência, e saídas atualizadas usam temporário exclusivo com rename atômico. CodeQL passou depois da correção.

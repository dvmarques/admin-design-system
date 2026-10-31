# Gates recorrentes de segurança — issue #267

O workflow Security Gate faz SAST (CodeQL), SCA (npm audit) e busca de segredos (Gitleaks) no repositório público. Um check verde não comprova ausência de vulnerabilidades desconhecidas.

## Eventos, escopo e evidências

| Evento | Comportamento |
| --- | --- |
| PR Draft para develop/master (inclusive novos commits) | CodeQL, SCA e Gitleaks skipped |
| PR Ready for Review (ou novo commit em Ready) | Três scanners em paralelo |
| Push para develop/master | Três scanners em paralelo |
| Segunda-feira 04:17 UTC ou workflow_dispatch | Três scanners, branch padrão develop |

Consulte **Actions > Security Gate** para status, duração e logs dos jobs. Para CodeQL, consulte também **Security > Code scanning**, se o recurso de upload SARIF estiver disponível e habilitado. Para npm audit, o job publica resumo Markdown e artefato *npm-audit-summary* sanitizado, com retenção de 14 dias. Para Gitleaks, o job não comenta na PR nem faz upload de valores detectados.

Os checks de qualidade, E2E e Pages existentes continuam independentes. Os gates usam checkout somente leitura, não usam pull_request_target nem expõem secrets do repositório a PRs de forks. A action CodeQL precisa de security-events: write para upload da análise; se o GitHub impedir upload em alguma classe de PR, registrar o erro e estudar um caminho de menor privilégio, nunca mascarar falha com continue-on-error.

## Reproduzir e interpretar o SCA

Node.js 24 e npm 11.19.1, raiz do monorepo:

~~~sh
npm ci --ignore-scripts --no-audit --no-fund
npm audit --audit-level=high --json
npm audit --audit-level=high --omit=dev --json
node scripts/security-audit.mjs --output reports/security/npm-audit-summary.json
node --test scripts/security-audit.test.mjs
~~~

A política de SCA bloqueia riscos high/critical não aceitos e registra todos os níveis, usando o package-lock.json e a análise separada com --omit=dev. O relatório de produção serve de indicador de possível exposição, não de prova de execução do pacote vulnerável. Identifique dependências transitivas com npm explain PACOTE e analise o caminho afetado. Erros de rede, permissão ou JSON inválido falham: não significam zero riscos.

Exceções devem ser específicas por package + advisoryUrl, com owner, justification (ao menos 20 caracteres) e reviewBy YYYY-MM-DD em UTC em .github/security/audit-exceptions.json. Uma exceção expirada não libera o gate. Não silenciar npm audit globalmente ou utilizar npm audit fix --force automaticamente. Achados de desenvolvimento, indiretos e moderados exigem triagem e plano de correção conforme a exposição.

O baseline da issue #265, em 31/10/2026, encontrou 14 avisos moderados em dev tooling, zero high/critical e zero em produção. Esse resultado histórico não substitui a execução do gate atual da issue #267.

## Segredos e incidentes

Gitleaks v3 (ação com runtime Node 24) usa regras padrão estendidas por .gitleaks.toml, sem allowlist ampla. Se for encontrado um segredo real, faça rotação/revogação fora de issues públicas e verifique histórico e impacto. Excluir ou ocultar um commit não revoga credenciais. Não publicar valores suspeitos em issues, artefatos ou reproduções.

Testes unitários usam advisories simulados; um teste de integração com segredo proposital deve usar apenas material fictício, em branch isolada, e não ser integrado. Nunca usar chaves ou credenciais reais em testes.

## Dependabot

O arquivo .github/dependabot.yml solicita atualizações semanais de versão para npm e GitHub Actions na develop, com agrupamento de minor/patch e limite de PRs abertas (3 npm, 2 Actions). Alterações major podem gerar PRs separadas e devem ser revisadas. Atualizações de segurança e alertas nativos Dependabot dependem das configurações GitHub e usam a branch padrão quando aplicável; esta PR não altera configurações administrativas. A #265 permanece responsável pela migração pontual de versões; a #268 responde pelo hardening de outros workflows e imagens.

## Medições a registrar na issue

Para cada run, registrar data UTC, evento (PR Ready, push ou schedule), SHA, URL, resultado, duração de CodeQL/SCA/Gitleaks, duração da CI anterior e latência total até os checks concluírem. O tempo de jobs paralelos não deve ser somado para estimar o atraso real até merge. Quando disponível, registrar minutos de runner; custo financeiro depende do plano e não deve ser inventado.

Comparar no mínimo três runs antes e depois, mesmo evento e carga semelhante, mediana, cache e diferenças de fila, usando o workflow manual Métricas de CI / scripts/ci-metrics.mjs como referência. Publicar medições progressivamente em comentários datados na #267 e consolidar após a amostra. Se não houver histórico comparável, explicar limitação expressamente.

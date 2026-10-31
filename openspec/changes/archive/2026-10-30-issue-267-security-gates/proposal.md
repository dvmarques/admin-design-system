## Why

A issue #267 requer gates recorrentes de SAST, SCA e segredos, para detectar problemas cedo sem exigir aprovação de terceiros. A auditoria pontual de dependências pertence à #265; o hardening geral dos workflows à #268.

## What Changes

- Adicionar jobs de CodeQL (JavaScript/TypeScript), npm audit (dev e produção) e Gitleaks com falhas explícitas, versões das actions fixadas e permissões mínimas.
- Executar em PRs para develop/master apenas quando não forem Draft, em push para as branches e semanalmente na branch padrão.
- Configurar Dependabot semanal para npm e GitHub Actions com limites e agrupamento.
- Documentar baseline, triagem, exceções temporárias rastreáveis e como comparar o tempo da CI e os minutos de runner antes/depois.
- Incluir testes de comportamento do gate e de regressão de gatilhos, sem mudar os checks atuais.

## Out of Scope

- Migração de dependências e vulnerabilidades herdadas da #265; hardening completo de workflows e containers (#268); publicação npm e OIDC (#195).
- Alterar rulesets para exigir review alheio, mudar Node 24 ou engines >=24.0.0, alterar o runtime/APIs/CSS/UI das bibliotecas ou publicar pacotes.

## Impact

- Infraestrutura .github, scripts, documentação de segurança e CHANGELOG; nenhum pacote ou aplicação altera seu contrato público.
- Repositório público, mantenedor único; novos jobs paralelos acrescentam consumo de minutos, mas não somam diretamente à latência da PR.
- Perfil Critical: software supply chain, execução de ferramentas externas e proteção de PRs de forks.

Issue: https://github.com/dvmarques/admin-design-system/issues/267

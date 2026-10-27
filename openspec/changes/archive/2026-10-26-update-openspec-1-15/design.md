# Design

## Context

Consulte `proposal.md` para motivação e escopo. A spec `release-process` já exige CLI versionado e multiplataforma na CI, sem fixar uma versão específica. Não há delta de requisitos.

## Goals / Non-Goals

Alinhar arquivos gerados e CI com a instalação 1.15.0. Preservar configuração local, schema `spec-driven` e skills próprias. Não alterar comportamento da biblioteca ou demonstração.

## Decisions

- Executar `openspec.cmd update .`, seguindo o procedimento oficial, em vez de editar skills geradas manualmente. Revisar o diff e confirmar idempotência com `--dry-run --json`.
- Manter `npx --yes @fission-ai/openspec@1.15.0` nas duas validações da CI. Evitar `latest`, que tornaria a execução variável, e evitar uma nova dependência no lockfile, pois o CLI é tooling global já disponibilizado por npx na CI.
- Usar `skip_specs: true` para a change exclusivamente de tooling. Não inventar requisitos de produto para uma atualização de versão.
- Não há impacto em Server/Client Components, acessibilidade, responsividade, temas, Tailwind, variáveis CSS, distribuição de CSS, composição, contratos públicos, conflitos de estilos ou tamanho de bundle. Stories e exemplos visuais existentes seguem aplicáveis.

## Risks / Trade-offs

- Instruções geradas podem mudar orientações dos agentes → revisar diferenças e validar skills próprias e OpenSpec.
- CLI mais novo pode detectar problemas existentes → executar validação estrita completa antes da entrega.

## Migration Plan

Regenerar integrações, atualizar CI e guia, formatar e validar. Reversão: reverter o commit da atualização, sem migrar dados ou tocar tags de release.

## Compatibilidade da validação

A versão 1.15.0 sinaliza requisitos com mais de 500 caracteres em `admin-demo-application`, `impact-aware-validation` e `quality-assurance`. Mover detalhes para cenários preservando todas as exigências é um ajuste editorial necessário à migração, sem mudança de comportamento ou delta de specs.

## Portabilidade do teste de CI

Conforme solicitado, o teste de `gitArguments` calcula o caminho esperado com `path.resolve`, em vez de fixar `/work`. Mantém a cobertura de normalização da barra final e da aplicação de confiança somente ao checkout no GitHub Actions. A implementação de produção permanece inalterada.

## Consistência de edição e arquivos locais

Adicionar `.editorconfig` com UTF-8, LF, newline final e indentação alinhada ao Prettier: tabs no código e espaços em YAML e Markdown, preservando espaços finais em Markdown. Complementar `.gitignore` com logs, metadados de macOS/Windows e `.claude/settings.local.json`. Preservar `.gitattributes`, as configurações compartilhadas de agentes e os contratos de produto. Escopo adicional autorizado pelo usuário na mesma branch.

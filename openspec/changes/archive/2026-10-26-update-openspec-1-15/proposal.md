# Atualizar OpenSpec para 1.15.0

## Why

O CLI da máquina foi atualizado para 1.15.0, mas as integrações do projeto foram geradas pela 1.14.1 e a CI valida com 1.10.0. Alinhar essas versões mantém instruções e validação consistentes.

## What Changes

- Regenerar as seis skills OpenSpec para Codex, Claude Code e Cursor com o CLI 1.15.0.
- Fixar as duas validações OpenSpec da CI em 1.15.0.
- Documentar a versão de referência, o procedimento de atualização e registrar o efeito no changelog.
- Fora do escopo: alterações de produto, identidade visual, APIs públicas, dependências de runtime e skills próprias.

## Capabilities

Nenhuma capability nova ou modificada. Atualização de tooling sem mudança nos requisitos observáveis; `skip_specs: true` em `.openspec.yaml`.

## Impact

Afeta `.agents/skills/openspec-*`, `.claude/skills/openspec-*`, `.cursor/skills/openspec-*`, `.github/workflows/ci.yml`, documentação e changelog. Não altera `packages/*`, `apps/*`, APIs Ads*, CSS ou bundles. Aplicações consumidoras se beneficiam da consistência do processo de desenvolvimento; biblioteca e demonstração não exigem implementação.

## Compatibilidade da validação

A versão 1.15.0 sinaliza requisitos com mais de 500 caracteres em `admin-demo-application`, `impact-aware-validation` e `quality-assurance`. Mover detalhes para cenários preservando todas as exigências é um ajuste editorial necessário à migração, sem mudança de comportamento ou delta de specs.

Acompanhamento: issue [#207](https://github.com/dvmarques/admin-design-system/issues/207).

## Portabilidade do teste de CI

Conforme solicitado, o teste de `gitArguments` calcula o caminho esperado com `path.resolve`, em vez de fixar `/work`. Mantém a cobertura de normalização da barra final e da aplicação de confiança somente ao checkout no GitHub Actions. A implementação de produção permanece inalterada.

## Consistência de edição e arquivos locais

Adicionar `.editorconfig` com UTF-8, LF, newline final e indentação alinhada ao Prettier: tabs no código e espaços em YAML e Markdown, preservando espaços finais em Markdown. Complementar `.gitignore` com logs, metadados de macOS/Windows e `.claude/settings.local.json`. Preservar `.gitattributes`, as configurações compartilhadas de agentes e os contratos de produto. Escopo adicional autorizado pelo usuário na mesma branch.

## Perfil de execução

Fast: atualização de tooling, configurações de edição/ignore e ajuste localizado de portabilidade de teste, sem alteração de runtime, contratos públicos, estilos ou dependências dos pacotes. Mantidos todos os gates de validação aplicáveis.

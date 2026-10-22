## Why

O fluxo OpenSpec atual usa a mesma quantidade de planejamento para mudanças pequenas e críticas. Isso aumenta contexto e retrabalho dos agentes, mesmo quando a alteração é documental ou localizada.

## What Changes

- Documentar classificação objetiva Fast, Standard e Critical e regras de escalonamento.
- Criar skill própria de orquestração Issue → OpenSpec → implementação → validação → PR → CI → revisão.
- Preservar as regras de artefatos, testes, acessibilidade, release e aprovações humanas já existentes.
- Registrar exemplos reproduzíveis dos três perfis.

## Impact

- Documentação e instruções de agentes, sem mudança de runtime ou API pública.
- Pacotes de componentes, tokens e aplicações não são alterados.

## Out of Scope

- Reduzir obrigatoriedade de E2E, format, lint, build ou aprovação humana.
- Otimização do grafo de CI, cache e validação incremental por workspace (issue #164).

## Perfil e justificativa

Fast: documentação e skill de orientação, sem alterar runtime, contratos públicos, estilos ou dependências. O perfil reduz a extensão do planejamento e preserva todos os gates. Não há mudança na biblioteca ou na demonstração; consumidores se beneficiam de maior consistência no processo.

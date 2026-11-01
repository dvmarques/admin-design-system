## 1. Preparação e origem

- [x] 1.1 Separar workflow manual de preparação sem publicação e registrar identidade no plano/artifact.
- [x] 1.2 Validar origem, expiração, digest ZIP e conteúdo antes de reutilizar ID explícito sem rebuild.
- [x] 1.3 Preservar OIDC, hashes, dependências e retomada parcial sem escritas divergentes.

## 2. Evidências e documentação

- [x] 2.1 Testar reexecução, parcial, hashes, origem inválida, expiração e extração segura.
- [x] 2.2 Documentar bootstrap, retenção e interrupção após expiração; atualizar somente changelog em andamento.
- [x] 2.3 Revisar independentemente arquitetura e implementação e corrigir achados.
- [x] 2.4 Executar formatação e npm run format, lint, build, typecheck, npm run validate, quality, E2E e OpenSpec estrito; registrar limitações e evidências de CI sem presumir execução.

## Evidências locais

- Testes de release: 55/55; inventário de segurança dos workflows: 11/11; lint e typecheck aprovados.
- Revisão independente: corrigidos consulta da tentativa original, preservação do destino e fixture de versão; nenhum outro bloqueio identificado.
- Sem mudanças visuais ou de componentes; acessibilidade, temas, responsividade e Storybook não recebem novas APIs. O smoke Next.js existente é preservado na preparação.
- Integração real dos workflows entre execuções e primeiro publish OIDC continuam pendentes de merge/autorização e não são simulados como concluídos.

- Validação completa e build: bloqueados por uv_interface_addresses no Storybook; E2E local bloqueado por ausência do build de produção.
- Quality: 1.500 testes unitários passaram; test:ci final teve 115 aprovados, 1 falha de chown do ambiente e 17 skips. O inventário de workflows foi corrigido e passou (11/11). CI ainda precisa confirmar todos os gates no SHA da PR.
- OpenSpec estrito: 66/66; formatação aprovada. Nenhuma baseline foi atualizada.

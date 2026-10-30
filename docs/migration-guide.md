# Guia de migração

## Integração inicial

Consulte [Integração](integration.md) para os imports públicos e o CSS compilado. Use exclusivamente os exports dos pacotes `@dvmarques/admin-ds-tokens`, `@dvmarques/admin-ds-components` e `@dvmarques/admin-ds-admin`; não importe arquivos internos de `src/`.

## Atualizações

1. Consulte [CHANGELOG](../CHANGELOG.md) e identifique a versão de origem e destino.
2. Localize os componentes afetados e mudanças de comportamento.
3. Verifique estilos e tokens, principalmente temas claro/escuro.
4. Execute build, verificação de tipos, testes de componentes e E2E na aplicação consumidora.
5. Consulte [Limitações conhecidas](limitations.md) antes de habilitar recursos opcionais.

## Alterações relevantes

- `AdsTabs`: gatilhos não submetem formulários e os ids de tabs/painéis mudaram; seletores de teste devem usar papéis ARIA.
- `AdsConfirmDialog`: diálogos destrutivos usam `alertdialog`; passe `role="dialog"` quando necessário.
- `AdsSmartTable`: virtualização, redimensionamento e exportação são opcionais; paginação, busca e ordenação permanecem responsabilidade do consumidor.
- Tipografia: carregue Inter na aplicação ou sobrescreva o token de fonte, conforme o changelog.

As mudanças futuras devem acrescentar instruções específicas de migração quando houver impacto observável.

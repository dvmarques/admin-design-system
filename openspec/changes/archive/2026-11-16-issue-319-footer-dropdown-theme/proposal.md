# Footer opcional, agrupamento de dropdown e contratos de tema — #319

## Why

O shell atual oferece header, sidebar e main, mas não um footer opcional integrado à sua geometria. O dropdown já usa um único mecanismo de menu, foco e portal, mas não possui elementos de agrupamento reutilizáveis. Os controles de tema já existem: o risco está na integração entre preferência, CSS, hidratação e overlays, e não na ausência de novo provider.

## What Changes

- Acrescentar **apenas** `AdsAdminShell.Footer`, opcional, sem criar `AdsFooter`, com slots `start`/`end`, conteúdo livre, CSS semântico e layout responsivo no shell padrão e `sidebar-header`. O footer é irmão de `Body`, mantendo `main` como região de rolagem independente no desktop.
- Acrescentar `AdsDropdown.Header` e `AdsDropdown.Divider`, sem modificar `Root`/`Trigger`/`Content`/`Item`. Permitir agrupamento acessível por `role=group` e `aria-labelledby` nativos, sem novo mecanismo de dropdown. Tratar Tab/Shift+Tab sem armadilha de foco no portal.
- Consolidar o contrato **existente** `data-theme` efetivo e `AdsThemeControl` como preferência emitida, sem persistência na biblioteca; validar CSS ordenado, SSR/hidratação, overlays e overrides públicos de tokens em temas claro e escuro, inclusive escopos locais portados. Corrigir somente integração demonstravelmente falha.
- Publicar exemplos funcionais no Admin Demo e Storybook, testes automatizados, guia de integração e changelog; registrar evidências e limitações das validações humanas.

## Perfil, escopo e compatibilidade

**Critical**: APIs públicas aditivas, semântica e foco, CSS estrutural e temas/portais. Pacotes `admin` e `components`, `apps/admin-demo`, `apps/docs`, E2E, documentação e OpenSpec. `tokens` mantém seus valores e cores. Nenhuma dependência obrigatória nova. APIs existentes permanecem intactas; a única diferença de foco é o fechamento de menu em Tab, conforme convenção de menus. CSS prefixado e ativado pela presença efetiva do footer.

## Fora do escopo

Novo provedor de temas, armazenamento/persistência obrigatória, redefinição de cores, alterações em consumidores externos, framework de layout, segundo motor de dropdown, merge, archive ou fechamento de issue.

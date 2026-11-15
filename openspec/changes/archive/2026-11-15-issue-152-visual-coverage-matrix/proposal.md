# Matriz de cobertura visual por estado (#152)

## Why

A auditoria inicial do catálogo captura apenas o estado visível inicial. O histórico das PRs #313 e #322 comprova 328 capturas e a remoção dos quatro sinais iniciais, mas não comprova estados interativos, zoom, acessibilidade ou inspeção humana. É necessário planejar e medir a cobertura sem multiplicar cegamente todos os estados, temas e larguras.

## What Changes

- Matriz versionada por export existente, com perfis e exceções justificadas, derivando nomes, rotas e Storybook das fontes canônicas sem duplicá-los.
- Validação fail-closed contra catálogo para exports novos/removidos, estados incoerentes, cenários duplicados e links de evidência.
- Incremento opt-in do Playwright para interações representativas, overlays, dados, teclado, larguras e preferências de mídia.
- Relatórios JSON/Markdown que separam planejado, não aplicável, executado, passou em verificação objetiva, falha e revisão humana.
- Testes Node leves na CI normal; auditoria de screenshots exclusiva do workflow manual.

## Perfil e impacto

**Standard.** Mudanças somente em scripts, testes Playwright, documentação, OpenSpec e workflow manual do Admin Demo; não modificam exports, APIs públicas, componentes distribuídos, design tokens nem CSS compilado. Valor ao consumidor: melhor sinalização de risco de regressão sem alterar comportamento público. Não há mudança de bundle, dependência nem migração.

## Fora do escopo

Não corrigir visuais sem evidência, não redesenhar componentes, não multiplicar combinações indiscriminadamente, não reescrever snapshots oficiais, não declarar aprovação humana por heurísticas e não fechar a #152.

## Referências

Issue #152, PR #313, PR #322, docs/visual-audit.md, docs/visual-audit-inventory.md e catálogo #151.

# Design — triagem da auditoria visual #152

## Evidências, causa e decisão

Fonte: [execução Actions #43617023449](https://github.com/dvmarques/admin-design-system/actions/runs/43617023449), Chromium, `develop` no SHA `6f11132`.

1. **Organização (confirmado na composição)**: `OrganizationSwitcherDemo` monta `/catalogo-organizacao/?variante=com|sem` sem `theme`. A página isolada `catalogo-organizacao/page.tsx` aceita `?theme=dark` e escolhe light no caso omisso. Portanto, nos 2 cenários dark a moldura externa escurece, mas o conteúdo dos iframes permanece claro. Reutilizar `useTheme('light')` do Admin Demo para ler o tema efetivo do `<html>`, anexando `&theme=${theme}` aos dois URLs; o navegador atualiza o `src` ao alternar, sem postar mensagens entre janelas nem mudar o pacote público. O `basePath` atual deve ser preservado. A página isolada continua aceitando light como padrão para acesso direto. Testar light → dark → light e 390/1440px.
2. **Upload (confirmado no layout da demo)**: `FileUploadDemo` envolve `AdsFileUpload`, botão e `Link` num `<div>` sem espaçamento; a captura mobile mostra botão e link colados. Aplicar classes semânticas locais, grid com gap vertical e grupo de ações flexível com gap horizontal e `flex-wrap`. Tokens existentes `--ads-spacing-3`, nenhuma classe pública nem import Tailwind oculto. Confirmar navegação acessível e ausência de sobreposição em 320/390/1440px.
3. **AdminShell (falso positivo provável)**: o botão icon-only `Recolher barra lateral` reportou `scrollWidth=32` contra `clientWidth=26` com `overflow: visible`; PNGs mostram o chevron inteiro e centralizado, sem recorte. `scrollWidth>clientWidth` sozinho não implica truncamento quando `overflow-x: visible`. A heurística de conteúdo recortado deve exigir `overflow-x: hidden|clip`, preservando as outras heurísticas (`documentOverflowPx`, `previewOverflowPx` e `controlsOutOfBounds`) para detectar transbordamento real. Documentar exclusão explícita de `visible`/rolagem intencional, sem alterar CSS público ou o ícone.

## Fronteiras, acessibilidade e riscos

- Alterações no **Client Component** do catálogo e CSS de `apps/admin-demo`; o layout global e pacotes publicados ficam inalterados. `useTheme` segue a fonte `data-theme` efetiva, inclusive no modo Sistema. A página isolada reaplica o atributo do tema por `useEffect` após navegação. Sem mudança de API, SSR de consumidores, bundle de pacotes ou CSS distribuído.
- Testes em `e2e` devem conferir ambos iframes e os espaçamentos sem depender de comparação pixel-a-pixel. Revisar screenshots da auditoria opt-in após mudança.
- A heurística deixa de alertar conteúdo que excede caixa mas é **intencionalmente visível**; outros detectores de bordas/viewport permanecem ativos. Caso conteúdo visível se sobreponha a controles sem sair das bordas, a revisão humana continua necessária.
- Nenhuma dependência adicionada; rollback reverte apenas demonstração, auditor, testes e documentação. Snapshots oficiais são intencionais e exigem revisão pelo workflow Linux caso alguma comparação existente seja afetada. Não atualizar baselines automaticamente.

## Validação

Executar `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality`, `npm run test:e2e`, `npm run audit:visual`, `npm run validate` e OpenSpec estrito em ambiente com ferramentas. Na PR Ready, conferir CI, Pages e Security reais no SHA atual; sem execução não marcar gates como concluídos.

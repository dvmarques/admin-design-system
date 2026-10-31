# Histórico por componente

Este índice destaca mudanças observáveis e ligações às issues originais. A referência de versão é o [CHANGELOG principal](../CHANGELOG.md), organizado por `[0.1.1] - Em andamento` e histórico anterior; **a preparação para npm da #194 ainda não significa uma versão publicada**. Não atribua um número de release npm a entradas que pertencem somente ao estado de desenvolvimento. A [API atual está no Storybook](https://dvmarques.github.io/admin-design-system/storybook/).

| Componente / área | Alteração relevante | Origem |
| --- | --- | --- |
| `AdsThemeControl` | Novo controle Claro/Escuro/Sistema, menu compacto ou grupo, modo controlado/não controlado; aplicação resolve persistência e tema efetivo | [#182](https://github.com/dvmarques/admin-design-system/issues/182) |
| `ThemeToggle` | Continua exportado como alternância binária; não foi depreciado. Migração para `AdsThemeControl` é opt-in | [#182](https://github.com/dvmarques/admin-design-system/issues/182) |
| `AdsAccountMenu` | Menu de conta pelo avatar, ações e estados assíncronos; sem autenticação integrada | [#185](https://github.com/dvmarques/admin-design-system/issues/185) |
| `AdsNotificationCenter` | Painel lateral com contador, filtros e marcação controlada de leitura; dados vêm da aplicação | [#185](https://github.com/dvmarques/admin-design-system/issues/185) |
| `AdsOrganizationSwitcher` | Seletor opcional no topo da sidebar; painel usa apresentação popover do `AdsCombobox` | [#185](https://github.com/dvmarques/admin-design-system/issues/185), [#239](https://github.com/dvmarques/admin-design-system/issues/239) |
| `AdsAdminShell` | Header/sidebar fixos, regiões roláveis e navegação composicional; refinamento do logo/recolhimento, layout e responsividade | [#136](https://github.com/dvmarques/admin-design-system/issues/136), [#187](https://github.com/dvmarques/admin-design-system/issues/187) |
| Dashboard do demo / composições | Ajustes de densidade, indicadores e espaçamento; demo não define contratos de negócio do shell | [#187](https://github.com/dvmarques/admin-design-system/issues/187) |
| `AdsMaskedInput` | Subpath separado com peer opcional `react-imask` | [#231](https://github.com/dvmarques/admin-design-system/issues/231) |
| `AdsHighlightedCodeSnippet` | Pacote opcional com Shiki isolado do entrypoint components | [#213](https://github.com/dvmarques/admin-design-system/issues/213), [#241](https://github.com/dvmarques/admin-design-system/issues/241) |
| `AdsPasswordInput` / `AdsInput` | Novo campo de senha e encaminhamento de ref | [#147](https://github.com/dvmarques/admin-design-system/issues/147) |
| `AdsSmartTable` | Virtualização, redimensionamento e exportação opcionais; `getAdsSmartTableCsv` é auxiliar não visual | [#93](https://github.com/dvmarques/admin-design-system/issues/93) |
| `AdsConfirmDialog` | `alertdialog` para confirmação destrutiva; foco inicial considera controles elegíveis no conteúdo antes de Cancelar | [#92](https://github.com/dvmarques/admin-design-system/issues/92), [#192](https://github.com/dvmarques/admin-design-system/issues/192) |
| `AdsStepForm` | Validação assíncrona, navegação e tratamento de resultados obsoletos | [#92](https://github.com/dvmarques/admin-design-system/issues/92) |
| `AdsPagination` | Navegação responsiva e salto de página | [#138](https://github.com/dvmarques/admin-design-system/issues/138) |
| `AdsAccordion`, `AdsTabs` e `AdsBreadcrumb` | Composição, teclado, IDs e recolhimento de itens | [#90](https://github.com/dvmarques/admin-design-system/issues/90) |
| `AdsSparkline` | Série SVG acessível não interativa | [#89](https://github.com/dvmarques/admin-design-system/issues/89) |
| `AdsTooltip` e `AdsPopover` | Escape, `aria-describedby`, âncora no gatilho real e reposicionamento | [#148](https://github.com/dvmarques/admin-design-system/issues/148), [#91](https://github.com/dvmarques/admin-design-system/issues/91), [#244](https://github.com/dvmarques/admin-design-system/issues/244) |
| `AdsDialog` e `AdsDrawer` | Fundo inerte, foco inicial em controles elegíveis e ciclo de Tab | [#149](https://github.com/dvmarques/admin-design-system/issues/149), [#234](https://github.com/dvmarques/admin-design-system/issues/234) |

Para detalhes de props, variantes, estados e exemplos, consulte o [Storybook](https://dvmarques.github.io/admin-design-system/storybook/) em vez de duplicar tabelas. Para atualizar uma aplicação existente, veja [migração](migration-guide.md), [integração](integration.md) e [limitações](limitations.md).

Ao registrar uma nova alteração pública, atualize este índice **e** o [CHANGELOG principal](../CHANGELOG.md), preservando datas, versões verificadas e vínculos às issues.

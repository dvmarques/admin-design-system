# Reconciliação de títulos históricos OpenSpec — #197

Fonte: [change arquivada de 06/09/2026](../openspec/changes/archive/2026-09-06-refine-component-visual-language/), comparada por nome com [specs vigentes](../openspec/specs/) em 25/10/2026 (branch `develop`, base da branch documental). **São 17 títulos sem correspondência literal**, não 17 comportamentos demonstradamente perdidos. A change possui ainda requisitos com títulos idênticos; não foram contados como ausentes.

A coluna «cobertura candidata» é um **encaminhamento para investigação semântica**, não prova de comportamento executado. «Substituição editorial» indica assunto próximo; «possível perda de especificidade» exige verificar o cenário ausente antes de declarar equivalência. Nenhuma spec vigente foi alterada apenas pela diferença de título.

| Capability | Título da change de 06/09 | Cobertura candidata na spec vigente | Avaliação documental |
| --- | --- | --- | --- |
| [anchored-overlays](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/anchored-overlays/spec.md) | Contexto ancorado com contraste refinado | [Posicionamento responsivo e tematização](../openspec/specs/anchored-overlays/spec.md) | substituição editorial |
| [avatar](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/avatar/spec.md) | Avatar proporcional à linguagem de componentes | [Tamanhos, temas e responsividade](../openspec/specs/avatar/spec.md) | substituição editorial |
| [badge](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/badge/spec.md) | Status compacto e distinguível | [Badge acessível e responsivo](../openspec/specs/badge/spec.md) | substituição editorial |
| [button](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/button/spec.md) | Hierarquia tátil de variantes | [Botão com variantes e tamanhos públicos](../openspec/specs/button/spec.md) | substituição editorial |
| [design-tokens](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/design-tokens/spec.md) | Papéis visuais refinados e compatíveis | [Tokens visuais globais coerentes](../openspec/specs/design-tokens/spec.md) | substituição editorial |
| [form-controls](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/form-controls/spec.md) | Feedback visual refinado dos campos textuais | [Estados visuais e operacionais de controles textuais](../openspec/specs/form-controls/spec.md) | substituição editorial |
| [form-field-composition](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/form-field-composition/spec.md) | Ritmo visual de composição de campo | [Consistência visual da composição](../openspec/specs/form-field-composition/spec.md) | substituição editorial |
| [form-selection-controls](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/form-selection-controls/spec.md) | Seleção com estados perceptíveis | [Estados e temas dos controles de seleção](../openspec/specs/form-selection-controls/spec.md) | substituição editorial |
| [icon](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/icon/spec.md) | Escala óptica consistente de ícones | [Ícones nomeados e dimensionáveis](../openspec/specs/icon/spec.md) | possível perda de especificidade |
| [loading-indicator](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/loading-indicator/spec.md) | Indicador alinhado à linguagem de movimento | [Temas, movimento e personalização](../openspec/specs/loading-indicator/spec.md) | substituição editorial |
| [navigation-menus](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/navigation-menus/spec.md) | Menu contextual com superfície e estados claros | [Posicionamento visível e tematizável](../openspec/specs/navigation-menus/spec.md) | substituição editorial |
| [navigation-structure](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/navigation-structure/spec.md) | Navegação com hierarquia de estado refinada | [Seleção de navegação é estrutural e responsiva](../openspec/specs/navigation-structure/spec.md) | substituição editorial |
| [overlay-dialogs](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/overlay-dialogs/spec.md) | Hierarquia visual de overlays modais | [Overlays modais respeitam escala de camada e largura reduzida](../openspec/specs/overlay-dialogs/spec.md) | substituição editorial |
| [pagination](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/pagination/spec.md) | Paginação com página atual evidente | [Estados visuais consistentes](../openspec/specs/pagination/spec.md) | substituição editorial |
| [surface](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/surface/spec.md) | Níveis de superfície distinguíveis | [Superfícies composicionais](../openspec/specs/surface/spec.md) | possível perda de especificidade |
| [toast-notifications](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/toast-notifications/spec.md) | Notificação transitória hierarquizada | [Temas, tokens e layout responsivo](../openspec/specs/toast-notifications/spec.md) | possível perda de especificidade |
| [typography](../openspec/changes/archive/2026-09-06-refine-component-visual-language/specs/typography/spec.md) | Hierarquia administrativa com ritmo refinado | [Hierarquia tipográfica compacta nos componentes existentes](../openspec/specs/typography/spec.md) | substituição editorial |

## Revisão dos cenários (texto antigo versus texto vigente)

Foram lidos os 17 textos `MUST` e respectivos cenários da change de 06/09, confrontando-os com os requisitos vigentes apontados na tabela. O diagnóstico abaixo é **normativo**, não resultado de teste em navegador:

| Capability | Observação baseada no cenário |
| --- | --- |
| anchored-overlays | **Parcial:** há contraste/tema e associação ao gatilho, mas não o cenário específico sobre superfície já elevada |
| avatar | **Parcial:** menor tamanho e legibilidade constam; alinhamento óptico do fallback textual com controles vizinhos não está explícito no candidato |
| badge | **Parcial:** conteúdo sem overflow e significado sem depender de cor constam; distinção entre várias variantes compactas, independente de pílula, não está explicitada |
| button | **Disperso:** variantes e operação nativa constam, e há requisito separado para foco/hover; pressionamento, loading e preferência de movimento exigem conferência cruzada |
| design-tokens | **Disperso:** estabilidade de nomes e papéis semânticos constam em requisitos distintos; não se deve confundir essa cobertura distribuída com remoção de contrato |
| form-controls | **Equivalência documental forte:** o cenário «campo inválido recebe foco» e a exigência de foco/erro distinguíveis nos dois temas aparecem novamente de modo explícito |
| form-field-composition | **Parcial:** composição e validação constam, mas o cenário combinado descrição + erro não é uma correspondência textual exata |
| form-selection-controls | **Parcial:** estados e texto legível constam; cenário de opção desabilitada e contraste do rótulo não é reproduzido literalmente |
| icon | **Possível lacuna normativa:** o atual «ícones nomeados e dimensionáveis» não exige alinhamento óptico com texto de ação, peso e proporção equivalentes |
| loading-indicator | **Equivalência documental forte:** redução de movimento preservando a comunicação de carregamento consta nos dois cenários |
| navigation-menus | **Parcial:** posicionamento/tema constam, mas o item desabilitado visualmente distinguível deve ser conferido nos requisitos de foco/itens |
| navigation-structure | **Parcial:** seleção/foco distintos constam; cenário de tab focada porém inativa requer checagem transversal com o requisito de tabs |
| overlay-dialogs | **Parcial:** elevação, camada e layout estreito constam; hierarquia interna de título, descrição, ação e backdrop precisa de checagem nos requisitos de modal |
| pagination | **Parcial:** estados/foco e teclado constam; identificação da página atual sem depender exclusivamente da cor deve ser conferida em outros requisitos |
| surface | **Possível lacuna normativa:** agrupamento elevado é explícito, mas distinguir **simultaneamente** as variantes neutra, elevada e contornada não está no cenário candidato |
| toast-notifications | **Parcial:** largura estreita, contraste, variantes e fechamento constam; hierarquia visual e caso específico de erro longo exigem revisão cruzada |
| typography | **Parcial:** escala tipográfica tokenizada consta; hierarquia de título/corpo/auxiliar em uma única seção administrativa não está no cenário candidato |

**Conclusão:** 2 equivalências documentais fortes, 13 coberturas parciais ou dispersas (inclusive notificações transitórias) e 2 possíveis lacunas normativas específicas (ícone e superfície). Essa classificação não significa três bugs, nem confirma regressão funcional. Se uma lacuna de comportamento for comprovada, abrir issue funcional separada.

## Próxima verificação

Para encerrar a verificação de **comportamento**, confrontar os cenários com código, Storybook e testes em execução; a comparação textual de WHEN/THEN já consta acima. Em especial `icon` (escala óptica), `surface` (distinção entre níveis) e `toast-notifications` (hierarquia de notificações) podem ter perdido precisão normativa. Se a leitura e os testes confirmarem perda funcional, criar issue funcional separada; não restaurar automaticamente requisitos históricos.

As evidências da [#187](../openspec/changes/archive/2026-10-25-refine-dashboard-sidebar-branding/evidence/README.md) são revisões de UI de outra change, não evidência de equivalência desta matriz. A #196 trata contratos atuais de CI e a #164 é responsável por medições pós-merge; nenhuma dessas tarefas deve ser duplicada.

**Limitação:** comparação documental de requisitos e cenários, sem execução de testes nem auditoria de implementação. Correspondências parciais permanecem indeterminadas quanto à equivalência funcional.

# Design — cobertura visual seletiva

## Fontes de verdade e arquitetura

1. catalog-data.ts e o inventário/Storybook existentes permanecem canônicos para nome, grupo, slug, rota e stories.
2. A configuração de cobertura versiona apenas a associação export → perfil, aplicabilidades, exceções e cenários explicitamente selecionados. A verificação cruza conjuntos de exports por igualdade; qualquer ausência ou sobra falha.
3. Perfis representam famílias de risco e estados; exceções por export documentam diferenças reais. Estado não testado não será rotulado como não aplicável.
4. Os testes opt-in visitam o build atual da aplicação Next.js com Playwright existente. Cada cenário produz seu próprio manifesto de execução, com tema, viewport, ação, screenshot, assertivas e erro, evitando disputas entre workers.
5. Um agregador confronta cenários planejados e manifestos reais, produz pendências e sinaliza links faltantes; não converte ausência de sinal em inspeção humana aprovada.

## Seleção eficiente e risco

- Todos os exports mantêm as quatro amostras iniciais atuais (390/1440, claro/escuro), sem regressão.
- Complementos por risco: formulário, overlay, tabela, navegação, sidebar, incluindo 320/768, reduced motion e forced-colors nos casos pertinentes. Não rodar produto cartesiano.
- Estados com demonstração ausente permanecem pendentes e explicitamente não comprovados.
- Capturas portaled usam página inteira; demonstrações normais usam região do preview. No caso de iframe, teste específico deve inspecionar o documento interno, nunca presumir que a composição externa é suficiente.
- O zoom de navegador de 200% permanece revisão manual se não existir método que represente reflow real; viewport equivalente ou CSS zoom são aproximações e não devem ser anunciadas como zoom real.
- Escolher verificações objetivas por semântica (ARIA/foco/estado) e separar julgamento visual subjetivo para pessoa revisora.

## Compatibilidade e acessibilidade

Sem alteração em API, comportamento de componentes, tokens, Tailwind, temas distribuídos ou HTML de consumidores. Testes devem preferir role, nome acessível e estado semântico; light/dark e teclado são explícitos. Reduced motion e forced colors representam emulação de mídia, não aprovação WCAG por si sós. Dados fictícios e artefatos ignorados no Git.

## Alternativas descartadas e riscos

- Produto completo de 83 exports × estados × temas × viewports: tempo/custo excessivos, muitos falsos positivos e cenários N/A.
- Novos snapshots/baselines automáticos: revisão insuficiente e risco de legitimar regressões.
- Copiar todo o inventário: deriva e custos de manutenção. A matriz referencia o inventário existente.
- Riscos: demos de composição compartilham componentes; selectors semânticos podem variar; o runner CI não está disponível em todos os ambientes. Falhas/pêndencias devem aparecer no relatório, não como aprovação.

## Reversão

Remover scripts/testes/report opt-in e os registros de configuração, sem migração ou impacto em consumidores. Preservar histórico e relatórios das fases 1/2.

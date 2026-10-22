## ADDED Requirements

### Requirement: Posicionamento efetivo dos overlays

Tooltip, Popover e Dropdown SHALL preferir o placement solicitado, escolher o oposto quando não houver espaço suficiente no eixo principal e ajustar o posicionamento à área visível sempre que geometricamente possível.

#### Scenario: Flip próximo à borda inferior

- **WHEN** um overlay solicitado em bottom não cabe abaixo da âncora e cabe acima
- **THEN** ele aparece acima e usa placement efetivo top

#### Scenario: Flip nos demais lados

- **WHEN** top, left ou right não comporta o painel e o lado oposto comporta
- **THEN** o overlay usa respectivamente bottom, right ou left

#### Scenario: Nenhum lado oposto comporta o painel

- **WHEN** ambos os lados do eixo solicitado são insuficientes
- **THEN** o overlay escolhe o lado com maior espaço, preserva a preferência em empate e ajusta ambos os eixos aos limites visíveis

#### Scenario: Margem e alinhamento

- **WHEN** existe espaço para o painel inteiro na viewport
- **THEN** o painel respeita uma margem de 8px e preserva o alinhamento solicitado quando não há colisão

#### Scenario: Shift na borda lateral

- **WHEN** o painel excederia a borda lateral e existe espaço para deslocamento
- **THEN** ele é deslocado para dentro da viewport sem alterar desnecessariamente o lado

#### Scenario: Conteúdo maior que a viewport

- **WHEN** o painel é maior que a área visível
- **THEN** o posicionamento evita coordenadas inválidas e não promete visibilidade integral impossível

### Requirement: Metadados e seta consistentes

O Tooltip SHALL refletir o placement efetivo em data-placement e manter a seta apontando para a âncora após flip e shift.

#### Scenario: Metadados dos painéis

- **WHEN** Tooltip, Popover ou Dropdown muda de lado
- **THEN** seu data-placement informa o lado efetivo

#### Scenario: Seta após flip e shift

- **WHEN** um Tooltip muda de lado ou é deslocado transversalmente
- **THEN** data-placement corresponde ao lado renderizado e a seta permanece alinhada à âncora dentro dos limites do painel

### Requirement: Reposicionamento responsivo

Overlays abertos SHALL recalcular a posição após alterações geométricas da âncora, painel, scroll, resize e zoom, sem listeners ou observers persistentes após desmontagem.

#### Scenario: Conteúdo dinâmico

- **WHEN** o conteúdo aberto muda de tamanho
- **THEN** a posição é recalculada sem reabrir o overlay

#### Scenario: Montagem tardia do portal

- **WHEN** o painel é anexado após a primeira renderização ou substituído enquanto aberto
- **THEN** ele é medido antes de ficar visível e suas mudanças de tamanho são acompanhadas

#### Scenario: Scroll e resize

- **WHEN** a viewport ou um ancestral rolável se move ou muda de tamanho
- **THEN** o painel acompanha a âncora e permanece visível quando possível

#### Scenario: Zoom

- **WHEN** o viewport visual muda por zoom ou deslocamento
- **THEN** o posicionamento usa a área visual atual e é recalculado

#### Scenario: Desmontagem

- **WHEN** o overlay fecha ou desmonta
- **THEN** listeners, observers e atualizações agendadas são removidos

### Requirement: Compatibilidade e acessibilidade

A correção SHALL preservar as props públicas, renderização segura em SSR, foco, Escape, clique externo, modalidade, overlays aninhados, temas e integração Next.js.

#### Scenario: Renderização no servidor

- **WHEN** um consumidor renderiza a árvore no servidor e hidrata no cliente
- **THEN** nenhuma API do navegador é acessada durante renderização do servidor e não há divergência de hidratação causada pelo posicionamento

#### Scenario: Interações existentes

- **WHEN** o usuário navega por teclado, fecha pelo Escape ou interage com overlays aninhados
- **THEN** as regras de foco, fechamento e modalidade permanecem inalteradas

#### Scenario: Temas e estilos distribuídos

- **WHEN** uma aplicação Next.js consome somente os exports públicos e o CSS compilado em tema claro ou escuro
- **THEN** painel e seta mantêm seus estilos, o posicionamento e as associações acessíveis sem Tailwind no consumidor

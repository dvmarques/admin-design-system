# anchored-overlays — delta da issue #244

## ADDED Requirements

### Requirement: Posicionamento ancorado no gatilho real em layouts flexíveis
AdsTooltip MUST posicionar o painel em relação à geometria visível do seu gatilho, e não ao espaço extra ocupado por um wrapper esticado pelo layout pai. AdsPopover MUST ter o mesmo comportamento quando usar wrapper de âncora. Os componentes MUST preservar posicionamento, seta, temas e eventos de teclado/ponteiro já documentados em layouts flex, grid e bloco.

#### Scenario: Tooltip dentro de coluna flex com stretch
- **WHEN** um AdsTooltip com botão compacto é exibido numa coluna flex com align-items:stretch e espaço livre acima
- **THEN** o painel solicitado em top aparece imediatamente acima do botão, centralizado em relação à geometria dele, e não no centro do contêiner

#### Scenario: Popover em layout com item esticado
- **WHEN** um AdsPopover envolve gatilho compacto dentro de grid ou flex que estica seus filhos
- **THEN** o conteúdo se ancora ao gatilho real, sem deslocamento decorrente da largura extra do wrapper

#### Scenario: Gatilho ocupa toda a largura por intenção
- **WHEN** o gatilho tem largura explicitamente igual à largura disponível
- **THEN** o painel se posiciona em relação ao gatilho visualmente largo sem alterar suas dimensões por causa da lógica de âncora

#### Scenario: Collision avoidance
- **WHEN** um tooltip abre perto de uma borda e seu posicionamento preferido excederia a viewport
- **THEN** o painel usa flip ou shift existente, data-placement informa o lado efetivo e a seta continua apontando para o gatilho dentro dos limites possíveis

#### Scenario: Layout muda após abertura
- **WHEN** o contêiner rola ou o tamanho do gatilho/painel muda com resize ou zoom
- **THEN** o painel acompanha a geometria real atual do gatilho sem perder alinhamento ou deixar listeners ativos depois do fechamento

#### Scenario: Foco, ARIA e tema preservados
- **WHEN** o tooltip é aberto por foco ou hover, associado a descrição ARIA pré-existente, em claro ou escuro ou dentro de modal
- **THEN** continua acessível, dispensável por Escape e com descrição restaurada ao fechar, preservando fonte, cores e foco existentes

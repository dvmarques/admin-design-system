## MODIFIED Requirements

### Requirement: Foco e hover respeitam a hierarquia de ação

AdsButton MUST usar papéis semânticos de hover e foco que preservem a distinção entre ações primária, secundária, discreta e destrutiva. O foco visível MUST permanecer externo ao limite do botão. O estado de carregamento MUST manter largura, altura e posição do rótulo ao alternar `isLoading`, em todos os tamanhos, com rótulos curtos e longos, e MUST preservar o bloqueio de acionamento, `aria-busy`, o nome acessível, o movimento reduzido e os temas claro e escuro.

#### Scenario: Ação destrutiva recebe foco

- **WHEN** uma pessoa focaliza pelo teclado uma ação destrutiva habilitada
- **THEN** o foco é perceptível sem confundir a ação com uma variante primária e o rótulo não sofre deslocamento ao iniciar o carregamento

#### Scenario: Alternar carregamento mantém a geometria

- **WHEN** `isLoading` alterna em um botão `sm`, `md` ou `lg` com rótulo curto ou longo, em tema claro ou escuro
- **THEN** largura, altura e posição do rótulo permanecem iguais e o indicador aparece centralizado sobre o botão

#### Scenario: Carregamento preserva a semântica

- **WHEN** o botão está carregando
- **THEN** ele permanece desabilitado para acionamento, expõe `aria-busy="true"` e mantém o nome acessível do rótulo

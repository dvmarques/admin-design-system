## MODIFIED Requirements

### Requirement: Smoke tests em Firefox e WebKit

O projeto MUST executar smoke tests em Firefox e WebKit para as rotas `/`, `/clientes` e `/componentes` do admin demo, verificando que a página carrega sem erros de console ou de hidratação e que a navegação principal fica operável. Firefox e WebKit MUST também executar a regressão de foco do dropdown (`dropdown-focus.spec.ts`) e o controle de tema (`theme-control.spec.ts`, rota `/catalogo/theme-control`). Esses navegadores MUST NOT executar comparações de snapshot. Cada navegador MUST ter uma verificação independente e obrigatória na CI.

#### Scenario: Rota quebra em um navegador

- **WHEN** uma rota coberta lança erro de console ou falha de hidratação em Firefox ou WebKit
- **THEN** a verificação daquele navegador falha sem ocultar o resultado dos demais

#### Scenario: Navegadores executam em paralelo

- **WHEN** a CI de uma PR executa os testes no navegador
- **THEN** Chromium, Firefox e WebKit executam em verificações paralelas e independentes

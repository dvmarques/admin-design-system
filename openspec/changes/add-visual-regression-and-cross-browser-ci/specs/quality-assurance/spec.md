## ADDED Requirements

### Requirement: Snapshots visuais executam na CI com baselines Linux

O projeto MUST executar os testes de snapshot visual em toda execução de CI de Pull Request, usando baselines Linux versionados no repositório como única fonte da verdade, sem pular os testes e sem tolerância de diferença de pixels. O projeto MUST disponibilizar um fluxo manual na CI que regenere os baselines e os registre na branch da PR, sem exigir execução local.

#### Scenario: Alteração muda a aparência de uma rota

- **WHEN** uma PR altera estilos ou tokens e a aparência de uma rota coberta difere do baseline
- **THEN** a verificação de snapshots falha na CI e indica a diferença

#### Scenario: Mudança visual intencional

- **WHEN** a mudança visual é intencional e revisada
- **THEN** a pessoa aciona o fluxo de atualização de baselines, revisa o diff dos PNGs na PR e a verificação passa

#### Scenario: Baselines de outra plataforma

- **WHEN** o repositório é inspecionado
- **THEN** ele não contém baselines `win32` e a documentação não prevê atualização local de snapshots

### Requirement: Smoke tests em Firefox e WebKit

O projeto MUST executar smoke tests em Firefox e WebKit para as rotas `/`, `/clientes` e `/componentes` do admin demo, verificando que a página carrega sem erros de console ou de hidratação e que a navegação principal fica operável. Esses navegadores MUST NOT executar comparações de snapshot. Cada navegador MUST ter uma verificação independente e obrigatória na CI.

#### Scenario: Rota quebra em um navegador

- **WHEN** uma rota coberta lança erro de console ou falha de hidratação em Firefox ou WebKit
- **THEN** a verificação daquele navegador falha sem ocultar o resultado dos demais

#### Scenario: Navegadores executam em paralelo

- **WHEN** a CI de uma PR executa os testes no navegador
- **THEN** Chromium, Firefox e WebKit executam em verificações paralelas e independentes

### Requirement: Impacto da regressão visual e cross-browser no tempo de CI documentado

O projeto MUST documentar o tempo de CI medido antes e depois da inclusão dos snapshots e dos smoke tests, além do processo de atualização de baselines e das limitações de cobertura dos navegadores.

#### Scenario: Pessoa consulta a documentação de qualidade

- **WHEN** a pessoa lê `docs/quality.md` e `docs/limitations.md`
- **THEN** encontra o tempo de CI medido, o fluxo de atualização de baselines Linux e os navegadores cobertos por cada tipo de teste

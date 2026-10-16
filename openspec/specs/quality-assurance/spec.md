# quality-assurance Specification

## Purpose

Estabelecer critérios verificáveis de qualidade para proteger tipos, comportamento, acessibilidade, compatibilidade e distribuição do design system.

## Requirements

### Requirement: Verificação obrigatória da base

O projeto MUST disponibilizar um comando principal de validação que execute formatação, lint, tipos, testes, build e testes end-to-end para os pacotes e aplicações afetados. O projeto MUST disponibilizar também um comando dedicado para executar a suíte E2E localmente, incluindo a aplicação de referência e os artefatos que ela consome.

#### Scenario: Alteração viola uma verificação obrigatória

- **WHEN** uma alteração introduz erro de lint, tipo, teste, build ou fluxo E2E
- **THEN** a verificação automatizada termina com falha

#### Scenario: Pessoa executa a validação principal localmente

- **WHEN** a pessoa executa o comando principal de validação antes de enviar um PR
- **THEN** a suíte E2E é executada após as verificações de qualidade e build necessárias

### Requirement: Testes de comportamento público

Cada componente público MUST possuir testes para seus comportamentos observáveis, incluindo estados e interações relevantes.

#### Scenario: Componente interativo recebe entrada do usuário

- **WHEN** o usuário executa uma interação suportada
- **THEN** um teste verifica o resultado público esperado

### Requirement: Verificação de acessibilidade

Componentes interativos MUST possuir verificações automatizadas de semântica, nome acessível, foco e operação por teclado aplicáveis.

#### Scenario: Controle é operado somente por teclado

- **WHEN** o fluxo documentado é executado sem dispositivo apontador
- **THEN** todas as ações essenciais permanecem alcançáveis e operáveis com indicação visível de foco

### Requirement: Validação nos dois temas

Os estados visuais públicos MUST ser verificáveis nos temas claro e escuro.

#### Scenario: Alteração afeta estilos compartilhados

- **WHEN** a validação visual é executada
- **THEN** os estados representativos são avaliados nos dois temas

### Requirement: Validação do pacote distribuído

O projeto MUST validar os artefatos efetivamente produzidos para distribuição, e não apenas o código-fonte do workspace.

#### Scenario: Artefato omite uma exportação necessária

- **WHEN** a aplicação de referência tenta consumir o pacote construído
- **THEN** a verificação falha antes que a versão seja considerada publicável

### Requirement: Critério mínimo para componente público

Um componente MUST NOT ser considerado concluído sem API tipada, estilos compilados, documentação, testes de comportamento e verificações de acessibilidade aplicáveis.

#### Scenario: Componente não possui documentação

- **WHEN** a revisão de conclusão detecta ausência de documentação pública
- **THEN** o componente permanece incompleto

### Requirement: Regressão visual da fundação revisada

O projeto MUST manter histórias e snapshots visuais atualizados para os componentes existentes afetados por tokens globais, incluindo estados representativos nos temas claro e escuro.

#### Scenario: Token global altera a aparência compartilhada

- **WHEN** uma alteração modifica a fundação tipográfica ou de cores
- **THEN** a validação visual compara os componentes existentes afetados nos temas claro e escuro e sinaliza regressões não aprovadas

### Requirement: Evidência automatizada de contraste

O projeto MUST verificar automaticamente os pares críticos de cores da fundação visual contra os critérios aplicáveis do WCAG 2.2 nível AA.

#### Scenario: Um token reduz o contraste de conteúdo essencial

- **WHEN** a validação executa para os temas claro e escuro
- **THEN** ela falha se um par crítico de conteúdo, superfície, controle ou foco não atingir o contraste mínimo aplicável

### Requirement: Tema e contraste dos overlays possuem cobertura automatizada

O projeto MUST verificar o tema computado de overlays portados, a troca de tema com o overlay aberto e o contraste dos controles de fechar de dialog, drawer e toast nos estados padrão, hover e foco.

#### Scenario: Validação executa para controles de fechar

- **WHEN** os testes renderizam dialog, drawer e toast em escopos locais claro e escuro
- **THEN** as cores computadas correspondem aos tokens do tema de origem e os pares de contraste atendem aos critérios definidos

### Requirement: Testes de pacote são executados pelo script de teste

Todo arquivo de teste de um pacote MUST ser executado pelo script `test` do pacote, e a validação MUST falhar quando um teste existente deixar de ser executado.

#### Scenario: Teste de CSS distribuído

- **WHEN** `npm test` é executado em `@admin-ds/components`
- **THEN** o teste de que o CSS distribuído contém utilidades estáticas e não inclui preflight é executado e seu resultado conta para o status final

#### Scenario: Arquivo de teste fora do executor

- **WHEN** um arquivo `*.test.*` em `packages/components/tests` não casa com o padrão de inclusão do executor
- **THEN** um teste automatizado falha apontando o arquivo

### Requirement: Verificações de CI independentes e canceláveis

A CI de Pull Request MUST executar as verificações de qualidade, de artefatos
de distribuição e de fluxos no navegador sem dependência de ordem entre elas, de modo que
cada uma seja iniciada sem esperar as demais. A CI MUST cancelar a execução
obsoleta de uma Pull Request quando um novo commit for enviado a ela, e MUST NOT
cancelar execuções de `push` em `develop` ou `master`. Os nomes dos checks
exigidos pelos rulesets MUST permanecer inalterados.

#### Scenario: Início das verificações

- **WHEN** uma PR Ready for review recebe um commit
- **THEN** as verificações de qualidade, de artefatos e de fluxos no navegador são iniciadas em paralelo

#### Scenario: Falha em uma verificação

- **WHEN** uma das verificações falha enquanto as outras ainda executam
- **THEN** as demais concluem e reportam seu resultado, e a PR permanece bloqueada pelo check com falha

#### Scenario: Novo commit na mesma PR

- **WHEN** um novo commit é enviado a uma PR com CI em execução
- **THEN** a execução anterior dessa PR é cancelada e uma nova começa sobre o commit corrente

#### Scenario: Push em branch integrada

- **WHEN** commits são enviados em sequência a `develop` ou `master`
- **THEN** cada execução de `push` conclui sem ser cancelada pela seguinte

#### Scenario: Required checks

- **WHEN** os rulesets de `develop` e `master` avaliam uma PR
- **THEN** os checks "Qualidade rápida", "Artefatos de distribuição" e "Fluxos no navegador" continuam sendo reportados com esses nomes

### Requirement: Execução reduzida da CI em PRs somente de documentação

A CI de Pull Request MUST dispensar a construção dos artefatos e a execução dos
fluxos no navegador quando todos os arquivos alterados forem documentação sem
consumidores em teste, e MUST executar o fluxo completo quando qualquer arquivo
alterado estiver fora dessa classe, quando a classificação não puder ser
determinada, em execuções de `push` e em PRs para `master`. A verificação de
qualidade MUST executar sempre. Os checks exigidos pelos rulesets MUST ser
reportados como concluídos, sem ficar pendentes, também quando o trabalho for
dispensado.

#### Scenario: PR altera só documentação

- **WHEN** uma PR altera apenas arquivos de documentação ou specs sem consumidores em teste
- **THEN** a verificação de qualidade executa, os checks de artefatos e de fluxos no navegador concluem com sucesso sem construir nem testar, e a PR pode ser integrada

#### Scenario: PR altera documentação lida por testes

- **WHEN** uma PR altera um arquivo de documentação que um teste ou script lê
- **THEN** o fluxo completo executa

#### Scenario: PR mistura documentação e código

- **WHEN** uma PR altera documentação e qualquer arquivo fora da classe de documentação
- **THEN** o fluxo completo executa

#### Scenario: Classificação indeterminada

- **WHEN** a lista de arquivos alterados não pode ser calculada ou está vazia
- **THEN** o fluxo completo executa

#### Scenario: Push e PR de release

- **WHEN** ocorre um `push` em `develop` ou `master`, ou uma PR tem `master` como base
- **THEN** o fluxo completo executa, qualquer que seja o conteúdo alterado

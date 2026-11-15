## ADDED Requirements

### Requirement: Auditoria seletiva e rastreável de acessibilidade visual

A auditoria MUST executar verificações seletivas e objetivas de teclado, foco visual, responsividade e preferências do navegador no catálogo sem inferir revisão perceptual humana.

#### Scenario: Foco por teclado com indicação visual
- **WHEN** um controle é alcançado usando Tab ou Shift+Tab
- **THEN** a evidência confirma :focus-visible, mudança visual observável no controle ou ancestral e posição acessível na viewport, além de registrar a captura

#### Scenario: Overlay modal
- **WHEN** um dialog ou drawer é aberto e fechado por teclado
- **THEN** a auditoria testa foco inicial, contenção exigida, Escape e retorno do foco ao acionador

#### Scenario: Navegação selecionada
- **WHEN** um componente disponibiliza navegação de menu, lista, tabela ou abas por teclado
- **THEN** o cenário selecionado usa as teclas suportadas e verifica resultado sem presumir suporte universal

#### Scenario: Zoom de navegador de 200 por cento
- **WHEN** o teste tenta aplicar zoom nativo
- **THEN** só declara o requisito aprovado após comprovar fator aplicado, redução da viewport CSS e reflow efetivo sem simulação de zoom CSS ou redução artificial da viewport; caso contrário registra pendência de comprovação

#### Scenario: Reflow alternativo
- **WHEN** o navegador não permite comprovar zoom nativo
- **THEN** a auditoria executa testes de reflow nomeados como alternativa, sem contabilizá-los como zoom nativo aprovado

#### Scenario: Relatório com status separado
- **WHEN** o workflow manual termina com aprovações, falhas, pendências e capturas
- **THEN** o relatório integra cenários e métodos de zoom, preserva estados N/A e revisão visual humana pendente, e não altera snapshots oficiais

#### Scenario: Preferências de acessibilidade
- **WHEN** um cenário requer redução de movimento ou cores forçadas
- **THEN** a preferência ativada é confirmada no browser antes da asserção e da captura em tema identificado

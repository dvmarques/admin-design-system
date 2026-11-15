## MODIFIED Requirements

### Requirement: Footer semântico e totalmente opcional no shell

O ADS MUST oferecer um único slot público e opt-in `AdsAdminShell.Footer`, com conteúdo inicial e final independentes, conteúdo livre e atributos nativos de footer, sem impor footer nas aplicações consumidoras. O slot MUST preservar a região principal, sua rolagem e a navegação lateral nos layouts `standard` e `sidebar-header`, sem reservar espaço quando ausente.

#### Scenario: Shell sem footer

- **WHEN** o consumidor monta Header, Body, Sidebar e Main sem o slot Footer
- **THEN** não existe elemento footer nem espaço reservado, e a geometria anterior permanece inalterada

#### Scenario: Footer com conteúdo inicial e final

- **WHEN** o consumidor monta Footer depois de Body com `start`, `end` e conteúdo opcional
- **THEN** o HTML contém footer semântico com conteúdo legível em ordem de DOM e os slots refluem quando a largura é estreita

#### Scenario: Navegação lateral e rolagem

- **WHEN** o layout usa sidebar normal, recolhida, móvel ou `sidebar-header`, com conteúdo curto ou extenso
- **THEN** footer não sobrepõe Main nem Sidebar e permanece alcançável depois da região principal, com rolagem correta e sem overflow horizontal acidental

#### Scenario: Tokens e acessibilidade

- **WHEN** o consumidor muda temas claro/escuro ou customiza os tokens do footer
- **THEN** fundo, texto e borda seguem tokens CSS públicos sem criar novo landmark main nem introduzir controle focável vazio

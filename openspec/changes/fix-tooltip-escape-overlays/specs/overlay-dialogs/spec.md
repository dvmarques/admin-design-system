## ADDED Requirements

### Requirement: Drawer mantém o contrato modal nos dois posicionamentos

`AdsDrawer` MUST oferecer, à esquerda e à direita, a mesma semântica modal do diálogo: papel de diálogo com `aria-modal`, nome acessível, foco preso, fechamento por Escape quando habilitado e retorno do foco ao elemento que o abriu.

#### Scenario: Drawer à esquerda e à direita

- **WHEN** um drawer é aberto com posicionamento à esquerda ou à direita
- **THEN** ele expõe `role="dialog"` com `aria-modal="true"` e nome acessível, e o foco entra no seu conteúdo

#### Scenario: Escape e retorno de foco no drawer

- **WHEN** um drawer aberto recebe um Escape e permite esse fechamento
- **THEN** a aplicação recebe a solicitação de fechamento e, ao fechar, o foco volta ao elemento que o abriu

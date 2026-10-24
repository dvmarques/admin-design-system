## ADDED Requirements

### Requirement: Controle de preferência de tema reutilizável

O sistema MUST oferecer um controle público de preferência de tema com as opções Claro, Escuro e Sistema (`AdsThemeControl`) que emite a preferência escolhida, sem impor persistência, provider ou aplicação do tema; a aplicação consumidora MUST resolver `system` e aplicar o tema efetivo pelo contrato público do elemento raiz.

#### Scenario: Aplicação resolve Sistema

- **WHEN** a aplicação recebe `system` do controle
- **THEN** ela pode aplicar `light` ou `dark` ao elemento raiz conforme `prefers-color-scheme`, sem alterar os tokens

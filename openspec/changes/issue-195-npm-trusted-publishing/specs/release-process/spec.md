## ADDED Requirements

### Requirement: Registro npm confirmado antes de finalizar a release

A publicação de tag e GitHub Release MUST depender da confirmação dos quatro pacotes públicos no registro npm, com mesma versão coordenada e integridade dos tarballs validados no commit exato da release aprovada.

#### Scenario: Os quatro pacotes foram confirmados no npm

- **WHEN** todos os pacotes aprovados da versão X.Y.Z estiverem registrados com hashes iguais aos dos tarballs validados
- **THEN** o job de tag/GitHub Release MAY ser executado
- **AND** a tag MUST apontar para o merge commit de release em master, independentemente do HEAD atual

#### Scenario: Publicação npm incompleta ou divergente

- **WHEN** um pacote estiver ausente ou apresentar hash distinto dos tarballs aprovados
- **THEN** o job de tag/GitHub Release MUST NOT executar
- **AND** nenhuma tag existente MAY ser substituída ou movida

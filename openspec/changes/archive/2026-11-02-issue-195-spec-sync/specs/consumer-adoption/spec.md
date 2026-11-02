# Spec Delta

## MODIFIED Requirements

### Requirement: Informação correta antes e depois da publicação

A documentação MUST distinguir pacotes preparados e validados por tarballs da disponibilidade efetiva no registry. Para cada pacote com versão publicada e verificada, MUST apresentar comandos de instalação npm remota aplicáveis sem avisos de pré-publicação. Antes da primeira publicação verificada de um pacote, MUST NOT apresentar instalação npm remota como disponível ou já testada.

#### Scenario: Leitor consulta a documentação de pacotes publicados

- **WHEN** o leitor consulta os guias de um pacote com versão publicada e verificada
- **THEN** encontra comandos de instalação npm aplicáveis e não vê avisos de indisponibilidade pré-publicação

#### Scenario: Leitor consulta a documentação de pacote ainda não publicado

- **WHEN** o leitor consulta os guias de um pacote sem publicação verificada
- **THEN** entende que a instalação remota ainda não está disponível ou validada

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

### Requirement: Revisão editorial aprovada do changelog antes de fechar a versão

O processo MUST disponibilizar uma prévia não destrutiva para consolidar entradas repetidas ou longas da versão em andamento e MUST exigir confirmação humana vinculada ao conteúdo antes de executar `release:prepare`.

#### Scenario: Prévia não altera o histórico

- **WHEN** a prévia editorial for gerada para X.Y.Z
- **THEN** o processo MUST listar potenciais duplicidades e tópicos extensos da seção Em andamento
- **AND** MUST NOT editar o changelog nem qualquer release fechada automaticamente

#### Scenario: Aprovação humana do resumo

- **WHEN** o mantenedor revisar e aprovar explicitamente o conteúdo consolidado na branch `release/X.Y.Z`
- **THEN** o processo MUST registrar a confirmação de aprovação vinculada ao hash do conteúdo dessa seção
- **AND** MUST preservar referências às issues e avisos importantes de compatibilidade

#### Scenario: Texto alterado depois de aprovado

- **WHEN** a seção em andamento for alterada após a aprovação
- **THEN** o preparo da release MUST falhar antes de escrever arquivos
- **AND** a release MUST exigir nova revisão/aprovação do conteúdo atualizado

#### Scenario: Duplicidade ou texto excessivamente extenso

- **WHEN** entradas de alteração repetirem a mesma issue principal ou excederem o limite editorial definido
- **THEN** a aprovação MUST falhar, apresentando os itens a revisar
- **AND** MUST NOT apagar ou unir automaticamente conteúdo que precise de interpretação humana

#### Scenario: Validação da seção fechada e notas públicas

- **WHEN** a release X.Y.Z já estiver preparada
- **THEN** a CI MUST exigir a aprovação válida na seção fechada exata da versão
- **AND** as notas públicas MUST omitir somente a marca interna de aprovação
- **AND** as versões fechadas anteriores MUST permanecer preservadas sem migração retroativa

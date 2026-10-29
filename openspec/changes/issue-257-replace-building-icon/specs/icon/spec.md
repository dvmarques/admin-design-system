## MODIFIED Requirements

### Requirement: Ícones de conta, notificações e seleção

`AdsIconName` MUST incluir `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings` e `user`, decorativos por padrão e informativos quando `label` for informado, sem alterar os identificadores existentes.

#### Scenario: Ícone decorativo

- **WHEN** `AdsIcon` renderiza `bell` sem `label`
- **THEN** o SVG é ocultado de tecnologias assistivas

#### Scenario: Compatibilidade pública

- **WHEN** uma aplicação renderiza qualquer dos 20 nomes públicos nos tamanhos suportados
- **THEN** o mesmo nome e contrato de propriedades continua disponível
- **AND** o SVG herda a cor do componente e preserva a semântica acessível

#### Scenario: SVG regularizado

- **WHEN** uma aplicação renderiza o nome público `building`
- **THEN** os quatro paths correspondem ao `Building06Icon` do pacote Hugeicons Free MIT, com medidas e espessura originais

## ADDED Requirements

### Requirement: Proveniência verificável dos desenhos externos

Os 20 desenhos SVG incorporados MUST ter arquivo de origem oficialmente identificado sob licença MIT ou ISC, mapeado por nome público, com copyrights e avisos integrais preservados.

#### Scenario: Auditoria da fonte

- **WHEN** o mantenedor consulta o nome público de qualquer ícone
- **THEN** a documentação fornece link para o arquivo oficial e identifica a licença correspondente
- **AND** o histórico dos traçados substituídos não é apresentado como autoria própria comprovada

### Requirement: Avisos de licença acompanham o pacote distribuído

O build de `@admin-ds/components` MUST publicar as licenças e atribuições relevantes junto dos componentes.

#### Scenario: Artefato de distribuição completo

- **WHEN** `@admin-ds/components` termina o build
- **THEN** `dist/LICENSE.md` e `dist/THIRD_PARTY_NOTICES.md` contêm cópias exatas dos arquivos oficiais do repositório
- **AND** a validação de pacote rejeita cópias ausentes ou divergentes

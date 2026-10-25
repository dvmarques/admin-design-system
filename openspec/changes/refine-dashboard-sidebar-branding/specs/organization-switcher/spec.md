## ADDED Requirements

### Requirement: Organização permite escolher o tom de seu avatar

AdsOrganization MUST aceitar avatarTone opcional, com os tons públicos de AdsAvatar, aplicado no gatilho e na opção correspondente. Sem configuração, MUST preservar neutral e os comportamentos de imagem e fallback.

#### Scenario: Tom informado e seleção alterada

- **WHEN** o consumidor fornece avatarTone e seleciona uma organização
- **THEN** gatilho e lista usam o tom informado, com logo ou fallback de iniciais, nos dois temas

#### Scenario: Consumidor anterior

- **WHEN** avatarTone não é fornecido
- **THEN** a aparência anterior e o contrato de seleção permanecem inalterados

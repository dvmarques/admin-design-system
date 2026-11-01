## ADDED Requirements

### Requirement: Organização permite escolher o tom de seu avatar

AdsOrganization MUST aceitar avatarTone opcional, com os tons públicos de AdsAvatar, aplicado no gatilho e na opção correspondente. Sem configuração, MUST preservar neutral e os comportamentos de imagem e fallback.

#### Scenario: Tom informado e seleção alterada

- **WHEN** o consumidor fornece avatarTone e seleciona uma organização
- **THEN** gatilho e lista usam o tom informado, com logo ou fallback de iniciais, nos dois temas

#### Scenario: Consumidor anterior

- **WHEN** avatarTone não é fornecido
- **THEN** a aparência anterior e o contrato de seleção permanecem inalterados

### Requirement: Seletor expandido conserva largura independente do nome

O seletor de organização expandido MUST ocupar a largura disponível no contêiner e manter seu tamanho ao trocar entre nomes curtos e longos. No modo recolhido, a borda MUST ficar invisível sem mudar posição, dimensões e área de foco do gatilho.

#### Scenario: Nome curto e nome longo

- **WHEN** a organização selecionada muda para um nome menor ou maior
- **THEN** a borda do gatilho expandido mantém a mesma largura, respeitando o contêiner e truncando rótulos quando necessário

#### Scenario: Organização recolhida

- **WHEN** a sidebar está recolhida
- **THEN** o avatar permanece no mesmo lugar com borda externa transparente, nome acessível e foco visível; o expandido preserva sua borda

### Requirement: Seletor alinha sua caixa ao item ativo

Na composição sidebar-header expandida, o seletor de organização MUST ter a mesma largura e os mesmos limites laterais do destaque de um item raiz ativo da navegação, preservando a posição do avatar e dos rótulos.

#### Scenario: Sidebar com scrollbar

- **WHEN** a largura útil muda por scrollbar ou troca de viewport
- **THEN** a caixa do seletor e o destaque raiz permanecem alinhados, independentemente do tamanho do nome

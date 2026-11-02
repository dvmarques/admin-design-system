## MODIFIED Requirements

### Requirement: Notas derivadas do changelog

As notas da GitHub Release MUST vir somente da seção fechada da versão correspondente no `CHANGELOG.md` do commit liberado e MUST excluir o marcador editorial interno de aprovação.

#### Scenario: Extrair notas

- **WHEN** a release `X.Y.Z` for publicada ou recuperada
- **THEN** o corpo MUST conter apenas o conteúdo pertencente à seção fechada `X.Y.Z` daquele commit
- **AND** MUST omitir o marcador HTML interno de aprovação editorial

#### Scenario: Comparar notas de uma release existente

- **WHEN** o processo comparar notas de uma GitHub Release existente com o changelog aprovado
- **THEN** MUST usar as mesmas notas públicas normalizadas usadas para calcular a evidência read-only
- **AND** o marcador editorial interno MUST NOT causar divergência nem aparecer no corpo publicado

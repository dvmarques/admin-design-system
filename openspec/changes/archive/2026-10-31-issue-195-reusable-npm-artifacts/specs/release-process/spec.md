## ADDED Requirements

### Requirement: Tarballs preparados uma vez e reutilizados por identidade

O processo MUST separar preparação sem publicação do consumo dos tarballs e MUST vincular o conjunto validado à versão, merge commit aprovado e execução confiável que o produziu.

#### Scenario: Preparar sem publicar

- **WHEN** o mantenedor solicitar a preparação de uma release integrada
- **THEN** o processo MUST construir e testar os quatro tarballs em aplicação Next.js externa, gerar hashes SHA-256/SHA-512 e armazenar o conjunto como artifact imutável identificado por ID
- **AND** MUST NOT possuir permissões de publicação npm ou escrita de tags/releases

#### Scenario: Consumir conjunto validado

- **WHEN** a publicação receber o ID do artifact
- **THEN** MUST verificar origem no workflow de preparação manual de develop do mesmo repositório, conclusão bem-sucedida, versão, commit, execução, tentativa, digest, manifests, dependências e hashes
- **AND** MUST reutilizar os mesmos bytes sem reconstruir pacotes

#### Scenario: Origem não autorizada ou artifact alterado

- **WHEN** o artifact vier de PR, fork, outra branch, execução inválida ou apresentar digest, identidade ou conteúdo divergente
- **THEN** a publicação MUST falhar antes de qualquer escrita no npm

#### Scenario: Reexecução e publicação parcial

- **WHEN** alguns pacotes já estiverem publicados
- **THEN** o processo MUST reutilizar o mesmo artifact e confirmar identidade exata de todas as versões existentes antes de publicar somente as ausentes
- **AND** divergência MUST bloquear todas as escritas

#### Scenario: Artifact ausente ou expirado

- **WHEN** o conjunto selecionado não estiver mais disponível ou estiver expirado
- **THEN** o processo MUST interromper sem reconstrução automática nem republicação de versões existentes
- **AND** a documentação MUST explicar retenção limitada, interrupção segura e decisões de recuperação sem exigir backup pessoal permanente

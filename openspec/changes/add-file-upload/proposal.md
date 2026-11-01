# Proposal

## Why

A issue #232 pede seleção e validação de arquivos reutilizáveis, acessíveis e desacopladas de serviços de upload. Uma composição pontual de `AdsInput` e `AdsButton` funciona para uma página, mas repetiria validação de MIME/extensão/tamanho, re-seleção e mensagens acessíveis nos consumidores. O controle nativo `type=file` deve continuar responsável pelo seletor.

Perfil do fluxo adaptativo: **Critical**, pois adiciona API pública, CSS distribuído e consumo por aplicações React/Next.js.

## What Changes

**Biblioteca reutilizável (`packages/components`)**
- Novo `AdsFileUpload` e tipos públicos `AdsFileUploadProps`, `AdsFileRejection` e `AdsFileChangeReason`.
- Seleção nativa por botão, controle por `files` ou `defaultFiles`, remoção e limpeza, múltiplos arquivos opcionais e limites configuráveis de quantidade/tamanho/tipo.
- Estados de erro, vazio, selecionado, desabilitado e envio em andamento; rótulos e alertas acessíveis; nenhuma chamada HTTP.

**Consumidores (`apps/admin-demo`, `apps/docs`)**
- Importação de arquivo fictício com `AdsDialog` + `AdsButton`, sem backend, em uma rota própria da Demo.
- Storybook e testes de uso e acessibilidade; documentação e CHANGELOG.

## Objetivos e fora do escopo

Objetivos: reduzir duplicação, manter a validação local observável e oferecer integração neutra para React/Next.js. `AdsDialog` é apenas composição da aplicação.

Fora do escopo: parser CSV/JSON na biblioteca, autenticação, envio HTTP, validação de segurança do servidor, regras de negócio, drag-and-drop (opcional e adiado para reduzir superfície de acessibilidade).

## Capabilities

### New Capabilities
- `file-upload`: seleção, validação e feedback de arquivos.

### Modified Capabilities
- Nenhuma alteração em contratos preexistentes.

## Impact

- `@dvmarques/admin-ds-components`: novo export e CSS via classes estáticas do Tailwind interno; API antiga preservada.
- `apps/admin-demo` e `apps/docs`: novos exemplos; sem novos pacotes ou peers.
- Consumidores: componente `'use client'`; Server Components podem importá-lo por fronteira de cliente; responsabilidade de validar novamente no servidor permanece do consumidor.
- Rollback: remover os novos exports e exemplos sem migração de componentes existentes.

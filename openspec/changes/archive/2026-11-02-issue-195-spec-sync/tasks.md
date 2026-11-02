# Tasks

## 1. Spec de disponibilidade npm

- [x] 1.1 Atualizar o delta `consumer-adoption` para descrever pacotes publicados e não publicados; verificar a presença dos dois cenários no delta.
- [x] 1.2 Aplicar o delta à spec principal, preservando os demais requisitos e validar com `openspec.cmd validate --all --strict`.
- [x] 1.3 Formatar os artefatos alterados e verificar `npm run format` e `git diff --check`.

## Evidências

- `openspec.cmd validate --all --strict`: passou, 66/66 specs.
- `npm run format`: passou; todos os arquivos correspondem ao estilo Prettier.
- `git diff --check`: passou sem erros.

# Tarefas

## 1. Implementação

- [x] 1.1 Adicionar MCPs e revisores no formato nativo Codex sem escolhas pessoais.
- [x] 1.2 Implementar hooks de proteção/formatação com leitura de patches, caminhos portáveis e mensagens de erro.
- [x] 1.3 Cobrir o contrato com testes Node e integrá-los ao gate de qualidade.
- [x] 1.4 Atualizar orientações e changelog; documentar confiança e limites.

## 2. Validação e entrega

- [x] 2.1 Formatar arquivos alterados com Prettier; executar `npm run format`, lint, tipos, build, test:quality e OpenSpec estrito.
- [x] 2.2 Verificar os comandos de hooks em worktree/subdiretório e caminhos com espaços; validar TOML localmente e registrar o que depende de confiança em nova sessão.
- [x] 2.3 Atualizar a PR e confirmar CI Linux, incluindo E2E e snapshots, sem alterar baselines. Usar a evidência Windows anterior quando aplicável e documentar a limitação.

## 3. Guia unificado

- [x] 3.1 Unificar o guia de Codex, Claude Code e Cursor e atualizar todos os links, preservando as diferenças reais das configurações.
- [x] 3.2 Conferir fontes e links locais, formatação, sincronia de skills e OpenSpec estrito; publicar o incremento documental na PR existente.

## 4. Revisão Claude antes da integração

- [x] 4.1 Reproduzir e corrigir bootstrap, worktree por alias, casing Windows e resolução de symlinks relativos; esclarecer limites de tool_response.
- [x] 4.2 Reexecutar testes e solicitar nova conferência do Claude antes de arquivar.

- [ ] 4.3 Confirmar CI Linux das correções, incluindo o teste de symlink relativo, antes de arquivar.

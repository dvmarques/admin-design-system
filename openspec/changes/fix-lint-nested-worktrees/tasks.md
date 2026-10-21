## 1. Especificação

- [x] 1.1 Criar proposta, design e requisitos; revisar escopo e critérios contra #128.
- [x] 1.2 Validar a change em modo estrito antes da implementação.

## 2. Implementação

- [x] 2.1 Criar teste de regressão e confirmar falha na configuração anterior.
- [x] 2.2 Ignorar worktrees e fixar a raiz TypeScript na localização da configuração.
- [x] 2.3 Integrar regressão à qualidade da CI e atualizar documentação/changelog.

## 3. Revisão e validação

- [x] 3.1 Revisar diff, preservação dos worktrees e cobertura do checkout principal.
- [x] 3.2 Executar formatação, lint, build, tipos, testes de qualidade e E2E sem alterar snapshots.
- [x] 3.3 Validar todas as changes e specs em modo estrito.
- [x] 3.4 Revisar evidências locais e preparar descrição da PR para develop e acompanhamento da CI.

## Evidências de validação

- Regressão reproduzida na configuração anterior e corrigida; arquivos aninhados preservados.
- Formatação, lint, build, tipos e testes de qualidade aprovados (690 testes Vitest após sincronização com develop).
- E2E Chromium aprovado na CI, incluindo snapshots sem atualização.
- Firefox/WebKit: aprovados na CI; execução local bloqueada por bibliotecas do sistema ausentes.
- OpenSpec aprovado em modo estrito pela CI.
- Revisão geral adicional: fixture usa a configuração real no worktree; lint próprio do worktree e preservação de seus arquivos verificados.
- Revisão final: nenhuma alteração de API, componente, estilo ou snapshot; issue #91 preservada.

## 1. Refinamento e baseline

- [x] 1.1 Inspecionar os workflows CI/Pages/Security e comandos de testes, com links e tempos de duas execuções reais.
- [x] 1.2 Escrever e revisar proposta, riscos e spec com check agregador fail-closed, ambiente de smoke e regras de cobertura.
- [x] 1.3 Validar change em modo estrito no CLI OpenSpec.
- [x] 1.4 Ampliar baseline para no mínimo três PRs funcionais comparáveis e registrar tempo ponta a ponta, jobs, minutos de runners e limitações.

## 2. Chromium e checks obrigatórios

- [x] 2.1 Dividir suíte completa Chromium em duas partições sem omitir testes ou snapshots.
- [x] 2.2 Preservar os checks Firefox, WebKit e `Fluxos no navegador` por agregação fail-closed.
- [ ] 2.3 Verificar Draft, docs-only, Ready, sync, cancelamento, falha de um shard e push/release.
- [x] 2.4 Comparar dois shards com dois workers sem shard e registrar tempos/overhead.

## 3. Qualidade, distribuição e npm

- [x] 3.1 Eliminar duplicação de suites `test:ci` e Vitest na CI sem alterar `test:quality` local.
- [x] 3.2 Manter coberturas Node/Vitest e validar conteúdo dos artefatos.
- [x] 3.3 Avaliar relocação do smoke de tarballs com browser real; só alterar se ambiente equivalente for comprovado.
- [x] 3.4 Avaliar flags/cache/npm audit sob cache quente e frio sem enfraquecer Segurança.

## 4. Pages, testes e documentação

- [x] 4.1 Avaliar escopo seguro de Pages e cancelamento de PR obsoleta sem cancelar push de publicação.
- [x] 4.2 Atualizar testes estáticos do workflow para os novos invariantes e casos de falha.
- [x] 4.3 Atualizar guias de CI/Playwright e CHANGELOG quando implementação mudar comportamento.

## 5. Integração e medição

- [x] 5.1 Executar format, lint, typecheck, build, quality, test:e2e, test:e2e:pages e OpenSpec estrito; conferir logs GitHub dos 3 browsers, Pages e Security.
- [x] 5.2 Revisar e ajustar código e spec após validação, corrigindo regressões.
- [x] 5.3 Abrir PR, mover de Draft para Ready for Review e acompanhar todas as execuções de CI.
- [ ] 5.4 Reexecutar `npm run format` e revisar o diff final (última tarefa antes da integração).

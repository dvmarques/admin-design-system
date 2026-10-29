## 1. Rastreabilidade e planejamento

- [x] 1.1 Conferir as fontes oficiais dos 20 desenhos SVG e suas licenças permissivas MIT/ISC.
- [x] 1.2 Registrar na issue #257 a aprovação da troca dos 20 traçados sem alteração da API.
- [x] 1.3 Atualizar proposal/design/specs da change para o escopo de 20 ícones.

## 2. Implementação e atribuições

- [x] 2.1 Substituir `building` pelos quatro paths oficiais de Hugeicons Free MIT.
- [x] 2.2 Substituir 18 ícones por geometria Feather MIT e `chevronsUpDown` por Lucide ISC.
- [x] 2.3 Registrar links oficiais individuais no inventário `docs/icons-license-audit.md`, com ressalva de autoria histórica.
- [x] 2.4 Preservar avisos integrais e copyrights Feather, Lucide e Hugeicons em `THIRD_PARTY_NOTICES.md`.
- [x] 2.5 Atualizar `docs/licensing.md` e Storybook com catálogo visual.
- [x] 2.6 Incluir os arquivos `LICENSE.md` e `THIRD_PARTY_NOTICES.md` no `dist` distribuído, verificando seu conteúdo.
- [x] 2.7 Ampliar testes de geometria, largura de traço, tipagem e acessibilidade para os 20 nomes.
- [x] 2.8 Atualizar `CHANGELOG.md` incluindo toda a migração e a publicação dos avisos.
- [x] 2.9 Separar paths, tipos, componente e exports em `src/icons/`, mantendo `src/icon.tsx` como shim de compatibilidade e sem adicionar pacote.
- [x] 2.10 Criar testes de contrato para exports públicos, 20 nomes e renderização pela arquitetura modular.
- [x] 2.11 Documentar a arquitetura e atualizar o changelog para futura extração opcional.

## 3. Validação e conclusão

- [x] 3.1 Verificar mecanicamente cada SVG transcrito contra os 20 arquivos originais (shape, atributo, ordem, largura de traço); conferidos os 19 Feather/Lucide e os quatro paths Hugeicons.
- [ ] 3.2 Executar build, verificador de pacote, testes, lint, tipos, `npm run format`, `npm run validate` e `npm run test:e2e`; registrar resultados reais.
- [ ] 3.3 Conferir Storybook/demo, temas claro/escuro e todos os tamanhos; atualizar snapshots somente quando intencionalmente revisados.
- [x] 3.4 Medir os orçamentos de distribuição/browser e só ajustá-los com evidências. CI #40957590062 aprovou cinco ajustes medidos após sincronizar com #254; evidências em docs/bundle-baseline.md.
- [ ] 3.5 Executar `openspec validate --all --strict` e revisar diff final/CI. Não fazer merge ou archive sem os gates previstos.

# Design — documentação consumidora da #198

## Contexto

Quatro workspaces independentes foram preparados pela #194: tokens, components, admin (peer de components) e highlighted-code com Shiki sob demanda. Não houve publicação npm. O Storybook já gera referência técnica (#193); a documentação introdutória não deve duplicar 78 fichas. A aplicação de demonstração é exemplo, não serviço de autenticação ou implementação obrigatória.

## Decisões

1. **Documentação em camadas:** README de raiz curto, centrado em adoção; READMEs de pacote autossuficientes para o registry; `docs/integration.md` como receita detalhada; Storybook como referência de props; `docs/development.md` para instalação e execução locais, com `CONTRIBUTING.md` e `docs/release-process.md` como políticas e processo de publicação.
2. **Pré-publicação honesta:** apresentar comandos `npm install` como instruções aplicáveis **após** a #195, não como instalações já executadas; referência aos testes externos realizados por tarballs na #194. A documentação não escolhe número de release.
3. **Progressão por necessidade:** tokens isolados; tokens+components para UI; acrescentar admin somente para composições; highlighted-code e `react-imask` como opt-in sem dependência forçada dos consumidores básicos.
4. **Next.js App Router:** CSS global no `app/layout.tsx` na ordem tokens, components, admin/opcional quando pertinente. Componente interativo em arquivo `'use client'`; tema em `data-theme`, preferência Sistema e persistência gerida pelo consumidor. Fontes carregadas pela aplicação, sem fontes embutidas.
5. **Compatibilidade:** documentar faixas reais de peers nos manifests, não confundir Node de desenvolvimento com requisito runtime da aplicação. Evitar exemplo com APIs inexistentes ou `src/`, aliases internos, varredura Tailwind.
6. **Primeira adoção e rastreabilidade:** ainda não existem consumidores de uma versão pública anterior; remover o guia de migração, expor diretamente os nomes/subpaths atuais e apresentar `ThemeToggle` binário e `AdsThemeControl` com Sistema como opções de tema. Histórico por componente referencia issues e `CHANGELOG.md`, sem inventar releases.
7. **Sem alteração executável:** o catálogo deve refletir `getAdsSmartTableCsv` como exclusão já presente no teste. Revisar limites de acessibilidade manual, CSS e autenticação ilustrativa.
8. **Links para npm:** links absolutos nos READMEs dos quatro pacotes, inclusive quando os arquivos forem exibidos fora do monorepo; root/docs podem usar links relativos internos.
9. **Identidade e desenvolvimento:** manter `<picture>` e os logos claro/escuro do README original. Deslocar requisitos locais, `npm ci`, build, Demo, Storybook, testes, OpenSpec, CI e troubleshooting para `docs/development.md`, sem duplicar as políticas de `AGENTS.md`.

## Alternativas e trade-offs

Um README de raiz com tutorial longo repetiria docs e ficaria difícil de manter: preferir exemplo mínimo e links para guias. Exigir todos os quatro pacotes simplifica o comando, mas cria dependências desnecessárias e invalida o caráter opcional do Shiki. Dizer que o npm já funciona seria prematuro, pois a #195 não executou a publicação. Exemplos de consumo por tarball são úteis, mas não devem reinventar smoke/infra da #194.

## Acessibilidade, UI, CSS, bundles e compatibilidade

Esta change não altera rendering, CSS, temas, tokens, estilos, acessibilidade, runtime ou dependências, portanto não cria novos bundles nem snapshots. Os guias indicam limites e o Storybook demonstra componentes já validados; evidência automatizada não substitui teste manual com leitor de tela e dispositivos. Reverter a change é revertê-la documentalmente, sem migração de dados nem alterações de artefatos.

## Verificação

Conferir nomes/exports/peers nos manifests, snippets, CSS, logo, instruções locais, links e exclusões do catálogo no código. Executar `npm run format`, `npm run validate` (incluindo E2E) e `openspec.cmd validate --all --strict` em ambiente correto; se execução local indisponível, deixar registro explícito e observar CI da PR Ready. Não confundir skips de CI docs_only com execução da suíte integral.

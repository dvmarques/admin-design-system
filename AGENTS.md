# Orientações de desenvolvimento

## Visão geral

O `admin-design-system` é um monorepo de design system React reutilizável para
aplicações administrativas baseadas em Next.js App Router.

O repositório contém bibliotecas distribuíveis, uma aplicação Next.js de
referência e um catálogo Storybook. O desenvolvimento é orientado por
especificações com OpenSpec.

## Estrutura e responsabilidades

- `packages/tokens`: fonte, geração e distribuição dos design tokens e temas.
- `packages/components`: componentes React reutilizáveis e seus estilos.
- `packages/admin`: composições de layout administrativo sem regras de negócio.
- `apps/admin-demo`: aplicação Next.js que valida o consumo público dos pacotes.
- `apps/docs`: catálogo Storybook e documentação visual dos componentes.
- `e2e`: testes end-to-end e validações visuais no navegador.
- `openspec`: especificações, propostas, tarefas e histórico de changes.

Não implemente regras de negócio, dependência direta do roteamento do Next.js
ou imports de caminhos internos dos pacotes em componentes reutilizáveis.

## Contratos públicos

- Consumidores devem importar apenas caminhos declarados em `exports` dos pacotes.
- Componentes e tipos públicos usam o prefixo `Ads`.
- Classes CSS públicas usam o prefixo `ads-`.
- Variáveis CSS públicas usam o prefixo `--ads-`.
- O Tailwind CSS é uma ferramenta interna; a API pública não deve expor seus
  detalhes nem exigir que aplicações consumidoras o configurem.
- O CSS compilado deve continuar utilizável por aplicações consumidoras.
- Mudanças em APIs públicas devem considerar compatibilidade retroativa.

## Identidade visual

A identidade atual é definida pelos tokens, por `docs/visual-identity.md`,
`docs/visual-polish.md` e pelo catálogo Storybook. Preserve a Inter, a escala
de marca, os temas, a densidade e os componentes existentes. Use as APIs
públicas `Ads*` e os tokens semânticos ao compor interfaces.

As skills de design são orientações auxiliares para este projeto. Elas não
autorizam trocar fontes, importar outro design system, adicionar dependências
ou redesenhar interfaces por preferência estética. Mudanças na identidade
precisam fazer parte do escopo solicitado e seguir o processo OpenSpec.

## Leitura de contexto por demanda

Após ler as regras obrigatórias deste arquivo, use `docs/agent-context-map.md` para identificar o escopo e os documentos necessários. Evite carregar referências não relacionadas à tarefa; em mudanças transversais, inclua os consumidores afetados. Nenhuma otimização de contexto dispensa regras, verificações ou gates obrigatórios.

Para orquestrar uma issue até a revisão da PR, invoque a skill própria `adaptive-ai-workflow` e consulte `docs/ai-development-workflow.md`. Os perfis Fast, Standard e Critical ajustam a profundidade de planejamento, **nunca** dispensam as validações e políticas obrigatórias.

## Antes de alterar arquivos

1. Consulte `README.md` e `openspec/config.yaml` para o processo aplicável; use `docs/agent-context-map.md` para selecionar documentação adicional do escopo.
2. Verifique as changes ativas com `openspec.cmd list`.
3. Para mudanças relevantes de comportamento, API, tokens, estilos ou arquitetura,
   crie ou atualize uma change em `openspec/changes/<change-id>` antes da implementação.
4. Preserve mudanças locais não relacionadas.
5. Para toda mudança relevante ao produto, fluxo de desenvolvimento ou documentação, registre uma entrada em `CHANGELOG.md`, na versão `[0.1.1] - Em andamento`, sob `Added`, `Changed` ou `Fixed` conforme o caso. Identifique a change OpenSpec ou issue e descreva objetivamente o efeito. Não omita o registro por otimização de contexto; se não houver mudança registrável, justifique explicitamente na PR.
6. Use uma branch de trabalho e submeta alterações por Pull Request conforme as
   políticas do repositório.

## Processo OpenSpec

As specs devem descrever comportamentos observáveis e estáveis. Escreva os
textos em português do Brasil e mantenha os marcadores estruturais
`Requirement`, `Scenario`, `WHEN` e `THEN` em inglês.

Cada change deve identificar pacotes e APIs públicas afetadas, separar o
trabalho da biblioteca reutilizável da demonstração nas aplicações e incluir
testes, documentação, acessibilidade e validação de integração.

Antes de concluir uma change, execute:

```powershell
openspec.cmd validate --all --strict
```

## Compatibilidade entre agentes

O repositório é usado com Claude Code, Cursor e Codex.

- `AGENTS.md` é a fonte única de instruções; `CLAUDE.md` apenas o importa.
- As skills do OpenSpec são geradas por `openspec.cmd update .` em `.agents/skills`,
  `.claude/skills` e `.cursor/skills`. Não as edite à mão.
- Skills próprias vivem em `.agents/skills` (lida por Codex e Cursor) e são listadas
  em `skills-lock.json`. Após alterá-las, execute `npm run sync:agent-skills` para
  copiá-las para `.claude/skills`; `npm run check:agent-skills` valida a sincronia.
  Usa-se cópia, não symlink, por causa do Windows.
- As três skills próprias de design são adaptações locais para a identidade
  do projeto. `skills-lock.json` preserva sua origem e os hashes de importação,
  não os hashes dos textos adaptados. Não sobrescreva as adaptações ao atualizar
  o conteúdo de origem; revise as diferenças e sincronize as cópias.
- Servidores MCP do projeto ficam em `.mcp.json` (Claude Code), `.cursor/mcp.json`
  (Cursor) e `.codex/config.toml` (Codex); mantenha servidores e versões alinhados.
  Credenciais, modelos e preferências pessoais permanecem fora do repositório.
- Claude Code configura hooks em `.claude/settings.json`/`.claude/hooks` e revisores em
  `.claude/agents`. O Codex usa `.codex/hooks.json`/`.codex/hooks` e revisores TOML em
  `.codex/agents`. Os formatos são nativos de cada ferramenta; não copie payloads
  de hooks entre elas. As skills compartilhadas permanecem em `.agents/skills`.
- Os hooks Codex protegem gerados e formatam arquivos de chamadas `apply_patch`;
  não interceptam escritas por shell. Revise e confie nos hooks pelo próprio Codex
  antes de depender deles. Consulte `docs/agent-setup.md` para ativação e limites.
- Mantenha o texto das skills neutro: diga "invoque a skill X" em vez de `/X` ou `$X`.

## Releases

O procedimento operacional de releases está em `docs/release-process.md`.
Agentes devem seguir esse documento em vez de inferir o fluxo a partir do
histórico Git. Em especial:

- mudanças funcionais entram primeiro em `develop`, nunca apenas em `release/X.Y.Z`;
- PRs em Draft não executam a CI automática de Pull Request; a validação completa
  acontece ao marcar Ready for review;
- `release:prepare` exige npm `11.19.1`, branch `release/X.Y.Z` e working tree limpa;
- a publicação só ocorre após o back-merge da mesma release para `develop`;
- toda PR de release — `release/X.Y.Z -> master` e o respectivo back-merge — usa o label `release`, tem como assignee quem estiver conduzindo o processo e é integrada com merge commit;
- PRs que não tiverem o label `release` e tenham `develop` como base são integradas por squash;
- PRs sem o label `release` e com base `develop` fecham a issue correspondente com uma palavra-chave de fechamento no corpo, como `Closes #123`; PRs de release não usam palavras-chave de fechamento;
- para relacionar uma PR a uma issue sem fechá-la, use o vínculo manual em Development;
- não mover, substituir ou recriar tags de release existentes.

## Implementação de componentes

- Priorize Server Components quando não houver interatividade; componentes de
  cliente devem declarar `"use client"`.
- Use composição em vez de APIs excessivamente configuráveis.
- Evite classes Tailwind construídas dinamicamente; use mapeamentos explícitos.
- Mantenha tokens separados dos componentes React.
- Todo componente público deve ter tipos, testes e story no Storybook.
- Componentes interativos devem oferecer navegação por teclado, foco visível,
  nome acessível e comportamento ARIA apropriado.
- Verifique temas claro e escuro, responsividade e estados relevantes:
  carregamento, desabilitado, erro e vazio, quando aplicável.
- Não introduza dependências de runtime sem necessidade justificada.

## Validação

Execute a validação proporcional à mudança. Para uma validação completa:

```powershell
npm run validate
```

Antes de abrir ou atualizar um PR, prefira a saída concisa dos comandos
oficiais. A sequência equivalente é `npm run format`, `npm run lint`,
`npm run build`, `npm run typecheck`, `npm run test:quality` e
`npm run test:e2e`. Para diagnosticar falhas, use `npm run test:verbose` ou
`npm run test:e2e:verbose`.

Os testes E2E devem usar contratos estáveis: priorize funções ARIA, nomes
acessíveis, identificadores semânticos e headings de seção estáveis, evitando
textos editoriais incidentais. Atualize snapshots apenas quando a mudança
visual for intencional e o diff tiver sido revisado; não os aceite apenas para
eliminar uma falha.

Para alterações de componentes ou estilos, valide também o consumo pelos apps:

```powershell
npm run build
npm run dev --workspace @admin-ds/docs
npm run dev --workspace @admin-ds/admin-demo
npm run test:e2e
```

O hook `pre-commit` (Husky + lint-staged, instalado por `npm install` via `prepare`)
executa `eslint --fix` e `prettier --write` nos arquivos staged. Ele não substitui
`npm run validate`, e a CI usa `npm ci --ignore-scripts`, então não o instala.

Antes da conclusão, formate os arquivos alterados e confirme:

```powershell
npx.cmd prettier --write <arquivos-alterados>
npm run format
```

Relate os comandos executados e qualquer validação que não pôde ser realizada.

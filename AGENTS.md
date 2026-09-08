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

## Antes de alterar arquivos

1. Leia `README.md`, `openspec/config.yaml` e a documentação relevante em `docs/`.
2. Verifique as changes ativas com `openspec.cmd list`.
3. Para mudanças relevantes de comportamento, API, tokens, estilos ou arquitetura,
   crie ou atualize uma change em `openspec/changes/<change-id>` antes da implementação.
4. Preserve mudanças locais não relacionadas.
5. Use uma branch de trabalho e submeta alterações por Pull Request conforme as
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
- para relacionar uma PR a uma issue sem fechá-la, use o vínculo manual em Development e não use palavras-chave de fechamento, como `Closes #123`;
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
`npm run typecheck`, `npm run test:quiet`, `npm run build` e
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

Antes da conclusão, formate os arquivos alterados e confirme:

```powershell
npx.cmd prettier --write <arquivos-alterados>
npm run format
```

Relate os comandos executados e qualquer validação que não pôde ser realizada.

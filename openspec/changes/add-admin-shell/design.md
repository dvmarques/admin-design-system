# Design — add-admin-shell

## Visão geral

O Admin Shell será uma composição estrutural do design system, responsável por organizar regiões administrativas recorrentes sem assumir regras de negócio, autenticação ou roteamento da aplicação consumidora.

A API privilegia composição React e mantém as regiões semanticamente separadas para que consumidores forneçam marca, navegação, ações e conteúdo utilizando somente APIs públicas.

## Estrutura proposta

O shell é composto por três regiões principais:

1. **Header** — região superior para identidade, contexto e ações globais.
2. **Sidebar** — navegação primária administrativa, persistente em viewport ampla e acionável em viewport reduzida.
3. **Main** — conteúdo principal da página, com dimensionamento e espaçamento coerentes com os tokens do design system.

A implementação deve permitir composição de conteúdo pelo consumidor em vez de codificar menus ou ações específicos.

## API pública e limites entre pacotes

Componentes React e tipos públicos introduzidos por esta change usarão o prefixo `Ads`. Classes CSS públicas usarão `ads-` e novas variáveis públicas, quando necessárias, usarão `--ads-`.

Os elementos necessários ao shell serão exportados pelas entradas públicas do pacote de componentes. Tokens permanecem separados dos componentes React e nenhuma API pública deverá expor classes Tailwind internas.

O admin demo e o Storybook devem consumir as mesmas entradas públicas disponibilizadas a aplicações externas.

## Server Components e Client Components

A estrutura estática do shell deve permanecer compatível com React Server Components sempre que não houver necessidade de estado ou efeitos no cliente.

A interação da sidebar responsiva exige estado no cliente. Essa responsabilidade deve ficar isolada no menor limite Client Component possível, evitando transformar regiões puramente estruturais ou conteúdo fornecido pelo consumidor em Client Components sem necessidade.

A API não dependerá diretamente de Next.js, `next/link`, `useRouter` ou App Router. A aplicação consumidora continua responsável por links e roteamento.

## Responsividade

Em telas amplas, sidebar e conteúdo coexistem. Em telas menores, a navegação lateral deixa de ocupar espaço permanente e passa a ser acessível por um controle explícito no header ou região equivalente.

O estado de abertura da navegação responsiva deve possuir comportamento previsível e acessível, incluindo foco, teclado e atributos ARIA adequados quando aplicável.

Os breakpoints existentes do projeto devem ser reutilizados; novos contratos públicos de breakpoint só devem ser introduzidos se o levantamento demonstrar necessidade.

## Acessibilidade

- utilizar landmarks semânticos adequados (`header`, `nav`, `main` quando compatíveis com a composição);
- permitir identificação acessível da navegação;
- garantir operação por teclado do controle responsivo;
- manter ordem de foco coerente;
- evitar que conteúdo oculto da sidebar permaneça interativo;
- preservar contraste e estados de foco dos componentes existentes;
- buscar conformidade WCAG 2.2 AA.

## Tailwind CSS, tokens e distribuição de estilos

Tailwind CSS será utilizado somente como ferramenta interna de implementação. As classes devem consumir variáveis CSS semânticas existentes e evitar concatenação dinâmica de utilitários.

A customização pública ocorrerá por tokens `--ads-*`; aplicações consumidoras não precisarão escanear o código-fonte da biblioteca, utilizar Tailwind ou recompilar os componentes para personalizar valores suportados.

Os estilos do shell serão incorporados à folha CSS compilada já distribuída pela biblioteca e validados no admin demo Next.js. O build deve continuar removendo classes Tailwind não utilizadas sem remover estilos necessários ao shell.

## Isolamento e conflitos de CSS

Classes públicas específicas do shell devem seguir o prefixo `ads-`. A implementação não deve depender de seletores globais genéricos que possam alterar elementos da aplicação consumidora.

A personalização segura continuará disponível via `className` onde a API do componente permitir, sem expor detalhes internos do Tailwind como contrato público.

## Temas

O shell utiliza tokens semânticos e deve funcionar nos temas claro e escuro. Cores, bordas, superfícies, foco e espaçamento não devem introduzir valores desconectados da fundação existente.

Quando um consumidor sobrescrever tokens públicos suportados, o shell deve refletir os novos valores sem recompilação.

## Dependências e bundle

A implementação deve reutilizar React, utilitários e componentes já existentes. Não há justificativa inicial para adicionar dependências de runtime.

O código interativo da navegação responsiva deve ser mantido pequeno e isolado para reduzir impacto no bundle cliente e preservar a maior parte possível da estrutura como código compatível com Server Components.

Qualquer nova dependência identificada durante a implementação deverá ser justificada no OpenSpec antes de ser adicionada.

## Alternativas consideradas

### Shell monolítico totalmente client-side

Simplificaria o controle da sidebar, porém aumentaria JavaScript enviado ao cliente e reduziria a compatibilidade natural com Server Components. Rejeitado em favor de limites interativos menores.

### API baseada em configuração completa

Um único objeto descrevendo branding, menu e ações reduziria JSX no consumidor, mas acoplaria o design system a modelos específicos e tornaria extensões mais difíceis. Rejeitado em favor de composição React.

### Integração direta com Next.js

Poderia facilitar navegação no admin demo, porém impediria reutilização neutra e contrariaria a arquitetura existente. Rejeitada; roteamento permanece responsabilidade do consumidor.

### CSS dependente do Tailwind da aplicação

Reduziria parte do CSS distribuído, mas obrigaria consumidores a usar/configurar Tailwind e escanear fontes internas. Rejeitado; o shell será entregue no CSS compilado da biblioteca.

## Documentação

O Storybook deve demonstrar ao menos:

- shell básico;
- composição com header, sidebar e conteúdo;
- navegação com itens suficientes para representar uso administrativo;
- comportamento em viewport reduzida;
- temas claro e escuro;
- customização suportada por design tokens.

O admin demo deve incluir uma utilização integrada do shell sem transformar esta change na evolução completa prevista pelo item seguinte do roadmap.

## Testes

A cobertura deve incluir:

- renderização das regiões estruturais;
- composição de conteúdo fornecido pelo consumidor;
- abertura e fechamento da navegação responsiva;
- operação por teclado e semântica acessível;
- exports públicos;
- customização por tokens;
- consumo da folha CSS compilada;
- integração no admin demo Next.js App Router;
- validação E2E e snapshots quando a mudança alterar intencionalmente o baseline visual.

## Decisões

- O shell é infraestrutura visual e não um framework de aplicação.
- Autenticação, autorização e roteamento ficam fora do pacote.
- O componente reutiliza primitivas e navegação existentes antes de criar abstrações novas.
- A interatividade fica em `admin-shell-navigation.tsx`, um Client Component que
  contém somente o provedor de estado, o trigger e o Drawer móvel. `Root`,
  `Header`, `Body`, `Sidebar` e `Main` permanecem no módulo server-safe e passam
  o conteúdo do consumidor como children através desse limite. Isso preserva a
  ergonomia da API composta sem promover a página ou as regiões estruturais a
  Client Components.
- Não serão adicionadas dependências de runtime sem justificativa explícita.
- Padrões avançados de administração permanecem fora deste incremento.

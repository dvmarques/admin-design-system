# Design — add-admin-shell

## Visão geral

O Admin Shell será uma composição estrutural do design system, responsável por organizar regiões administrativas recorrentes sem assumir regras de negócio, autenticação ou roteamento da aplicação consumidora.

A API deve privilegiar composição React e manter as regiões semanticamente separadas para que consumidores possam fornecer marca, navegação, ações e conteúdo utilizando APIs públicas.

## Estrutura proposta

O shell é composto por três regiões principais:

1. **Header** — região superior para identidade, contexto e ações globais.
2. **Sidebar** — navegação primária administrativa, persistente em viewport ampla e acionável em viewport reduzida.
3. **Main** — conteúdo principal da página, com dimensionamento e espaçamento coerentes com os tokens do design system.

A implementação deve permitir composição de conteúdo pelo consumidor em vez de codificar menus ou ações específicos.

## Responsividade

Em telas amplas, sidebar e conteúdo podem coexistir. Em telas menores, a navegação lateral deve deixar de ocupar espaço permanente e ser acessível por um controle explícito no header ou região equivalente.

O estado de abertura da navegação responsiva deve possuir comportamento previsível e acessível, incluindo foco, teclado e atributos ARIA adequados quando aplicável.

## Acessibilidade

- utilizar landmarks semânticos adequados (`header`, `nav`, `main` quando compatíveis com a composição);
- permitir identificação acessível da navegação;
- garantir operação por teclado do controle responsivo;
- manter ordem de foco coerente;
- evitar que conteúdo oculto da sidebar permaneça interativo;
- preservar contraste e estados de foco dos componentes existentes.

## Temas e estilo

O shell deve utilizar tokens e CSS distribuídos pelo próprio design system, sem introduzir valores visuais desconectados da fundação existente. A estrutura deve funcionar nos temas claro e escuro.

## API pública

Os componentes necessários ao shell devem ser exportados pelas entradas públicas do pacote. O admin demo e os exemplos devem consumir somente essas entradas, servindo como teste de integração real.

A API deve favorecer composição e não acoplar o design system a Next.js. Links, navegação e conteúdo permanecem sob responsabilidade do consumidor.

## Documentação

O Storybook deve demonstrar ao menos:

- shell básico;
- composição com header, sidebar e conteúdo;
- navegação com itens suficientes para representar uso administrativo;
- comportamento em viewport reduzida;
- temas suportados.

O admin demo deve incluir uma utilização integrada do shell sem transformar esta change na evolução completa prevista pelo item seguinte do roadmap.

## Testes

A cobertura deve incluir:

- renderização das regiões estruturais;
- composição de conteúdo fornecido pelo consumidor;
- abertura e fechamento da navegação responsiva;
- operação por teclado e semântica acessível;
- exports públicos;
- integração no admin demo;
- validação E2E/snapshots quando a mudança alterar o baseline visual.

## Decisões

- O shell é infraestrutura visual e não um framework de aplicação.
- Autenticação, autorização e roteamento ficam fora do pacote.
- O componente deve reutilizar primitivas e navegação existentes antes de criar abstrações novas.
- Padrões avançados de administração permanecem fora deste incremento.

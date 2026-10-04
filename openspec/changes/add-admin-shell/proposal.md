# Proposal — add-admin-shell

## Contexto

O Admin Design System já possui fundação visual, primitivas e famílias de componentes de formulário, overlay, navegação e exibição de dados. O próximo incremento do roadmap é fornecer uma estrutura reutilizável para aplicações administrativas, evitando que cada aplicação consumidora tenha de reconstruir layout, navegação responsiva e organização de conteúdo.

## Objetivo

Adicionar um Admin Shell público e reutilizável que componha header, sidebar e área principal de conteúdo, integrado aos tokens, temas e componentes existentes do design system.

## Escopo

- estrutura principal do Admin Shell;
- header administrativo;
- sidebar com suporte à navegação existente;
- área principal de conteúdo;
- comportamento responsivo para desktop e telas menores;
- mecanismo acessível para abrir/fechar a navegação quando necessário;
- suporte aos temas claro e escuro e aos tokens públicos;
- composição extensível por aplicações consumidoras sem imports internos;
- documentação e exemplos no Storybook;
- exemplo integrado no admin demo;
- testes de comportamento, acessibilidade e consumo público.

## Fora de escopo

- autenticação e autorização;
- regras de negócio específicas de uma aplicação;
- roteamento proprietário do Next.js;
- dashboards, filtros complexos e tabelas inteligentes, que pertencem ao incremento de padrões avançados;
- evolução completa do admin demo, tratada separadamente no item seguinte do roadmap.

## Resultado esperado

Aplicações administrativas devem conseguir montar sua estrutura principal utilizando exclusivamente APIs públicas do design system, com comportamento consistente entre temas e tamanhos de tela e sem duplicar a infraestrutura visual do shell.

## Referências

- GitHub Issue #15 — Adicionar estrutura de administração (Admin Shell)
- `docs/roadmap.md` — item `7. add-admin-shell`

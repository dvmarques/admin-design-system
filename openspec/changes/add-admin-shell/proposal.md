# Proposal — add-admin-shell

## Contexto

O Admin Design System já possui fundação visual, primitivas e famílias de componentes de formulário, overlay, navegação e exibição de dados. O próximo incremento do roadmap é fornecer uma estrutura reutilizável para aplicações administrativas, evitando que cada aplicação consumidora tenha de reconstruir layout, navegação responsiva e organização de conteúdo.

## Objetivo

Adicionar um Admin Shell público e reutilizável que componha header, sidebar e área principal de conteúdo, integrado aos tokens, temas e componentes existentes do design system.

## Valor para aplicações consumidoras

O shell fornece uma base administrativa consistente, reduz duplicação entre aplicações e permite que produtos Next.js App Router adotem a mesma estrutura, responsividade, acessibilidade e tematização sem depender da implementação interna da biblioteca ou de Tailwind CSS na aplicação consumidora.

## Pacotes e APIs públicas afetadas

### Biblioteca reutilizável

- pacote público de componentes React do Admin Design System;
- nova família pública de componentes do shell, com nomes React e tipos seguindo o prefixo `Ads`;
- folha de estilos compilada distribuída pela biblioteca, utilizando classes públicas `ads-*` e tokens `--ads-*` quando novos contratos públicos forem necessários;
- pontos de entrada públicos do pacote para exportar o shell e seus tipos sem imports internos.

A API final será confirmada durante o levantamento da implementação, preservando composição e compatibilidade com Next.js App Router sem criar dependência direta do roteador.

### Aplicação de demonstração

- admin demo Next.js receberá somente uma integração de referência do novo shell;
- o demo deverá consumir os componentes e o CSS da mesma forma que uma aplicação externa;
- a evolução funcional completa do demo permanece fora desta change.

## Escopo — biblioteca reutilizável

- estrutura principal do Admin Shell;
- header administrativo;
- sidebar com suporte à composição da navegação existente;
- área principal de conteúdo;
- comportamento responsivo para desktop e telas menores;
- mecanismo acessível para abrir/fechar a navegação quando necessário;
- suporte aos temas claro e escuro e aos tokens públicos;
- composição extensível por aplicações consumidoras sem imports internos;
- documentação e exemplos no Storybook;
- testes de comportamento, acessibilidade, CSS distribuído e consumo público.

## Escopo — aplicação de demonstração

- exemplo integrado do Admin Shell no admin demo;
- validação de consumo das APIs públicas e da folha de estilos compilada em Next.js App Router.

## Fora de escopo

- autenticação e autorização;
- regras de negócio específicas de uma aplicação;
- implementação ou abstração proprietária do roteamento do Next.js;
- dashboards, filtros complexos e tabelas inteligentes, que pertencem ao incremento de padrões avançados;
- evolução completa do admin demo, tratada separadamente no item seguinte do roadmap;
- famílias de componentes sem relação direta com a estrutura administrativa.

## Resultado esperado

Aplicações administrativas devem conseguir montar sua estrutura principal utilizando exclusivamente APIs públicas e o CSS distribuído pelo design system, com comportamento consistente entre temas e tamanhos de tela, customização por tokens e sem duplicar a infraestrutura visual do shell.

## Referências

- GitHub Issue #15 — Adicionar estrutura de administração (Admin Shell)
- `docs/roadmap.md` — item `7. add-admin-shell`

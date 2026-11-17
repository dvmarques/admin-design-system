# Design

## Context

O shell já possui padding próprio; o Demo adiciona padding de página e seções legado. A Visão geral usa tokens menores. A lista do Catálogo combina uma primitiva flexível com estilos nativos de lista.

## Goals / Non-Goals

**Goals:** alinhar páginas e atalhos com a Visão geral, mantendo as estruturas e estados de cada exemplo.

**Non-Goals:** alterar shell, componentes públicos, autenticação ou densidade interna de tabelas.

## Decisions

- Aplicar regras compartilhadas locais ao Demo, em vez de overrides por rota; preservar espaçamentos internos de componentes. O container da página continua separado do padding do shell.
- Fazer reset e gap apenas na lista de atalhos; não modificar a primitiva pública. Manter `nav`, `ul`, links e foco.
- Usar tokens semânticos existentes; CSS local compilado pelo Next.js não é distribuído nos pacotes e não afeta consumidores. Tailwind permanece interno aos pacotes, sem configuração nova no Demo.
- Preservar os limites Server/Client, HTML, hierarquia, tema, rolagem e funcionalidades; não há mudança de export, dependência ou bundle JavaScript relevante.

## Risks / Trade-offs

- Mudança compartilhada afeta diversas rotas → auditar e testar larguras, temas, estados e alinhamento, inclusive exemplos semânticos.
- Componentes com espaçamento próprio → evitar reset de seus descendentes e inspecionar visualmente.
- Rollback: reverter o commit do Demo sem migração de consumidores.

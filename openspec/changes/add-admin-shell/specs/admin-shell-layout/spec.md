## Purpose

Fornece a composição estrutural reutilizável de aplicações administrativas com header, sidebar e conteúdo principal sem acoplamento a framework de aplicação, roteador ou domínio.

## ADDED Requirements

### Requirement: Shell fornece regiões estruturais explícitas

O sistema MUST fornecer `AdsAdminShell` em `@admin-ds/admin` com regiões públicas para header, sidebar e conteúdo principal. A API MUST permitir composição React arbitrária dentro de cada região e MUST NOT exigir conhecimento de rotas, autenticação, autorização, dados ou domínio da aplicação consumidora.

#### Scenario: Aplicação compõe uma página administrativa

- **WHEN** o consumidor fornece branding e ações no header, navegação na sidebar e conteúdo de página na área principal
- **THEN** o shell organiza essas regiões em uma estrutura administrativa coerente sem interpretar o conteúdo recebido

#### Scenario: Conteúdo usa componentes públicos existentes

- **WHEN** o consumidor usa componentes de `@admin-ds/components` dentro das regiões do shell
- **THEN** a composição funciona apenas por APIs públicas, sem imports internos entre pacotes consumidos pela aplicação

### Requirement: Shell expõe landmarks acessíveis

A composição MUST produzir landmarks estruturais apropriados para header, navegação lateral e conteúdo principal. O conteúdo principal MUST usar semântica `main` no caso padrão, e a navegação lateral MUST poder receber nome acessível configurável.

#### Scenario: Usuário navega por landmarks

- **WHEN** uma tecnologia assistiva enumera as regiões da página
- **THEN** header, navegação e conteúdo principal podem ser identificados e diferenciados semanticamente

### Requirement: Shell respeita tokens e temas públicos

O shell MUST utilizar tokens e CSS distribuído do design system para superfícies, texto, bordas, foco, espaçamento e motion. A aparência MUST permanecer funcional nos temas claro e escuro sem exigir Tailwind na aplicação consumidora.

#### Scenario: Aplicação alterna o tema

- **WHEN** o tema público muda entre claro e escuro
- **THEN** header, sidebar, conteúdo e divisores do shell permanecem legíveis e coerentes com os tokens ativos

### Requirement: Shell permanece extensível sem impor conteúdo de domínio

Header, sidebar e conteúdo MUST aceitar composição arbitrária e o shell MUST NOT criar contratos específicos para usuário, avatar, produto, permissões, breadcrumbs, notificações ou rotas. Conceitos desse tipo MAY ser compostos pelo consumidor usando componentes públicos.

#### Scenario: Header recebe ações customizadas

- **WHEN** uma aplicação inclui controle de tema, menu de usuário e uma ação própria no header
- **THEN** o shell apresenta o conteúdo recebido sem exigir props específicas para esses conceitos

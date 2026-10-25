# Proposal

## Why

A issue #187 corrige os vazios do dashboard e agrupa marca e recolhimento na sidebar. #185 e #182 já estão integradas em develop (21aba2e); seus comportamentos permanecem como base.

## What Changes

- Biblioteca: composição opcional de topo da sidebar alinhado ao header e slot público de conteúdo, preservando layout padrão, estados e rolagem.
- Demo: marca oficial na sidebar, símbolo no header móvel, controle de painel lateral, organização opcional abaixo da marca.
- Demo: densidade local da Visão geral, indicadores em 1/2/4 colunas pela largura útil, seleção light suavizada sem alterar dark.
- Stories, catálogo, testes, documentação, changelog e comparação visual.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-shell-layout`: composição opcional com topo da sidebar alinhado ao header.
- `overlay-dialogs`: corrigir altura total do Drawer no mobile, sem mudar o limite dos diálogos.
- `organization-switcher`: tom opcional do avatar da organização, mantendo neutral por padrão.
- `admin-demo-application`: posição responsiva da marca e densidade da visão geral.

## Impact

Perfil **Critical**: API aditiva em AdsAdminShellProps (layout) e AdsAdminShellSidebarProps (header), CSS distribuído e acessibilidade transversal. Pacotes: @admin-ds/admin; consumidores: admin-demo e docs. Sem dependência nova. Valor: consumidores podem escolher a composição sem código de medição de altura nem acoplamento ao Next.js.

Fora do escopo: #91, auditoria completa #152, novas paletas, fontes, backend, autenticação, persistência obrigatória e reformulação dos controles #185/#182.

Refinamento aprovado: controle circular na divisória, nome Admin DS em uma linha e avatar da organização primary como o usuário conectado. O recolhimento não aumenta a altura padrão de 64px.

Refinamento final: seletor expandido alinhado ao retângulo ativo, símbolo da marca com coordenadas invariantes ao recolher, menu móvel de ponta a ponta e identificação somente por marca/nome, sem título editorial duplicado. Afeta também AdsDrawer em @admin-ds/components (correção de max-height no mobile).

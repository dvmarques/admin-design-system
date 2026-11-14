# Corrigir os achados iniciais da auditoria visual (#152)

## Why

A execução manual [#43617023449](https://github.com/dvmarques/admin-design-system/actions/runs/43617023449) produziu 328/328 capturas sem falha, porém registrou 4 alertas: 2 `iframe-theme-mismatch` do exemplo de organização em tema dark e 2 `control-text-overflow` no ícone do AdminShell. Revisão da captura de upload revelou ausência de espaçamento entre duas ações da demonstração. O objetivo é corrigir problemas comprovados e eliminar um falso positivo mensurável sem esconder defeitos genuínos.

## What Changes

- Fazer os dois iframes da demonstração de organização seguirem o tema efetivo selecionado no catálogo, inclusive ao alterná-lo, sem modificar a API `AdsOrganizationSwitcher`.
- Dar espaçamento explícito, fluido e responsivo às ações da demonstração de `AdsFileUpload`, preservando o comportamento e o link.
- Refinar a sinalização de conteúdo horizontal de controles para não confundir overflow CSS **visível e não recortado** de ícones com truncamento; preservar sinais para overflow efetivamente recortado e transbordamento de viewport/bordas.
- Adicionar testes de regressão em navegador; documentar evidências da execução e manter o inventário sem aprovação automática.

## Perfil / impacto

**Standard**: mudanças de comportamento e layout exclusivas do **Admin Demo** (aplicação de demonstração) e do script de auditoria; nenhum contrato exportado, CSS compilado, token, dependência, API pública ou lógica dos pacotes `components`/`admin` é alterado. Valor: exemplos fiéis aos temas e resultados de auditoria menos ruidosos. CSS exclusivamente na aplicação Next.js, sem impacto em consumidores externos.

## Fora do escopo

Não redesenhar componentes, mudar `AdsAdminShell` ou `AdsOrganizationSwitcher` públicos, atualizar snapshots em massa, validar todos os estados nem fechar #152. A matriz mantém `Pendente` até verificação humana por estado/tema/viewport.

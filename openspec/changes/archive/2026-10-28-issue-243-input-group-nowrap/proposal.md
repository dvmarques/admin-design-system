# Evitar quebra de adornos no AdsInputGroup (#243)

## Why

No exemplo Valor em reais da página /catalogo/input-group, o prefixo R$ aparece com R e $ em linhas diferentes, e os botões de ação quebram palavras. Um grupo de campo deve preservar adornos compactos em linha e permitir que a área editável use o espaço restante.

## What Changes

- Corrigir o layout flex e a política de quebra de adornos de AdsInputGroup em @admin-ds/components, sem precisar de overrides locais do demo.
- Preservar o conteúdo inteiro de prefixos/sufixos e botões de ação em largura normal; definir comportamento previsível em larguras fisicamente insuficientes sem overflow horizontal da página ou corte de ações.
- Corrigir a demonstração: textos visíveis Limpar e Restaurar, limpar para campo vazio e restaurar valor inicial; manter labels acessíveis.
- Criar exemplo específico de AdsInputGroup em vez de reutilizar indiscriminadamente o demo genérico de AdsField.
- Cobrir tamanhos, estados, temas, viewport estreita, zoom, CSS distribuído e Storybook.

## Perfil e riscos

Critical: correção transversal no CSS distribuído de componente público, que aceita elementos React arbitrários nos adornos. Não impor nowrap ao AdsButton globalmente, nem alterar contratos do grupo ou de outros controles.

## Impact

@admin-ds/components: field.tsx e, se necessário, classe de controle compartilhada, CSS publicado e testes. Apps: admin-demo, Storybook e testes de integração. Sem novas props, exports, dependências ou tokens públicos.

## Fora do escopo

Redesenhar campos, introduzir componente de botão novo, corrigir tipografia do Textarea (#242), alterar o alinhamento de todos os AdsButton.

## Referências

Issue #243, auditoria #152, packages/components/src/field.tsx, form-control-classes.ts, button.tsx, apps/admin-demo/app/catalogo/catalog-demos.tsx.

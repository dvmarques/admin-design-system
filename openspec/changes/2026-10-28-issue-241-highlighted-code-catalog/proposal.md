# Incluir HighlightedCodeSnippet no catálogo oficial (#241)

## Why
AdsHighlightedCodeSnippet já é um componente público do pacote opcional @admin-ds/highlighted-code e é consumido pelo catálogo para exibir código, mas não consta como entrada pesquisável/selecionável em Componentes. Hoje só existe a página de exemplo de aplicação Código destacado. Isso dificulta descobrir sua API e os requisitos de instalação.

## What Changes
- Adicionar AdsHighlightedCodeSnippet à categoria Dados do índice de componentes, sidebar e busca, com rota oficial /catalogo/highlighted-code-snippet.
- Criar demonstração funcional com linguagens representativas, temas, números de linha, wrap, cópia, fallback e carregamento; oferecer instalação, import do pacote e documentação da API.
- Preservar a página antiga /exemplos/codigo-destacado como exemplo aprofundado ligado ao novo catálogo.
- Ampliar a matriz/teste de cobertura para incluir exports públicos visuais de pacotes opcionais, preservando as exclusões justificadas.
- Criar ou atualizar Storybook e testes sem misturar o motor Shiki ao bundle de @admin-ds/components.

## Perfil e risco
Critical: integra pacote opcional a catálogo Next.js/Storybook, cobertura cruzando workspaces e preservação de isolamento de bundle. As mudanças não criam API de runtime nova, mas exigem verificação de build, carregamento assíncrono e acessibilidade.

## Impact
Pacotes @admin-ds/highlighted-code e @admin-ds/components permanecem com exports atuais. Mudanças nas aplicações apps/admin-demo e apps/docs, documentação, testes e matriz de cobertura; não mover arquivos internos do pacote. Nenhuma dependência de runtime nova.

## Fora do escopo
Não implementar CodeEditor, não criar CodeSnippet plain, não reexportar Shiki no entrypoint geral, não alterar os limites de carregamento/fallback nem substituir a demonstração avançada por outra incompleta.

## Referências
#241; implementação entregue na #213; catálogo #151; docs/highlighted-code-snippet.md; packages/highlighted-code/src/index.ts.

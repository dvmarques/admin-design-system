# Design

## Context

Ver proposal.md. O shell monta marcas responsivas; uma pode estar oculta. O Storybook é um site estático separado e seu endereço é configurado no build.

## Goals / Non-Goals

Usar NavigationItem existente para manter dimensões, foco e temas da sidebar. Não modificar layout, tokens, CSS distribuído nem APIs públicas.

## Decisions

- Renderizar StorybookLink dentro da lista inicial de DemoNavigation. O componente retorna null sem endereço, evitando item vazio. Usar âncora nativa para preservar o destino sem prefixo adicional do Next.js.
- Manter aria-label indicando nova aba, rel noopener e title no modo recolhido. Símbolo Sb decorativo e rótulo usam as classes públicas existentes.
- O layout continua Server Component e DemoNavigation continua Client Component. A variável NEXT_PUBLIC é resolvida no build; nenhum estado ou dependência adicional.
- Testar o único logo visível e seu carregamento no desktop expandido, recolhido e no celular, incluindo menu aberto. Não usar first(), pois esconderia duplicidade indevida de marcas visíveis.
- Reutilizar CSS compilado Ads sem Tailwind novo ou sobrescritas. Não há impacto relevante de bundle além do item já existente movido para o cliente.

- Habilitar build e teste Pages em PRs não Draft para develop. Configure/upload/deploy ficam condicionados a develop fora de PR; concorrência por PR evita bloquear publicações. Isso permite verificar o export Linux fiel ao servidor antes do merge. O export local Windows gera diretórios de prefetch incompatíveis com os URLs do Next.js; não filtrar seus erros para obter aprovação artificial.

## Risks / Trade-offs

- Link externo em navegação recolhida pode perder nome visual → manter nome acessível e title, testar teclado e nova aba nos dois temas e no celular.
- Teste amplo de marca encontra duplicatas ocultas → filtrar visibilidade e exigir exatamente uma marca visível por estado.

## Migration Plan

Publicar via PR para develop e pipeline existente. Rollback por reversão do commit; nenhuma migração de dados. Snapshots padrão não mudam porque o endereço Storybook não é configurado no build comum.

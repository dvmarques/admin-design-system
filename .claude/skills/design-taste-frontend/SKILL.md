---
name: design-taste-frontend
description: Compor interfaces do Admin Design System com os componentes públicos e a identidade existente. Use para criar ou revisar páginas da demonstração e exemplos do catálogo.
---

# Composição de interfaces

Esta skill é uma adaptação local. A origem e o hash de importação estão em
`skills-lock.json`; esse hash não representa o texto adaptado.

## Contexto e identidade

Antes de propor uma interface, leia `AGENTS.md`, `docs/visual-identity.md`,
`docs/visual-polish.md` e a documentação de integração. Consulte as stories dos
componentes envolvidos para conhecer suas variantes e estados.

A Inter, os temas e os tokens atuais são a referência. Preserve cores,
tipografia, densidade, raios, elevação e movimento. Não escolha outra estética
ou biblioteca de componentes a partir do tipo de página. Uma mudança de
identidade precisa fazer parte do escopo solicitado e seguir o processo OpenSpec.

## Composição

- Parta da tarefa do usuário e organize títulos, ações e conteúdo por importância.
- Use exports públicos de `@admin-ds/components` e `@admin-ds/admin`.
- Reutilize variantes existentes antes de criar novos estilos ou componentes.
- Use os tokens semânticos `--ads-*`; não substitua a escala do projeto por
  paletas, fontes ou medidas arbitrárias.
- Mantenha o Tailwind como detalhe interno da biblioteca. A demonstração usa
  estilos `demo-` e classes públicas `ads-`, sem depender de utilitários não distribuídos.
- Priorize Server Components. Isole interatividade em Client Components quando
  necessário, sem acoplar componentes reutilizáveis ao roteador ou a regras de negócio.
- Não adicione bibliotecas de animação, ícones, fontes ou UI por preferência
  estética. Uma dependência nova precisa de necessidade concreta e justificativa.

## Conteúdo e estados

Use rótulos claros e conteúdo coerente com a demonstração. Diferencie
carregamento, vazio, erro, sucesso e indisponibilidade conforme a API existente.
Não crie métricas, depoimentos ou resultados apresentados como dados reais.

Use os ícones, indicadores, skeletons e estados vazios do projeto. Imagens e
efeitos decorativos só são necessários quando ajudam a tarefa; não são
requisito de uma página administrativa.

## Responsividade e acessibilidade

- Preserve a estrutura semântica, os nomes acessíveis e a ordem de leitura.
- Garanta navegação por teclado, foco visível e contraste nos dois temas.
- Não dependa somente de cor para estado, seleção ou séries de gráfico.
- Verifique telas a partir de 320 px, conteúdos longos, quebra de texto e
  rolagem de tabelas dentro de seu contêiner.
- Respeite movimento reduzido, cores forçadas e preferências de contraste
  implementadas pelos tokens. Não imponha animações ou rolagem customizada.

## Verificação

Revise a interface nos dois temas e nos tamanhos relevantes. Verifique os
estados e as interações afetadas, seguindo `docs/quality.md`. Não aceite
snapshots novos para ocultar regressões. Relate as validações executadas e
qualquer limitação de ambiente.

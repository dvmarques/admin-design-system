---
name: high-end-visual-design
description: Revisar o acabamento visual de componentes e composições do Admin Design System, preservando a Inter, os tokens e a identidade atual.
---

# Acabamento visual

Esta skill é uma adaptação local. A origem e o hash de importação estão em
`skills-lock.json`; esse hash não representa o texto adaptado.

## Referências do projeto

Siga `AGENTS.md`, `docs/visual-identity.md`, `docs/visual-polish.md` e as
stories dos componentes. A Inter e as famílias tipográficas públicas são
decisões do projeto; não são defeitos a corrigir.

Preserve a identidade atual. Não varie a estética entre tarefas, copie estilos
de outros sites ou imponha fontes, formas, sombras e animações externas.
Mudanças na identidade só entram quando fazem parte do escopo solicitado e
seguem o processo OpenSpec.

## Critérios de revisão

- Confira a hierarquia de títulos, rótulos, valores e ações com as variantes de
  `AdsTypography` e os tokens de corpo, títulos e monoespaçada.
- Verifique alinhamento, ritmo e densidade usando a escala de espaçamento existente.
- Use as superfícies e os níveis de elevação por seu papel semântico.
  Bordas, raios e sombras devem seguir os componentes e tokens, sem molduras
  decorativas obrigatórias.
- Preserve os tamanhos e estados de botões e campos. Não transforme controles
  em pills, troque ícones ou adicione efeitos de hover por preferência visual.
- Use estados de foco, seleção e validação consistentes. Não comunique
  informação apenas por cor ou sombra.
- Mantenha textos legíveis, ações identificáveis e áreas interativas utilizáveis
  quando o conteúdo cresce ou a tela diminui.

## Movimento e desempenho

Use os tokens de movimento do projeto. Animação deve comunicar uma mudança
de estado ou ajudar a orientação; uma interface estática pode estar completa.
Respeite movimento reduzido e não adicione bibliotecas, efeitos de cursor,
parallax ou rolagem customizada para produzir novidade visual.

## Verificação

Revise temas claro e escuro, responsividade a partir de 320 px, foco por teclado,
contraste e estados relevantes. Confira que overlays mantêm tema e tipografia.

Para alterações visuais autorizadas, siga `docs/quality.md`, teste o consumo
público dos estilos e revise os snapshots afetados. Não atualize baselines em
uma limpeza documental. Registre o problema concreto, a correção e a validação.

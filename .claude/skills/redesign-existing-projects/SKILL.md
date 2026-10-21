---
name: redesign-existing-projects
description: Auditar e ajustar interfaces existentes do Admin Design System sem trocar automaticamente a fonte, a identidade, a arquitetura ou os componentes.
---

# Revisão de interfaces existentes

Esta skill é uma adaptação local. A origem e o hash de importação estão em
`skills-lock.json`; esse hash não representa o texto adaptado.

## Delimitar a revisão

Leia `AGENTS.md`, a documentação de identidade, integração e qualidade e as
stories relevantes. Identifique o comportamento esperado e o problema concreto
antes de editar. Uma revisão ou limpeza não autoriza um redesenho completo.

Preserve a Inter, os temas, os tokens, a estrutura de navegação e as APIs públicas.
Não classifique uma fonte, grade, sidebar, borda ou componente existente como
defeito apenas por ser comum. Uma mudança de identidade precisa fazer parte do
escopo solicitado e seguir o processo OpenSpec.

## Auditar

- **Tipografia:** legibilidade, hierarquia, textos longos e uso das famílias
  públicas, sem troca automática de fonte.
- **Cores e superfícies:** papéis semânticos, contraste, foco, seleção e
  consistência entre temas, sem substituir a paleta.
- **Layout:** alinhamento, espaçamento, contenção de conteúdo e responsividade
  a partir de 320 px, mantendo a densidade adequada à tarefa.
- **Estados:** carregamento, vazio, erro, desabilitado e seleção conforme os
  contratos dos componentes.
- **Interação:** teclado, foco, ordem de leitura, rótulos e navegação.
- **Conteúdo:** instruções claras, dados de demonstração identificáveis e links úteis.
- **Código:** HTML semântico, imports públicos, tokens existentes e respeito
  aos limites entre componentes de servidor e cliente.

## Ajustar

Corrija primeiro regressões funcionais e de acessibilidade; depois problemas
comprovados de composição e consistência visual. Faça a menor mudança que
resolva o problema, reutilizando componentes e variantes existentes.

Não adicione texturas, fotografias, novas bibliotecas, efeitos de movimento ou
animações de fonte para diferenciar a página. Preserve também o comportamento
para movimento reduzido, cores forçadas e maior contraste.

Mantenha URLs, nomes de campos, regras de negócio e conteúdo legal fora de
uma revisão visual, salvo quando estiverem explicitamente no escopo.

## Verificar

Teste os fluxos e estados afetados nos dois temas e em telas estreitas.
Siga `docs/quality.md` para validação de componentes, integração, acessibilidade
e snapshots. Atualize baselines somente quando a mudança visual for intencional
e revisada. Relate o que foi corrigido e qualquer validação não executada.

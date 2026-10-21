## Why

O Admin Design System já possui componentes, composições administrativas e identidade
visual própria, mas a documentação atual ainda descreve a fase de fundação e
funcionalidades existentes como trabalho futuro. Referências ao CoreUI continuam
orientando novas changes, enquanto skills de design sugerem substituir a Inter e
recriar a aparência. Essa divergência pode induzir consumidores e agentes a
interpretar incorretamente o produto ou alterar decisões já consolidadas.

## What Changes

- Atualizar README e arquitetura para descrever o produto existente no presente,
  removendo o relato extenso de andamento e tecnologias tratadas como planejadas.
- Remover CoreUI e outras bibliotecas ou sites como orientação visual e funcional
  vigente. Usar a identidade, os tokens e os componentes do próprio projeto.
- Substituir ressalvas repetidas sobre CoreUI PRO por orientação geral de
  implementação independente e respeito às licenças, preservando atribuições reais.
- Corrigir limitações que ainda dizem que os componentes não foram implementados;
  preservar restrições técnicas e responsabilidades da aplicação consumidora.
- Limpar referências operacionais obsoletas a roadmap e próximos passos já
  concluídos, sem recriar `docs/roadmap.md` ou reescrever changes arquivadas.
- Manter a Inter e a identidade atual. Ajustar as skills de design para que não
  proíbam a fonte, imponham outra estética ou solicitem dependências e redesenhos
  sem necessidade para a tarefa.
- Sincronizar as skills próprias conforme o fluxo do repositório e registrar a
  limpeza no changelog durante a implementação.

## Capabilities

### New Capabilities

Nenhuma. Esta change é documental e operacional, declarada com
`skip_specs: true`; não introduz uma capability de produto.

### Modified Capabilities

Nenhuma. Não há alteração de comportamento observável, API pública ou requisitos
das specs principais.

## Impact

- Documentação: `README.md`, `docs/architecture.md`, `docs/limitations.md`,
  `docs/licensing.md` e passagens de planejamento desatualizadas em outros
  documentos atuais, especialmente `docs/visual-identity.md`.
- Orientações: `openspec/config.yaml`, `AGENTS.md` e as skills próprias
  `design-taste-frontend`, `high-end-visual-design` e
  `redesign-existing-projects` em `.agents/skills`, com cópias sincronizadas
  em `.claude/skills`.
- `skills-lock.json`: revisar a coerência do registro de origem se a forma de
  manutenção das skills mudar; não inventar hashes de upstream.
- `CHANGELOG.md`: somente nova entrada na implementação.
- Pacotes `@admin-ds/tokens`, `@admin-ds/components` e `@admin-ds/admin`:
  nenhuma alteração de código, exports, CSS ou dependências.
- Demo Next.js e Storybook: nenhuma mudança de layout ou comportamento.

## Fora do escopo

- Trocar a Inter, cores, espaçamentos, ícones, componentes ou baselines visuais.
- Implementar funcionalidades, eliminar limitações reais ou publicar pacotes no npm.
- Apagar changes arquivadas, specs principais, histórico Git ou atribuições legais.
- Remover a seção `Em andamento` do changelog ou alterar a automação de releases.
- Remover referências técnicas necessárias a Next.js, React, Tailwind, WCAG,
  ferramentas, fontes ou dependências efetivamente utilizadas.

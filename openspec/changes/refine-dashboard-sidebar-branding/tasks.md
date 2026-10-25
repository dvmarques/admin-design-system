## 1. Planejamento e referência

- [x] 1.1 Revisar e validar proposal, design e deltas; conferir dependências #185/#182.
- [x] 1.2 Registrar capturas antes em light/dark, expandido/recolhido/mobile nas mesmas viewports.

## 2. Biblioteca reutilizável

- [x] 2.1 Implementar layout opt-in e slot de topo sem mudar layout padrão, estado ou persistência.
- [x] 2.2 Preservar Drawer, foco, organização opcional e rolagem independente; testar slot e SSR/hidratação.
- [x] 2.3 Documentar API, CSS e stories com/sem organização, marca e toggle.

## 3. Demonstração

- [x] 3.1 Integrar marca oficial/sidebar/header móvel e controles existentes; preservar ícones/abreviações.
- [x] 3.2 Compactar somente a Visão geral, grid útil 1/2/4 e seleção light local.
- [x] 3.3 Atualizar catálogo, documentação e CHANGELOG #187.

## 4. Verificação e entrega

- [x] 4.1 Testar consumo Next.js, resize, header variável, 320px, zoom 200%, textos longos, foco e acessibilidade.
- [ ] 4.2 Capturar depois, revisar comparação light/dark e snapshots intencionais.
- [x] 4.3 Formatar arquivos alterados com npx.cmd prettier --write; executar npm run format, lint, build, typecheck, test:quality; iniciar ambos os apps.
- [x] 4.4 Executar npm run test:e2e sem falhas antes do commit; diagnóstico por test:e2e:verbose/test:verbose.
- [ ] 4.5 Executar openspec.cmd validate --all --strict; revisar diff, abrir PR develop e conferir CI no SHA final, sem merge ou archive.

## Evidências de validação

- E2E local: 299 testes aprovados, com --ignore-snapshots (Windows); comparações oficiais serão executadas em Linux.
- Qualidade local: testes React, Node dos pacotes e release aprovados; test:ci encontra falha existente em ci-impact.test.mjs que espera /work, resolvido como C:\\work no Windows. Não foi alterada fora do escopo. Gate completo depende da CI Linux.
- Build completo, typecheck, lint, format, check:agent-skills, check:generated e OpenSpec estrito executados.

- Regressão final: 1.063 testes aprovados (61 arquivos) e seis E2E novos aprovados após o último build. Storybook iniciado e composição com marca/organização/recolhimento verificada no Chromium. Admin demo dev iniciado em 3001; build de produção validado em 3000.
- Publicação pendente: revisão automática de aprovação bloqueou o push para origin por exigir autorização explícita do usuário. PR, workflow Linux de baselines e CI dependem dessa autorização; nenhum envio remoto realizado.

## 5. Refinamento aprovado após revisão visual

- [x] 5.1 Aplicar chevron circular na divisória sem alterar altura ao recolher; atualizar marca Admin DS.
- [x] 5.2 Expor avatarTone opcional por organização, aplicar primary no demo e documentar/testar gatilho e opções.
- [x] 5.3 Atualizar stories, regressões de geometria e evidências; repetir format, lint, build, tipos, testes e E2E locais.

- Refinamento aprovado: capturas atualizadas e revisadas em light/dark; cabeçalho de 64px antes e depois do recolhimento, controle clicável na divisória e avatar primary igual ao da conta. Sem animação de largura nessa variante para evitar reflow transitório. Testes: 1.064 unitários/integração aprovados e 299 E2E aprovados com --ignore-snapshots. A falha preexistente de test:ci no Windows e os gates remotos pendentes permanecem registrados acima.

## 6. Consistência da seleção e do seletor de organização

- [x] 6.1 Fixar largura disponível do seletor expandido e ocultar apenas a cor da borda recolhida.
- [x] 6.2 Implementar seleção de 44x44px com recuo igual nos estados e scrollbar variável.
- [x] 6.3 Validar nomes curtos/longos, foco, geometria e regressões nos navegadores; atualizar evidências e executar gates locais.

- Consistência validada: 21 smoke nos três navegadores e 302 E2E completos aprovados com --ignore-snapshots; 1.064 testes unitários/integração aprovados. Build, Storybook, tipos, lint, formatação, skills, artefatos gerados e 54 itens OpenSpec validados. test:quality continua limitado pela asserção preexistente /work versus C:\\work em test:ci no Windows. Capturas finais atualizadas e revisadas.

## 7. Alinhamento final e menu móvel

- [x] 7.1 Alinhar limites do seletor ao item ativo e estabilizar posição do símbolo da marca.
- [x] 7.2 Corrigir altura do Drawer, preencher viewport no menu do shell e remover título duplicado do demo, preservando acessibilidade.
- [x] 7.3 Atualizar testes nos três navegadores, stories, documentação, changelog e capturas; executar gates locais completos.

- Alinhamento final validado: 1.065 testes unitários/integração e 305 E2E locais aprovados com --ignore-snapshots. Cobertura nos três navegadores para coordenadas do símbolo, limites laterais da organização/seleção, menu móvel de 390×844, 320×568 e 740×390, rolagem e foco. Build completo, tipos, lint, formatação e 54 itens OpenSpec aprovados; test:quality mantém apenas a falha conhecida de caminho Windows em test:ci. Capturas finais revisadas e atualizadas.

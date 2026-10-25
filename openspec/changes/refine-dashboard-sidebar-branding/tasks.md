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

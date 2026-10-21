## 1. Correção reutilizável

- [x] 1.1 Acrescentar regressões de componente e confirmar falha original, cobrindo teclado, estados controlado/não controlado, desabilitados, navegação, reabertura, mouse e Escape.
- [x] 1.2 Coordenar foco com montagem real do menu sem mudar APIs públicas e verificar regressões.

## 2. Consumo e documentação

- [x] 2.1 Documentar teclado na story existente e acrescentar E2E com foco real, ativação, temas, viewport e acessibilidade no admin-demo público.

## 3. Validação

- [x] 3.1 Executar build, typecheck, lint e testes concisos; iniciar Storybook e demo para validar integração.
- [x] 3.2 Executar npm run test:e2e; registrar limitações de plataforma e snapshots Linux sem atualizar baselines.
- [x] 3.3 Formatar arquivos alterados, executar npm run format e openspec.cmd validate --all --strict e registrar resultados para revisão.

## 4. Ajustes da revisão pelo Claude CLI

- [x] 4.1 Reproduzir e corrigir intenção de foco obsoleta em estado controlado; preservar onBlur do consumidor e a abertura adiada válida.
- [x] 4.2 Evitar rolagem ao focar o menu na montagem e cobrir o fluxo rolado e Espaço nos três motores de navegador.
- [x] 4.3 Revalidar alterações, registrar resultados da revisão e atualizar a PR.

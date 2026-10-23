# Validação — issue-92-admin-flows

Perfil **Critical**. Executado no worktree `issue-92-fluxos-admin`, sobre `5919f77`.

## Comandos executados

| Comando                              | Resultado                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| `npm run format`                     | Passou                                                                            |
| `npm run lint`                       | Passou                                                                            |
| `npm run build`                      | Passou (pacotes, admin-demo e Storybook)                                          |
| `npm run typecheck`                  | Passou                                                                            |
| `npm run test:quiet`                 | 55 arquivos, 868 testes passaram (componente, SSR e `axe` incluídos)              |
| `openspec validate --all --strict`   | 49 passaram, 0 falharam                                                           |
| `npm run check:agent-skills`         | Passou                                                                            |
| `npm run test:e2e` (padrão)          | **Não executável aqui**: o Playwright espera o Chromium 1234; o ambiente tem 1243 |
| E2E em Chromium via `executablePath` | `catalog`, `admin-demo-routes` e `overlay`: 99 passaram, 4 falharam (abaixo)      |

## CI no head `a78dfba`

Todos os checks passaram: Qualidade rápida, Artefatos de distribuição, Política de develop,
Fluxos no navegador (Chromium, Firefox e WebKit); Validação de release foi pulada, como esperado
fora de PRs de release. Os snapshots do tema escuro passaram no ambiente de referência, o que
confirma que as 4 divergências locais abaixo vinham da renderização do container de desenvolvimento
e que nenhum snapshot precisou ser atualizado. O primeiro run da CI falhou em Artefatos de
distribuição (baseline de bundle do admin); o baseline foi atualizado e documentado em
`docs/bundle-baseline.md`.

## Limitações locais (superadas pela CI)

- Firefox e WebKit não estão instalados neste ambiente; a CI deve cobri-los.
- As 4 falhas são `toHaveScreenshot` do tema escuro em `/componentes`, `/clientes`, `/clientes/novo` e `/preferencias`. A imagem de diferença de `/preferencias`, que não usa os componentes alterados, mostra só serrilhado de texto em todo o conteúdo, sem mudança de layout. É diferença de renderização do Chromium deste container em relação ao baseline. Os snapshots **não** foram atualizados; a CI deve confirmar no ambiente de referência.
- Os demais specs E2E não foram executados localmente (apenas os que tocam os componentes alterados).

## Efeito observável a revisar

`AdsConfirmDialog` destrutivo (padrão) passa a expor `role="alertdialog"`; testes de consumidores que consultam `role="dialog"` precisam migrar ou passar `role="dialog"`. Os testes e E2E do repositório foram atualizados.

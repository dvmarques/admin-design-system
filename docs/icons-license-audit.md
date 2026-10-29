# Auditoria de procedência e licenciamento dos ícones — Admin DS

**Data:** 2026-10-29  
**Issue:** [#257](https://github.com/dvmarques/admin-design-system/issues/257)  
**PR:** [#258](https://github.com/dvmarques/admin-design-system/pull/258)  
**Escopo:** os 20 identificadores públicos de `packages/components/src/icon.tsx`.  
**Estado na branch da PR:** **todos os 20 SVGs atuais têm código-fonte oficial identificado e licença permissiva MIT ou ISC**. A revisão visual e testes/CI do projeto ainda são gates pendentes.

## Critério de regularização

Antes desta mudança, os traçados do Admin DS tinham semelhanças com bibliotecas conhecidas, mas sua procedência individual não podia ser comprovada. Não foi assumida autoria própria: **os 19 desenhos antigos restantes foram substituídos por traçados oficiais identificados**, assim como já havia sido feito com `building`.

Cada SVG agora corresponde à geometria de uma fonte oficial; o nome público `AdsIconName` foi preservado. A transcrição para JSX altera apenas a sintaxe dos atributos e declara a largura de traço nativa no elemento (Feather/Lucide: `2`; Hugeicons: `1.5`), para não herdar `1.75` do wrapper `AdsIcon`. `building` também preserva as pontas dos traços. Não se adicionou dependência npm.

## Inventário das 20 fontes atuais

| Nome público     | Fonte          | Arquivo oficial                                                                                                     | Licença | Blob SHA fonte (prefixo) |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------ |
| `alertCircle`    | Feather        | [`alert-circle`](https://github.com/feathericons/feather/blob/main/icons/alert-circle.svg)                          | MIT     | `9d8e884e003e`           |
| `alertTriangle`  | Feather        | [`alert-triangle`](https://github.com/feathericons/feather/blob/main/icons/alert-triangle.svg)                      | MIT     | `077dd0ea8d67`           |
| `bell`           | Feather        | [`bell`](https://github.com/feathericons/feather/blob/main/icons/bell.svg)                                          | MIT     | `1d2f1b72d4bf`           |
| `building`       | Hugeicons Free | [`Building06Icon`](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/src/Building06Icon.ts) | MIT     | `d4fea3215dce`           |
| `calendar`       | Feather        | [`calendar`](https://github.com/feathericons/feather/blob/main/icons/calendar.svg)                                  | MIT     | `f76e83340f1f`           |
| `check`          | Feather        | [`check`](https://github.com/feathericons/feather/blob/main/icons/check.svg)                                        | MIT     | `d5a1c9259c15`           |
| `chevronDown`    | Feather        | [`chevron-down`](https://github.com/feathericons/feather/blob/main/icons/chevron-down.svg)                          | MIT     | `ae614b7c34da`           |
| `chevronLeft`    | Feather        | [`chevron-left`](https://github.com/feathericons/feather/blob/main/icons/chevron-left.svg)                          | MIT     | `590ba33fa5dd`           |
| `chevronRight`   | Feather        | [`chevron-right`](https://github.com/feathericons/feather/blob/main/icons/chevron-right.svg)                        | MIT     | `aac0b825a65f`           |
| `chevronsUpDown` | Lucide         | [`chevrons-up-down`](https://github.com/lucide-icons/lucide/blob/main/icons/chevrons-up-down.svg)                   | ISC     | `bd8833d32381`           |
| `close`          | Feather        | [`x`](https://github.com/feathericons/feather/blob/main/icons/x.svg)                                                | MIT     | `d9213159926b`           |
| `logOut`         | Feather        | [`log-out`](https://github.com/feathericons/feather/blob/main/icons/log-out.svg)                                    | MIT     | `f19790d566a9`           |
| `monitor`        | Feather        | [`monitor`](https://github.com/feathericons/feather/blob/main/icons/monitor.svg)                                    | MIT     | `74d56790b199`           |
| `moon`           | Feather        | [`moon`](https://github.com/feathericons/feather/blob/main/icons/moon.svg)                                          | MIT     | `3249152828bd`           |
| `info`           | Feather        | [`info`](https://github.com/feathericons/feather/blob/main/icons/info.svg)                                          | MIT     | `4d99c59b92e4`           |
| `plus`           | Feather        | [`plus`](https://github.com/feathericons/feather/blob/main/icons/plus.svg)                                          | MIT     | `9b0b994cc208`           |
| `sun`            | Feather        | [`sun`](https://github.com/feathericons/feather/blob/main/icons/sun.svg)                                            | MIT     | `3589337892c4`           |
| `settings`       | Feather        | [`settings`](https://github.com/feathericons/feather/blob/main/icons/settings.svg)                                  | MIT     | `aa787125b889`           |
| `search`         | Feather        | [`search`](https://github.com/feathericons/feather/blob/main/icons/search.svg)                                      | MIT     | `97881568bf9f`           |
| `user`           | Feather        | [`user`](https://github.com/feathericons/feather/blob/main/icons/user.svg)                                          | MIT     | `3e96571ed035`           |

As URLs de origem apontam para o projeto oficial. Os prefixos SHA registram os arquivos examinados, não comprovam autoria do desenho antigo nem substituem avisos legais.

## Licenças e avisos

| Biblioteca     | Ícones usados | Copyright e licença                        | Arquivo oficial                                                                                    |
| -------------- | ------------: | ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Feather Icons  |            18 | MIT — Cole Bemis (2013–2023)               | [LICENSE](https://github.com/feathericons/feather/blob/main/LICENSE)                               |
| Lucide Icons   |             1 | ISC — Lucide Icons and Contributors (2026) | [LICENSE](https://github.com/lucide-icons/lucide/blob/main/LICENSE)                                |
| Hugeicons Free |             1 | MIT — Hugeicons (2025)                     | [LICENSE.md](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md) |

**Avisos integrais** preservados em [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md). O arquivo de licença do Lucide também incorpora avisos MIT relativos a seu subconjunto Feather, conforme sua distribuição oficial; o SVG `chevrons-up-down` usado aqui não está listado nesse subconjunto.

## Histórico de `building` e `settings`

- `building`: substituído pelo `Building06Icon` oficial de Hugeicons Free (MIT), com quatro paths e parâmetros de espessura originais. Mantém `AdsIcon name="building"`; muda somente o desenho visível.
- `settings`: o desenho antigo lembrava o Feather, mas a derivação não era comprovada. Agora o desenho **é** o `settings.svg` oficial do Feather (MIT), com o respectivo aviso de copyright. Não é necessária declaração de que o antigo SVG fosse originalmente Feather.
- [Commit histórico de introdução dos desenhos antigos](https://github.com/dvmarques/admin-design-system/commit/21aba2e7bcde3a0259aee7ef5ac3597a38040f5d). Os commits antigos não são alterados; a regularização diz respeito ao **código atual** após a PR #258.

## Limites e verificações exigidas

- A origem e a licença dos **desenhos substitutos** são verificáveis; não é uma certificação de autoria independente nem um parecer jurídico sobre os históricos.
- As alterações são visuais nos 20 desenhos. Validar os três tamanhos, ambos os temas, as composições administrativas, snapshots visuais e acessibilidade antes do merge.
- Verificar que o conteúdo completo das licenças e avisos siga junto da distribuição de `@admin-ds/components`.
- O projeto continua licenciado MIT para o código próprio, respeitando a ISC/MIT dos desenhos externos.

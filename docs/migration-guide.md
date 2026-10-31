# Guia de migração do Admin Design System

Este guia cobre a mudança de nomes de pacotes e a evolução da preferência de tema, com links para as [APIs no Storybook](https://dvmarques.github.io/admin-design-system/storybook/), [integração](integration.md) e [limitações](limitations.md). Confira o [histórico por componente](component-changelog.md) e o [CHANGELOG](../CHANGELOG.md) da versão de origem e destino.

> **Estado atual:** a renomeação foi preparada e testada em tarballs pela [#194](https://github.com/dvmarques/admin-design-system/issues/194), mas os novos nomes **ainda não estão no npm**. A primeira publicação e a verificação de versões por nome pertencem à [#195](https://github.com/dvmarques/admin-design-system/issues/195).

## 1. Migrar nomes de pacotes

| Workspace anterior           | Pacote de distribuição                                |
| ---------------------------- | ----------------------------------------------------- |
| `@admin-ds/tokens`           | `@dvmarques/admin-ds-tokens`                          |
| `@admin-ds/components`       | `@dvmarques/admin-ds-components`                      |
| `@admin-ds/admin`            | `@dvmarques/admin-ds-admin`                           |
| `@admin-ds/highlighted-code` | `@dvmarques/admin-ds-highlighted-code` (**opcional**) |

Os nomes antigos são **nomes de workspaces históricos**, **não aliases publicados no npm**. Atualize imports JS/TS e folhas `styles.css`, respeitando a ordem tokens → components → admin (quando usado). Não faça imports diretos de `src/` nem configure aliases privados. Somente consumidores que usam o realce precisam instalar `highlighted-code`; Shiki permanece isolado.

Se usar entrada mascarada, atualize também `@admin-ds/components/masked-input` para `@dvmarques/admin-ds-components/masked-input`; ela exige o peer opcional `react-imask ^7.6.1`, não é reexportada na entrada raiz. A [integração](integration.md) inclui os exemplos e os contratos.

**Instalação pós-publicação:** instale apenas os pacotes necessários e seus peers; durante a pré-publicação, a prova de consumo externo usa tarballs `file:` do fluxo #194, não um registro inexistente. Consulte o [guia rápido](integration.md#antes-da-primeira-publicação-npm).

## 2. Migrar ThemeToggle → AdsThemeControl (#182)

`ThemeToggle` permanece exportado, funcional e **não está formalmente depreciado**. Ele é binário (`light`/`dark`), recebe `initialTheme` e emite `onThemeChange`. Troque-o apenas se precisar da terceira preferência, **Sistema**, ou de controle externo sincronizado sem remount.

| Antes                       | Com AdsThemeControl                                                          |
| --------------------------- | ---------------------------------------------------------------------------- |
| `ThemeToggle initialTheme`  | `AdsThemeControl defaultValue` ou `value`                                    |
| `ThemeToggle onThemeChange` | `AdsThemeControl onValueChange`                                              |
| Alternar claro/escuro       | Escolher `light`, `dark` ou `system` diretamente                             |
| Estado binário local        | Preferência controlada (`value`) ou não controlada (`defaultValue="system"`) |

```tsx
'use client';

import { AdsThemeControl, type AdsThemePreference } from '@dvmarques/admin-ds-components';

export function ThemeChoice({
	preference,
	setPreference,
}: {
	preference: AdsThemePreference;
	setPreference: (next: AdsThemePreference) => void;
}) {
	return <AdsThemeControl value={preference} onValueChange={setPreference} />;
}
```

**O controle não persiste nem aplica o tema sozinho.** A aplicação deve guardar a preferência `'light' | 'dark' | 'system'`, resolver Sistema via `prefers-color-scheme` e aplicar `data-theme="light"`/`"dark"` no elemento raiz. No **admin demo**, o cookie `ads-theme` mantém escolhas explícitas antigas; ausência de cookie equivale a Sistema. No SSR normal, Sistema usa fallback inicial claro e um script pré-hidratação corrige antes da pintura; na exportação estática não existe cookie lido por requisição, então o script faz essa reconciliação no cliente. A solução do demo é **exemplo de integração**, não função automática da biblioteca. CSP que bloqueie o script preserva o fallback, e sobrescritas externas de tema podem exigir adequação na aplicação.

Veja o [contrato completo de tema](integration.md#controle-de-preferência-claro-escuro-e-sistema) e [limitações](limitations.md).

## 3. Evoluções com impacto observável

- **#185 — Conta, notificações e organização:** `AdsAccountMenu`, `AdsNotificationCenter` e `AdsOrganizationSwitcher` são composições independentes; passar dados, callbacks e persistência é responsabilidade da aplicação. Organização na sidebar é opcional.
- **#187 — Shell e densidade:** preservar layouts e navegação existentes e revisar customizações do dashboard/sidebar. O shell fornece regiões de layout, não roteamento nem dados.
- **#192 — AdsConfirmDialog:** o primeiro controle interativo elegível em conteúdo adicional recebe foco; caso não exista, o foco inicial vai para Cancelar. Não dependa de Cancelar em toda composição.
- **AdsTabs:** botões de aba não submetem formulários; seletores automáticos devem preferir papéis ARIA aos IDs internos.
- **AdsSmartTable:** virtualização, redimensionamento e exportação são opt-ins; busca, ordenação e paginação de dados ficam com o consumidor.
- **Fontes:** carregue Inter na aplicação (por exemplo, com `next/font`) ou altere tokens; o pacote não inclui os arquivos da fonte.

## 4. Checklist de atualização

1. Compare a versão de origem com o [CHANGELOG](../CHANGELOG.md) e [histórico por componente](component-changelog.md); não presuma que a versão de desenvolvimento seja publicada.
2. Troque imports de pacotes e CSS e confirme peers opcionais necessários.
3. Revise limites Server/Client do App Router, escolha/persistência de tema e tipografia.
4. Rode build, tipos, testes de componentes e E2E no consumidor; verifique acessibilidade com teclado e leitor de tela também manualmente.
5. Consulte [limitações](limitations.md) e [processo de release](release-process.md) para distinguir disponibilidade npm do deploy Pages.

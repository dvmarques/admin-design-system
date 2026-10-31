# @dvmarques/admin-ds-admin

Composições administrativas do **Admin Design System**: `AdsAdminShell`, dashboard, filtros, tabela inteligente, ações em lote, formulários em etapas, confirmação e componentes opcionais de conta, notificações e organização. O pacote organiza interface, **não** fornece backend, autenticação, autorização, roteador nem regras de negócio.

> **Pré-publicação:** tarball testado externamente na [#194](https://github.com/dvmarques/admin-design-system/issues/194); **ainda indisponível no npm**. Instale pelo registro somente após a [publicação #195](https://github.com/dvmarques/admin-design-system/issues/195), com a versão confirmada nela.

## Instalar (após a publicação)

```bash
npm install @dvmarques/admin-ds-tokens @dvmarques/admin-ds-components @dvmarques/admin-ds-admin
```

`@dvmarques/admin-ds-components` é peer obrigatório do pacote admin; React e React DOM exigem versões `>=18.2.0`. O componente de realce de código **não é obrigatório**.

## Usar no App Router

Carregue o CSS compilado uma vez em `app/layout.tsx`, em ordem:

```ts
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-components/styles.css';
import '@dvmarques/admin-ds-admin/styles.css';
```

Composição mínima em `app/admin/page.tsx` (o consumidor controla os links e dados):

```tsx
'use client';

import { AdsAdminShell } from '@dvmarques/admin-ds-admin';

export default function AdminPage() {
  return (
    <AdsAdminShell>
      <AdsAdminShell.Header>
        <AdsAdminShell.SidebarToggle />
        Minha aplicação
      </AdsAdminShell.Header>
      <AdsAdminShell.Body>
        <AdsAdminShell.Sidebar>
          <a href="/admin">Início</a>
        </AdsAdminShell.Sidebar>
        <AdsAdminShell.Main>Conteúdo administrativo</AdsAdminShell.Main>
      </AdsAdminShell.Body>
    </AdsAdminShell>
  );
}
```

O shell usa controles com estado de navegação; mantenha a composição interativa em Client Component. O seletor `AdsOrganizationSwitcher` é opcional na sidebar e não pressupõe organizações. `AdsAccountMenu` e `AdsNotificationCenter` recebem dados e callbacks do consumidor.

## Escopo e responsabilidades

Não executa operações de negócio, não busca nem persiste dados, não faz login, não configura autorização nem integra automaticamente Next Router. `AdsSmartTable` apresenta resultados fornecidos pela aplicação, e `getAdsSmartTableCsv` é auxiliar de exportação, não um componente visual. O CSS não exige Tailwind no consumidor; personalize por tokens semânticos e respeite as limitações de foco, scroll, virtualização e SSR.

**Referências:** [integração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/integration.md) · [API Storybook](https://dvmarques.github.io/admin-design-system/storybook/) · [Demo](https://dvmarques.github.io/admin-design-system/) · [migração](https://github.com/dvmarques/admin-design-system/blob/develop/docs/migration-guide.md) · [limitações](https://github.com/dvmarques/admin-design-system/blob/develop/docs/limitations.md) · [histórico](https://github.com/dvmarques/admin-design-system/blob/develop/docs/component-changelog.md) · [release](https://github.com/dvmarques/admin-design-system/blob/develop/docs/release-process.md) · [licença MIT](https://github.com/dvmarques/admin-design-system/blob/develop/LICENSE.md).

Copyright Daniel Marques. As atribuições de terceiros aplicáveis permanecem preservadas.

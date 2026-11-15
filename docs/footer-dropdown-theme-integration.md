# Footer, dropdown e integração de temas — #319

Este guia descreve APIs públicas do ADS; não exige nenhum framework CSS, roteador, armazenamento ou provider adicional. Importe os três arquivos CSS na ordem **tokens → components → admin**, como explicado em [integração](integration.md).

## Footer do shell (opcional)

```tsx
import { AdsAdminShell } from '@dvmarques/admin-ds-admin';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <AdsAdminShell layout="sidebar-header">
      <AdsAdminShell.Header>Admin</AdsAdminShell.Header>
      <AdsAdminShell.Body>
        <AdsAdminShell.Sidebar><nav aria-label="Seções">…</nav></AdsAdminShell.Sidebar>
        <AdsAdminShell.Main>{children}</AdsAdminShell.Main>
      </AdsAdminShell.Body>
      <AdsAdminShell.Footer
        start={<span>Nome do produto</span>}
        end={<a href="/ajuda">Ajuda</a>}
      />
    </AdsAdminShell>
  );
}
```

- O footer é um **filho direto de AdsAdminShell, depois de Body**. Como irmão de Body e fora de Main, é um landmark HTML `contentinfo` de documento e não invade a rolagem do Main. Respeita desktop com sidebar normal/colapsada, `sidebar-header`, drawer móvel, conteúdo curto e conteúdo longo. Não gera placeholder quando omitido.
- `start` e `end` são `ReactNode` opcionais, `children` aceita conteúdo central livre e demais atributos nativos de `footer` são repassados. A ordem de leitura segue start → children → end; os itens fazem wrap em viewport estreita.
- `--ads-footer-background`, `--ads-footer-border` e `--ads-footer-text` podem personalizar apenas o footer, com fallback para os tokens públicos de superfície/borda/texto. São custom properties de ponto de uso, não cores globais novas.
- Fora do shell, um `<footer>` nativo continua recomendado. **Não existem `AdsFooter` nem um footer global obrigatório**. Evite múltiplos landmarks `contentinfo` no documento sem rótulos distintos.

## Dropdown com grupos

```tsx
import { AdsDropdown } from '@dvmarques/admin-ds-components';

<AdsDropdown>
  <AdsDropdown.Trigger>Ações</AdsDropdown.Trigger>
  <AdsDropdown.Content aria-label="Ações do registro">
    <AdsDropdown.Header id="grupo-operacoes">Operações</AdsDropdown.Header>
    <div role="group" aria-labelledby="grupo-operacoes">
      <AdsDropdown.Item>Editar</AdsDropdown.Item>
      <AdsDropdown.Item disabled>Excluir (sem permissão)</AdsDropdown.Item>
    </div>
    <AdsDropdown.Divider />
    <AdsDropdown.Header id="grupo-exportacao">Exportação</AdsDropdown.Header>
    <div role="group" aria-labelledby="grupo-exportacao">
      <AdsDropdown.Item>Exportar</AdsDropdown.Item>
    </div>
  </AdsDropdown.Content>
</AdsDropdown>
```

Header é texto estático e não recebe foco por padrão. Divider é `role=separator` horizontal e também não recebe foco. Use ids únicos para vincular `role=group` via `aria-labelledby` quando houver agrupamento. Não há `AdsDropdown.Group` obrigatório: os elementos nativos preservam a API pequena.

ArrowDown/ArrowUp/Home/End navegam somente por Items habilitados. Escape fecha e devolve o foco ao gatilho. Tab/Shift+Tab fecham e avançam logicamente do gatilho, inclusive quando o Content está portado para `document.body`; atalhos de navegador sem próximo foco elegível continuam sujeitos à plataforma. As camadas de menu, posição/flip, click-outside e tratamento de modais continuam usando a infraestrutura comum.

## Tema e tokens sem sistema paralelo

- **Tema efetivo**: `data-theme="light"` ou `"dark"` no ancestral; sem atributo, os tokens seguem `prefers-color-scheme`. `AdsThemeControl` emite a **preferência** `light | dark | system`, e `ThemeToggle` permanece binário. O consumidor resolve `system` usando `matchMedia`, aplica `data-theme` e decide se quer gravar cookie/localStorage — nada é persistido pelo pacote.
- **SSR e hidratação**: renderize no servidor um fallback determinístico para a preferência desconhecida; mantenha o mesmo snapshot inicial no cliente. Para minimizar flash visual, a aplicação **pode** inserir script de inicialização antes da primeira pintura para resolver `system` e preferência salva, em conformidade com sua política CSP (nonce/hash e bloqueios de inline script). O Admin Demo em `apps/admin-demo/lib/theme.ts` fornece exemplo de consumidor, não API da biblioteca. Em hosts sem script permitido, documente a troca de tema após hidratação; não prometa ausência absoluta de flash.
- **CSS e overrides**: importe `tokens/styles.css` antes de `components/styles.css` e depois `admin/styles.css`; aplique overrides explícitos depois. Para alterações por tema que alcancem overlays portados, selecione `[data-theme='light']` e `[data-theme='dark']` **sem restringir a `:root`**. Esses atributos também são replicados no root de portais. Customize os tokens `--ads-color-*` e as variáveis de componente (`--ads-header-*`, `--ads-sidebar-*`, `--ads-footer-*`) com fallback.

```css
/* Após os estilos distribuídos: alcança página e portais. */
[data-theme='light'] { --ads-color-primary: #345b9e; }
[data-theme='dark']  { --ads-color-primary: #a4bbff; }
```

Overlays existentes replicam o `data-theme` explícito mais próximo da origem e escutam alterações enquanto abertos. Como os portais estão em `document.body`, **variáveis inline definidas somente num ancestral local não são herdadas pelo painel portado**: passe override diretamente ao Content (ex.: `style={{ '--ads-color-surface-raised': '...' } as React.CSSProperties}`) ou use os seletores `[data-theme]` acima. Não duplique o mecanismo de tema, nem copie indiscriminadamente todas as variáveis calculadas para o portal.

## Verificação e limites

Admin Demo: `/catalogo/admin-shell`, `/catalogo/dropdown`, `/catalogo/theme-control`. Storybook: `Layout/Admin Shell / OptionalFooter`, `Navigation/Components / GroupedDropdown`, `Foundation/AdsThemeControl / ThemePreferenceWithPortal`. Use teclado, sidebar recolhida/aberta, menu em modal, preferência system, viewports de 320/390/768/1440 px e zoom nativo 200%. Testes automatizados e validação visual não substituem aprovação humana de zoom real e leitor de tela.

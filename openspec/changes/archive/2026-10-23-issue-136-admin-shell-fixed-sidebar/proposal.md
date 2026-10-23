## Why

No layout desktop do `AdsAdminShell`, a sidebar acompanha a rolagem vertical da página: `.ads-admin-shell` usa `min-height: 100vh`, o corpo cresce com o conteúdo e nenhum ancestral limita a altura da sidebar à viewport. Em páginas administrativas longas, o usuário perde acesso à navegação lateral (issue #136).

## What Changes

- No layout desktop (`min-width: 48rem`, o mesmo limite que alterna sidebar e Drawer), o shell passa a ter altura limitada à viewport (`100vh` com `100dvh` quando suportado), organizado como coluna: header com altura natural, corpo flexível com `min-height: 0`.
- A sidebar e o conteúdo principal passam a rolar de forma independente, cada um com `overflow-y: auto` e limites de altura reais; a página deixa de rolar no uso padrão.
- O header continua com altura variável (pode quebrar linhas) sem sobrepor sidebar ou main, sem altura fixa em `rem` e sem `position: fixed`.
- `AdsAdminShell.Main` ganha `tabIndex={0}` padrão e foco visível, por ser a região rolável.
- Respeita safe areas no padding inferior do conteúdo e da sidebar.
- Layout móvel inalterado: Drawer, rolagem da página, foco e fechamento atuais.
- Atualização de story, documentação de integração, testes E2E (1280×800, 768×600, 390×844 e altura reduzida) e CHANGELOG.

## Impact

- Pacote: `@admin-ds/admin` (`styles.css` e `AdsAdminShell.Main`, que passa a ter `tabIndex={0}` por padrão, sobrescrevível, para que a região rolável seja acessível por teclado).
- Aplicações: `apps/admin-demo` e `apps/docs` não precisam de mudança de código; validadas como consumidoras.
- API pública: sem alterações. Classes `ads-` existentes preservadas; sem Tailwind exigido do consumidor.
- Observação para consumidores: no desktop o contêiner de rolagem passa a ser `.ads-admin-shell-main`, não a janela; código que usa `window.scrollTo` ou restauração de scroll da janela deve apontar para o main.

## Out of Scope

- Overlays (#91 e #134), não alterados.
- Novas props, tokens ou mudanças visuais; scroll restoration automático do main.

## Perfil de execução

Critical: altera CSS distribuído e o modelo de rolagem do shell. Sem mudança de API; exige validação visual/E2E em múltiplos viewports e nos consumidores. Rollback: reverter o bloco de CSS do layout desktop.

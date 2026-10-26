# Fluxo demonstrativo de autenticação

O Admin Demo inclui três telas de autenticação **simuladas**: login,
recuperação e redefinição de senha. Elas existem para mostrar como compor os
componentes públicos do Admin DS em um fluxo comum de acesso. Nada é
autenticado, enviado ou guardado; o objetivo é apenas navegar pelo padrão.

A change OpenSpec correspondente é `feat-212-demo-auth-flow` (issue #212).

## Rotas

| Rota               | Tela            | Observação                             |
| ------------------ | --------------- | -------------------------------------- |
| `/login`           | Entrar          | Link **Login (exemplo)** na navegação. |
| `/esqueci-senha`   | Recuperar senha | Acessada por **Esqueci a senha**.      |
| `/redefinir-senha` | Redefinir senha | Acessada ao continuar da recuperação.  |

- As três rotas ficam fora do `AdsAdminShell`: não há sidebar nem cabeçalho
  administrativo. O topo mostra o link **Voltar ao Demo** (para `/`) e o
  controle de tema.
- A página inicial (`/`) e as demais rotas do demo continuam abertas, sem
  login, sem redirecionamento e sem middleware. O login é um exemplo opcional,
  listado em "Exemplos de aplicação" na navegação.
- No GitHub Pages as rotas seguem o subcaminho do repositório
  (`NEXT_PUBLIC_BASE_PATH`), como o restante do demo.

## Layout

- **Desktop (a partir de 48rem):** formulário à esquerda (cerca de 45% da
  largura) e painel decorativo à direita (cerca de 55%).
- **Mobile (abaixo de 48rem):** o painel é ocultado e o formulário usa toda a
  largura útil, em uma única coluna, sem rolagem horizontal.
- O painel é um SVG abstrato com o logotipo oficial do projeto
  (`app/icon.svg`) e o texto "Admin Design System". Ele não é lido por
  tecnologias assistivas (`aria-hidden`).

## Fluxo simulado de cada tela

### Login (`/login`)

1. A pessoa informa e-mail e senha e ativa **Entrar**.
2. Se houver erro, a mensagem aparece junto ao campo e o foco vai para o
   primeiro campo inválido.
3. Se estiver válido, o botão mostra o estado de carregamento por cerca de
   400 ms, a mensagem "Login simulado concluído" é anunciada (`role="status"`)
   e o demo navega para `/`.

Qualquer e-mail com formato válido e qualquer senha não vazia são aceitos.
"Lembrar-me (somente demonstração)" altera só um estado local da tela: nada é
gravado.

### Recuperação (`/esqueci-senha`)

1. A pessoa informa o e-mail e ativa **Enviar instruções simuladas**.
2. Com e-mail válido, aparece a confirmação "Envio simulado" (nenhum e-mail é
   enviado) e o botão **Continuar para redefinição** leva a `/redefinir-senha`.
3. **Voltar ao login** retorna a `/login`.

### Redefinição (`/redefinir-senha`)

1. A pessoa informa a nova senha e a confirmação. O `AdsPasswordInput` mostra a
   força (apenas orientativa) e a lista de regras com status em texto.
2. Ao ativar **Salvar senha simulada**, as regras e a confirmação são
   conferidas. Em caso de sucesso, aparece "Senha redefinida com sucesso
   (simulação)" e o botão **Voltar ao login**.

## Validações e mensagens simuladas

| Situação                            | Mensagem                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------- |
| E-mail vazio                        | `Informe o e-mail.`                                                       |
| E-mail sem formato válido           | `Informe um e-mail válido, como nome@exemplo.com.br.`                     |
| Senha vazia (login)                 | `Informe a senha.`                                                        |
| Regras da nova senha não atendidas  | `Atenda todos os requisitos da senha antes de continuar.`                 |
| Confirmação diferente da nova senha | `As senhas não coincidem.`                                                |
| Aviso fixo no topo de cada tela     | `Demonstração sem backend: nenhuma credencial é validada nem armazenada.` |

Regras da nova senha: pelo menos 8 caracteres, uma letra maiúscula e um número.
O formato do e-mail é verificado apenas por um padrão simples
(`texto@dominio.ext`, sem espaços). As mensagens e o atraso simulado ficam em
`apps/admin-demo/lib/auth-demo.ts`.

## O que não existe

- Backend, API, middleware de sessão ou proteção de rotas.
- Verificação de credenciais, usuários, e-mail real ou token de recuperação.
- Cookie, `localStorage`, `sessionStorage` ou qualquer armazenamento de e-mail,
  senha ou token. A única preferência guardada no navegador é a de tema
  (cookie `ads-theme`), compartilhada com o restante do demo.
- Componentes públicos novos: a composição é interna ao demo
  (`apps/admin-demo/app/auth/`) e não altera os pacotes `@admin-ds/*`.

## Componentes usados

De `@admin-ds/components`: `AdsField`, `AdsInput`, `AdsPasswordInput`,
`AdsCheckbox`, `AdsButton`, `AdsTypography` e `AdsThemeControl` (por meio do
controle de tema do demo). O layout, o painel e os espaçamentos usam as classes
`demo-auth-*` de `apps/admin-demo/app/globals.css`, apenas com variáveis
`--ads-*`.

## Tema e cor principal no SVG

As formas do painel não usam cores fixas. Os preenchimentos usam
`--ads-color-primary`, `--ads-color-surface` e tokens semânticos derivados por
`color-mix`. Por isso o painel acompanha:

- o tema claro ou escuro, com a mesma preferência do restante do demo (cookie
  `ads-theme`, mantida após recarregar);
- qualquer sobrescrita de `--ads-color-primary` feita pela aplicação, sem tema
  independente para as telas de autenticação.

## Como testar

- Manualmente: `npm run dev --workspace @admin-ds/admin-demo` e abra `/login`
  (ou use **Login (exemplo)** na navegação).
- Unitários: `npm run test:quiet` (validação em `auth-validation.test.ts` e
  navegação em `auth-navigation.test.tsx`, em `apps/admin-demo/tests`).
- E2E do fluxo, em Chromium:
  `CI=1 npx playwright test e2e/auth-demo.spec.ts --project=chromium`.
  O spec cobre login, validações, recuperação e redefinição, histórico do
  navegador, tema e cor principal, ausência de credenciais armazenadas, layout
  em 375 px, 500 px e 700 px sem rolagem horizontal, painel à direita no
  desktop e auditoria de acessibilidade nos dois temas.

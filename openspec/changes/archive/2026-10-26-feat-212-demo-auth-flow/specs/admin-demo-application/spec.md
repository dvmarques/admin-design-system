# Spec Delta

## ADDED Requirements

### Requirement: Entrada do demo permanece sem autenticação

O admin-demo MUST manter `/` e todas as rotas administrativas existentes acessíveis sem login, sem redirecionamento automático para autenticação e sem middleware de sessão.

#### Scenario: Pessoa abre a visão geral

- **WHEN** a pessoa abre `/`
- **THEN** a visão geral administrativa é exibida com o shell habitual, sem exigir credenciais

#### Scenario: Pessoa navega entre rotas administrativas

- **WHEN** a pessoa percorre links da navegação principal do demo
- **THEN** nenhuma rota administrativa exige login nem bloqueia o conteúdo

### Requirement: Link opcional para o exemplo de login

O admin-demo MUST oferecer na navegação principal, na seção de exemplos de aplicação, um link acessível para o exemplo de login, sem remover ou ocultar os destinos existentes.

#### Scenario: Link na navegação

- **WHEN** a pessoa abre a navegação do demo em desktop ou no menu móvel
- **THEN** um item leva a `/login` com nome que identifica o exemplo de login

### Requirement: Rotas de autenticação fora do shell administrativo

O admin-demo MUST expor `/login`, `/esqueci-senha` e `/redefinir-senha` sem `AdsAdminShell`, com link visível **Voltar ao Demo** para `/` e controle de tema alinhado ao restante da aplicação.

#### Scenario: Layout sem sidebar

- **WHEN** a pessoa abre `/login`
- **THEN** não há sidebar administrativa nem cabeçalho do shell, e **Voltar ao Demo** está disponível

#### Scenario: Voltar ao demo

- **WHEN** a pessoa ativa **Voltar ao Demo** em qualquer rota de autenticação
- **THEN** a visão geral administrativa é exibida sem exigir login

### Requirement: Layout split com painel abstrato e logo oficial

As rotas de autenticação MUST usar layout dividido em viewport ampla: formulário à esquerda (~45% da largura útil) e painel decorativo à direita (~55%) com SVG abstrato leve, logo oficial do projeto e cores derivadas de tokens semânticos `--ads-*` (incluindo `--ads-color-primary`), sem cores hexadecimais fixas no SVG decorativo e sem pré-visualização do dashboard.

#### Scenario: Desktop com tema e cor primária

- **WHEN** a pessoa abre `/login` em largura desktop com tema claro ou escuro e com `--ads-color-primary` sobrescrito no escopo do documento
- **THEN** o painel decorativo reflete o tema e a cor primária configurada

#### Scenario: Mobile prioriza o formulário

- **WHEN** a pessoa abre uma rota de autenticação em largura de celular
- **THEN** o painel decorativo não compete com o formulário (oculto ou simplificado) e o formulário permanece legível sem rolagem horizontal da página

### Requirement: Login demonstrativo

A rota `/login` MUST oferecer campos de e-mail e senha (com mostrar/ocultar senha), opção **Lembrar-me** apenas demonstrativa, link para recuperação de senha, botão de entrar e mensagens que deixem claro que a autenticação é simulada. O envio válido MUST aceitar e-mail em formato válido e senha não vazia, exibir loading simulado breve e navegar para `/` sem validar usuário real nem persistir credenciais.

#### Scenario: Envio inválido

- **WHEN** a pessoa envia o formulário com e-mail inválido ou senha vazia
- **THEN** os erros são exibidos junto aos campos de forma acessível e nenhuma navegação para o demo ocorre

#### Scenario: Envio válido simulado

- **WHEN** a pessoa envia e-mail válido e senha não vazia
- **THEN** um estado de carregamento simulado é apresentado e, ao concluir, a pessoa é levada à visão geral do demo sem criar sessão real

### Requirement: Recuperação de senha simulada

A rota `/esqueci-senha` MUST solicitar e-mail, validar formato, simular confirmação de envio sem backend, oferecer continuar para redefinição e link para voltar ao login, com mensagens de demonstração acessíveis.

#### Scenario: E-mail inválido

- **WHEN** a pessoa envia um e-mail com formato inválido
- **THEN** o campo é marcado como inválido com mensagem associada

#### Scenario: Confirmação simulada

- **WHEN** a pessoa envia um e-mail válido
- **THEN** uma confirmação de envio simulado é apresentada com o foco movido para a mensagem e links permitem ir para `/redefinir-senha` ou `/login`

### Requirement: Redefinição de senha simulada

A rota `/redefinir-senha` MUST oferecer nova senha e confirmação com feedback de regras/força conforme `AdsPasswordInput`, validar coincidência e regras localmente, simular sucesso sem persistir senha e permitir retorno ao login.

#### Scenario: Confirmação divergente

- **WHEN** a pessoa envia senhas que não coincidem
- **THEN** um erro acessível é exibido junto ao campo correspondente, com o foco nele, e a senha não é tratada como redefinida

#### Scenario: Sucesso simulado

- **WHEN** a pessoa envia senha e confirmação válidas segundo as regras demonstrativas
- **THEN** uma mensagem de sucesso simulado é apresentada com o foco movido para ela e a pessoa pode voltar ao login por um link

### Requirement: Fluxo navegável com histórico e recarga

O fluxo de autenticação MUST funcionar com links, recarga da página e histórico do navegador, preservando a preferência de tema do demo e sem armazenar senha, token ou credenciais em cookies, `localStorage` ou `sessionStorage`, e sem colocar valores digitados na URL quando o envio nativo ocorrer sem JavaScript ou antes da hidratação.

#### Scenario: Navegação por links e voltar

- **WHEN** a pessoa percorre login, recuperação e redefinição por links e usa o botão voltar do navegador
- **THEN** cada etapa anterior é exibida corretamente

#### Scenario: Tema após recarga

- **WHEN** a pessoa escolhe um tema no fluxo de autenticação e recarrega a página
- **THEN** a mesma preferência de tema do demo é restaurada

#### Scenario: Ausência de armazenamento de credenciais

- **WHEN** a pessoa conclui login ou redefinição simulados
- **THEN** nenhum cookie, entrada de `localStorage` ou de `sessionStorage` contém senha ou token de autenticação

#### Scenario: Envio nativo sem JavaScript

- **WHEN** a pessoa envia um formulário de autenticação sem JavaScript ou antes da hidratação
- **THEN** a URL resultante não contém e-mail nem senha digitados

### Requirement: Acessibilidade e responsividade do fluxo de autenticação

Cada rota de autenticação MUST ter título principal único, controles operáveis por teclado, foco visível e auditoria automatizada sem violações nos temas claro e escuro em larguras de celular e desktop.

#### Scenario: Auditoria automatizada

- **WHEN** cada rota de autenticação é auditada com verificação automatizada de acessibilidade nos temas claro e escuro, em larguras de 320 px, 375 px e desktop, inclusive após erro de validação e após sucesso simulado
- **THEN** nenhuma violação é reportada

#### Scenario: Operação por teclado

- **WHEN** a pessoa preenche o formulário e percorre os controles com Tab até o botão de envio e ativa com Enter
- **THEN** o envio simulado ocorre sem uso do ponteiro

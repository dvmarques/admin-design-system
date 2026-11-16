## ADDED Requirements

### Requirement: Hardening parcial explícito no site estático

O Admin Demo e o Storybook publicados MUST fornecer uma política de segurança compatível com documentos HTML estáticos que restrinja incorporação de objetos, uso de bases externas de URL e envio de formulários para origens não autorizadas, e MUST deixar explícitos os limites dessa proteção.

#### Scenario: Demo é aberto no GitHub Pages

- **WHEN** uma pessoa abre qualquer rota estática do Admin Demo
- **THEN** o documento contém CSP via meta com `object-src 'none'`, `base-uri 'self'` e `form-action 'self'`, sem alegar proteção de scripts ou contra clickjacking

#### Scenario: Storybook carrega manager e preview

- **WHEN** o Storybook carrega seu manager e o iframe das stories
- **THEN** ambos os documentos contêm a mesma CSP parcial e os componentes, estilos, módulos e conteúdo de Shiki continuam funcionando

#### Scenario: Navegação para outro domínio

- **WHEN** o demo ou o Storybook navega para um destino externo
- **THEN** o documento limita referrer a `strict-origin-when-cross-origin`; links em nova aba preservam `noopener`

### Requirement: Publicação preserva os fluxos e explica limites do host

A publicação MUST preservar tema inicial, hidratação, destaque de código e telas demonstrativas sem persistir credenciais; qualquer controle dependente de headers HTTP MUST ser documentado como não aplicado por configuração local do GitHub Pages.

#### Scenario: Tema persistido e componente com Shiki

- **WHEN** uma pessoa recarrega o demo publicado com tema escuro salvo e visita o exemplo de código destacado
- **THEN** tema e hidratação permanecem corretos e o código recebe destaque sem erros do navegador

#### Scenario: Usuário experimenta o login demonstrativo

- **WHEN** uma pessoa abre login, recuperação e redefinição de senha no demo
- **THEN** as telas continuam públicas e simuladas, sem backend de credenciais ou proteção real de rotas

#### Scenario: Equipe consulta proteção contra clickjacking

- **WHEN** a equipe avalia o site hospedado no GitHub Pages
- **THEN** a documentação distingue uma CSP parcial por meta de uma política de headers reais e indica hospedagem/proxy para `frame-ancestors` e demais políticas não representáveis em meta

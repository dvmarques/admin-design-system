# library-distribution Specification

## Purpose

Definir um contrato de distribuição estável para JavaScript, tipos e estilos, permitindo que aplicações instalem e consumam a biblioteca sem conhecer sua estrutura interna.

## Requirements

### Requirement: Pontos de entrada públicos

Cada pacote distribuível MUST declarar pontos de entrada públicos para seu código executável, tipos TypeScript e estilos aplicáveis.

#### Scenario: Consumidor importa uma API pública

- **WHEN** uma aplicação importa uma exportação documentada de um pacote
- **THEN** o módulo e seus tipos são resolvidos sem usar caminhos internos

### Requirement: CSS pronto para consumo

A biblioteca MUST distribuir CSS compilado contendo os estilos necessários aos componentes publicados.

#### Scenario: Aplicação sem Tailwind CSS consome a biblioteca

- **WHEN** uma aplicação importa o CSS público e renderiza um componente
- **THEN** o componente recebe seus estilos sem que a aplicação instale ou configure Tailwind CSS

### Requirement: Independência de varredura do consumidor

A aplicação consumidora MUST NOT precisar incluir o código-fonte da biblioteca em mecanismos de descoberta ou geração de classes CSS.

#### Scenario: Build da aplicação processa somente seus próprios arquivos

- **WHEN** o build da aplicação não examina arquivos internos do pacote
- **THEN** todos os estilos documentados da biblioteca continuam disponíveis

### Requirement: Ausência de efeitos globais não documentados

Os estilos distribuídos MUST NOT redefinir globalmente elementos da aplicação consumidora fora dos efeitos explicitamente documentados.

#### Scenario: Aplicação importa os estilos de componentes

- **WHEN** a folha de estilos pública é carregada
- **THEN** elementos externos ao design system não recebem resets ou alterações globais não documentadas

### Requirement: Dependências de integração declaradas

O pacote MUST declarar dependências obrigatórias, opcionais e peer dependencies de modo que o gerenciador de pacotes possa detectar integrações incompatíveis. Integrações opcionais em subpaths MUST NOT exigir suas dependências de runtime no entrypoint principal.

#### Scenario: Versão incompatível de React é utilizada

- **WHEN** uma aplicação instala o pacote com uma versão de React fora da faixa suportada
- **THEN** o gerenciador de pacotes consegue emitir o alerta de incompatibilidade correspondente

#### Scenario: Integração de máscara não instalada

- **WHEN** uma aplicação consome apenas o entrypoint raiz de `@admin-ds/components` e não instala `react-imask`
- **THEN** os imports, tipos, execução, build e bundle do pacote raiz permanecem funcionais sem exigir a dependência opcional

#### Scenario: Integração de máscara instalada

- **WHEN** uma aplicação opta pelo subpath `@admin-ds/components/masked-input` e instala a versão peer opcional declarada
- **THEN** consegue resolver o subpath e seus tipos sem imports internos ou dependências transitivas implícitas

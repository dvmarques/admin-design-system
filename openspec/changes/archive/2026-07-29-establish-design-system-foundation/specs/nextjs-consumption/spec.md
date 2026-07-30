## Purpose

Garantir que os pacotes do design system possam ser consumidos por aplicações Next.js com App Router, respeitando renderização no servidor e hidratação no cliente.

## ADDED Requirements

### Requirement: Consumo pelo App Router

A biblioteca MUST permitir que uma aplicação Next.js com App Router importe suas APIs públicas e seus estilos globais por caminhos documentados.

#### Scenario: Aplicação Next.js executa build de produção

- **WHEN** a aplicação de referência importa os pacotes apenas por pontos de entrada públicos
- **THEN** o build de produção é concluído sem configuração baseada em caminhos internos do workspace

### Requirement: Compatibilidade com renderização no servidor

Componentes que não exigem estado, efeitos, eventos ou APIs do navegador MUST ser consumíveis em um contexto de Server Component.

#### Scenario: Componente estático é renderizado no servidor

- **WHEN** um Server Component importa e renderiza um componente estático compatível
- **THEN** o componente é produzido sem exigir que seu consumidor seja convertido em Client Component

### Requirement: Limite explícito de componentes interativos

Componentes que exigem execução no navegador MUST expor um ponto de entrada compatível com Client Components e documentar esse requisito.

#### Scenario: Componente interativo é utilizado

- **WHEN** uma aplicação renderiza um componente que depende de interação no navegador
- **THEN** o componente funciona dentro de um limite de Client Component explicitamente identificável

### Requirement: Hidratação consistente

Os componentes MUST produzir marcação inicial determinística para as mesmas propriedades e o mesmo estado de tema disponíveis no servidor e no cliente.

#### Scenario: Página é hidratada

- **WHEN** o servidor e o cliente recebem as mesmas propriedades e configuração inicial de tema
- **THEN** a hidratação ocorre sem divergência de marcação atribuível ao design system

### Requirement: Aplicação de referência

O projeto MUST manter uma aplicação Next.js de referência que consuma os artefatos distribuíveis como uma aplicação externa.

#### Scenario: Contrato público é verificado

- **WHEN** o pipeline valida a aplicação de referência
- **THEN** imports internos ou dependências implícitas do workspace fazem a validação falhar

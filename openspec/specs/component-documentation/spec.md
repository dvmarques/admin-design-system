# component-documentation Specification

## Purpose

Assegurar que cada API pública do design system possua documentação navegável, exemplos executáveis e orientação suficiente para adoção consistente.

## Requirements

### Requirement: Documentação de APIs públicas

Cada componente público MUST documentar propósito, propriedades, valores padrão, variantes, estados suportados e requisitos de acessibilidade.

#### Scenario: Desenvolvedor consulta um componente

- **WHEN** o desenvolvedor abre a documentação do componente
- **THEN** ele encontra a API pública e as orientações necessárias para o uso básico

### Requirement: Exemplos visuais executáveis

Cada componente público MUST possuir exemplos executáveis no catálogo visual para seus estados e variantes relevantes.

#### Scenario: Componente possui variantes

- **WHEN** um componente oferece mais de uma variante pública
- **THEN** o catálogo apresenta exemplos que permitem comparar visualmente essas variantes

### Requirement: Cobertura dos temas

Os exemplos visuais MUST permitir verificar o componente nos temas claro e escuro.

#### Scenario: Tema do catálogo é alternado

- **WHEN** o usuário alterna o tema no catálogo
- **THEN** o exemplo ativo é renderizado com os tokens do tema selecionado

### Requirement: Exemplos de estados não ideais

Componentes que suportam estados como desabilitado, carregamento, erro ou vazio MUST documentar e demonstrar os estados aplicáveis.

#### Scenario: Componente suporta estado desabilitado

- **WHEN** o desenvolvedor consulta os exemplos do componente
- **THEN** existe um exemplo que demonstra sua aparência e comportamento desabilitado

### Requirement: Documentação de integração

O catálogo MUST documentar como instalar os pacotes, importar estilos, aplicar temas e consumir a biblioteca em uma aplicação Next.js.

#### Scenario: Novo consumidor inicia a integração

- **WHEN** um desenvolvedor segue a documentação publicada
- **THEN** ele consegue renderizar um exemplo usando apenas pontos de entrada públicos

### Requirement: Histórias atualizadas para a fundação visual

O catálogo visual MUST atualizar as histórias dos componentes existentes afetados para demonstrar a tipografia, os papéis de cor e os estados semânticos revisados, sem introduzir componentes novos.

#### Scenario: Desenvolvedor revisa um componente existente no catálogo

- **WHEN** o desenvolvedor abre uma história afetada pela fundação visual
- **THEN** ele pode verificar seus estados representativos nos temas claro e escuro com os tokens revisados

### Requirement: Catálogo demonstra overlays e controles de fechar nos dois temas

As histórias de dialog, drawer e toast MUST permitir verificar a superfície da caixa e os estados padrão, hover e foco do controle de fechar nos temas claro e escuro.

#### Scenario: Desenvolvedor alterna o tema de uma história de overlay

- **WHEN** o tema da história muda entre claro e escuro com o overlay aberto
- **THEN** a caixa e o controle de fechar refletem imediatamente o novo tema com contraste verificável

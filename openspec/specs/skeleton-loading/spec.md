# skeleton-loading Specification

## Purpose

Disponibilizar placeholders esqueletais reutilizáveis para comunicar carregamento de conteúdo com estrutura previsível em interfaces administrativas.

## Requirements

### Requirement: Skeleton acessível e tematizável

O sistema MUST fornecer um componente público prefixado por Ads para representar carregamento esqueletal, com dimensões personalizáveis, semântica acessível opcional e suporte aos temas claro e escuro.

#### Scenario: Conteúdo estruturado está carregando

- **WHEN** uma aplicação renderiza o skeleton no lugar de conteúdo cuja estrutura é conhecida
- **THEN** o placeholder mantém o espaço visual esperado, comunica carregamento sem depender apenas de animação e respeita redução de movimento

### Requirement: Variantes de altura do skeleton

`AdsSkeleton` MUST aceitar a prop opcional `variant` (`"text"`, `"value"` ou `"block"`), que define a altura pelo token público de skeleton correspondente, e MUST continuar aceitando dimensões próprias por `className`. Sem `variant`, a marcação MUST permanecer a atual.

#### Scenario: Skeleton com variante

- **WHEN** `variant="value"` é informado
- **THEN** o placeholder usa a altura do token de skeleton de valor e mantém a semântica acessível atual

#### Scenario: Skeleton sem variante

- **WHEN** nenhuma variante é informada
- **THEN** a marcação e as classes são as mesmas de antes

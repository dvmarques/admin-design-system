## Purpose

Disponibilizar placeholders esqueletais reutilizáveis para comunicar carregamento de conteúdo com estrutura previsível em interfaces administrativas.

## ADDED Requirements

### Requirement: Skeleton acessível e tematizável

O sistema MUST fornecer um componente público prefixado por `Ads` para representar carregamento esqueletal, com dimensões personalizáveis, semântica acessível opcional e suporte aos temas claro e escuro.

#### Scenario: Conteúdo estruturado está carregando

- **WHEN** uma aplicação renderiza o skeleton no lugar de conteúdo cuja estrutura é conhecida
- **THEN** o placeholder mantém o espaço visual esperado, comunica carregamento sem depender apenas de animação e respeita redução de movimento

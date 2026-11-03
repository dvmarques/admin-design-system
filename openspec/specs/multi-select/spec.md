# multi-select Specification

## Purpose

Disponibilizar às aplicações administrativas um seletor de múltiplas opções acessível, com busca local, chips removíveis, limites de escolha, estados de loading, vazio, erro e desabilitado, e serialização compatível com formulários nativos, em modos controlado e não controlado.

## Requirements

### Requirement: AdsMultiSelect oferece seleção múltipla pesquisável e pública

O sistema MUST exportar `AdsMultiSelect`, `AdsMultiSelectProps` e `AdsMultiSelectOption` por `@dvmarques/admin-ds-components`, com valores independentes dos rótulos, modo controlado ou não controlado e sem dependência de backend.

#### Scenario: Alternar opções e apresentar chips

- **WHEN** a pessoa seleciona várias opções habilitadas por mouse ou teclado
- **THEN** cada valor aparece como chip rotulado e removível, sem duplicação nem mudança dos demais

#### Scenario: Remover e limpar escolhas

- **WHEN** a pessoa aciona o botão de remover de um chip, Backspace com consulta vazia ou limpar tudo
- **THEN** os valores correspondentes saem da seleção e o callback recebe a lista completa atualizada, sem mutar valores fornecidos

#### Scenario: Controlado versus não controlado

- **WHEN** o consumidor fornece `value` (inclusive um array vazio) ou usa `defaultValue`
- **THEN** o componente preserva o contrato de confirmação pelo consumidor ou gerencia apenas o próprio estado, respectivamente

#### Scenario: Limite de escolhas

- **WHEN** `maxSelections` é alcançado
- **THEN** novas seleções são impedidas, mas chips podem ser removidos ou escolhas limpas

### Requirement: Busca, estados e acessibilidade observáveis

O controle MUST oferecer pesquisa local, rolagem e destaque de opções, opções desabilitadas e estados vazio, loading, error, disabled, readOnly, ARIA e foco operáveis sem mouse.

#### Scenario: Filtrar e navegar por teclado

- **WHEN** a pessoa digita, usa ArrowDown/ArrowUp, Enter, Escape ou Tab
- **THEN** o filtro não elimina valores já escolhidos, a seleção respeita opções desabilitadas, o foco e o estado expandido são consistentes, Escape fecha e Tab não é retido

#### Scenario: Estados sem opções disponíveis

- **WHEN** não há correspondência, ocorre loading ou o consumidor informa error
- **THEN** o painel apresenta mensagem reconhecível e não confirma opção inválida

#### Scenario: Label, descrição e mensagem de erro

- **WHEN** `AdsMultiSelect` é usado em `AdsField` com label, description e error
- **THEN** input e lista têm nomes, relações e estados acessíveis sem IDs duplicados, com feedback de validação perceptível

#### Scenario: Temas e tamanhos de tela

- **WHEN** o componente é usado em claro/escuro, alto contraste, zoom 200% e viewport estreita
- **THEN** chips, campos e opções permanecem legíveis, utilizáveis e sem conteúdo essencial recortado

### Requirement: Formulários e consumidores integram a multisseleção

O sistema MUST manter valores tipados e exportados, respeitar `name`, `required`, `disabled` e reset, e fornecer exemplos executáveis no Admin Demo e Storybook.

#### Scenario: Serializar várias escolhas

- **WHEN** um formulário contém o seletor com `name="categorias"` e valores `["a","b"]`
- **THEN** `FormData.getAll("categorias")` devolve `["a","b"]`, sem serializar labels ou consulta, e um controle desabilitado não envia valores

#### Scenario: Campo obrigatório e reset

- **WHEN** o seletor obrigatório não possui escolha ou um formulário não controlado é resetado
- **THEN** a validação sinaliza a ausência sem depender só de campos hidden e o valor inicial é restaurado no reset

#### Scenario: Catálogo na mesma PR

- **WHEN** o consumidor visita `/catalogo/multi-select` ou o Storybook
- **THEN** consegue exercitar seleção, busca, remoção, limpeza, limite, controlado, loading, erro, vazio, disabled e formulário com dados de exemplo

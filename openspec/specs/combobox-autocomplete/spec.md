# combobox-autocomplete Specification

## Purpose

Definir o comportamento observável de AdsCombobox e AdsAutocomplete: seleção única acessível e pesquisável, com valor separado do texto digitado, busca local ou assíncrona com debounce e descarte de respostas obsoletas, e opções com ícone ou avatar opcionais.

## Requirements

### Requirement: Seleção acessível de uma opção

O sistema SHALL exportar AdsCombobox para escolha de uma opção por value independente do label, com modo controlado ou não controlado e renderização customizável.

#### Scenario: Navegação e seleção

- **WHEN** a pessoa digita ou usa ArrowDown ou ArrowUp no campo
- **THEN** o destaque acompanha opções habilitadas sem mover o foco do campo; Home e End preservam a edição de texto
- **WHEN** pressiona Enter
- **THEN** a opção destacada é selecionada, o menu fecha e o foco permanece no campo
- **WHEN** pressiona Escape
- **THEN** o menu fecha sem alterar o valor selecionado

### Requirement: Texto pesquisado e valor selecionado independentes

O sistema SHALL manter inputValue diferente de value, suportar estado controlado/não controlado, limpeza e submissão de formulário.

#### Scenario: Digitação e limpeza

- **WHEN** o usuário altera o texto após selecionar um valor
- **THEN** o texto pesquisado muda sem converter texto livre em valor selecionado
- **WHEN** limpa uma seleção
- **THEN** o valor e o texto são esvaziados e o foco retorna ao campo
- **WHEN** o formulário é submetido com name configurado
- **THEN** o value selecionado é submetido sem depender do label

### Requirement: Busca síncrona e assíncrona

O sistema SHALL disponibilizar AdsAutocomplete com filtragem local e busca remota optativa, debounce configurável, loading, vazio e erro.

#### Scenario: Digitação rápida

- **WHEN** duas pesquisas remotas retornam fora de ordem
- **THEN** apenas o resultado da consulta atual fica visível, sem duplicação de seleções
- **WHEN** a consulta é cancelada por desmontagem ou edição posterior
- **THEN** seus resultados e erros antigos não alteram a interface

#### Scenario: Estados remotos

- **WHEN** a consulta está em andamento, não retorna resultados ou falha
- **THEN** o campo apresenta loading, vazio ou erro respectivamente, com feedback acessível

### Requirement: Integração visual e acessibilidade

O sistema SHALL utilizar ARIA combobox/listbox, AdsField, tamanhos existentes, CSS distribuído e temas claro/escuro, sem depender do backend.

#### Scenario: Uso em diálogo e Next.js

- **WHEN** o campo aparece em AdsDialog ou contêiner com overflow e recebe foco
- **THEN** a lista permanece visível em portal na camada correta e acompanha scroll
- **WHEN** o componente é renderizado no servidor e hidratado no cliente
- **THEN** não gera IDs duplicados nem acessa document durante SSR
- **WHEN** AdsField aplica descrição ou erro
- **THEN** o campo expõe as relações aria-describedby e aria-invalid

### Requirement: Exemplos demonstráveis na mesma entrega

O sistema SHALL apresentar exemplos funcionais no Admin Demo e Storybook com teclado, estados e uma origem remota simulada.

#### Scenario: Catálogo navegável

- **WHEN** a pessoa acessa o catálogo do Admin Demo
- **THEN** encontra páginas demonstráveis para AdsCombobox e AdsAutocomplete e pode testar busca local, remota, erro, vazio, loading e dados fora de ordem.

### Requirement: Elementos visuais opcionais

As opções MAY incluir ícones ou imagens com fallback e o consumidor MUST poder habilitar ou desabilitar sua exibição sem alterar valores ou nomes acessíveis.

#### Scenario: Exibição e seleção

- **WHEN** uma opção com elemento visual é selecionada
- **THEN** o elemento acompanha o texto selecionado e o formulário envia somente o valor da opção
- **WHEN** a exibição é desabilitada ou a opção não tem elemento visual
- **THEN** nenhum espaço é reservado para o elemento

#### Scenario: Imagem indisponível e busca remota

- **WHEN** a imagem falha ou a opção selecionada deixa os resultados remotos
- **THEN** o fallback ou o elemento da opção selecionada permanece disponível

#### Scenario: Teclado e acessibilidade

- **WHEN** uma pessoa navega pelas opções com teclado ou leitor de tela
- **THEN** os elementos decorativos não duplicam o nome acessível e os estados são preservados nos temas e tamanhos suportados

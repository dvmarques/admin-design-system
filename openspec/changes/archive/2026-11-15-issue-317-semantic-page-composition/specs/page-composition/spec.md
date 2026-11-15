## ADDED Requirements

### Requirement: Cabeçalho semântico independente da aplicação

O ADS MUST fornecer um cabeçalho de página opcional, reutilizável e aditivo que renderize um `header` com heading principal `h1`, descrição e ações opcionais e atributos HTML de cabeçalho sem impor um card, roteamento, autenticação nem dependências novas.

#### Scenario: Título, descrição e ações

- **WHEN** o consumidor renderiza `AdsPageHeader` com título, descrição e ações
- **THEN** o DOM contém um `header` com exatamente um `h1` interno, um parágrafo descritivo e os controles fornecidos na ordem DOM

#### Scenario: Slots opcionais e atributos nativos

- **WHEN** descrição e ações são omitidas ou o consumidor fornece atributos de header
- **THEN** o título permanece um `h1`, os grupos opcionais não aparecem e os atributos nativos são preservados

### Requirement: Reflow e tokens em cabeçalhos

O cabeçalho MUST suportar títulos e descrições longas e ações múltiplas sem overflow horizontal indevido, utilizando o CSS distribuído e tokens visuais existentes nos temas claro e escuro.

#### Scenario: Viewport estreita e conteúdo longo

- **WHEN** o componente é renderizado com conteúdo longo em 320px, 390px, 768px, desktop ou largura efetiva reduzida por zoom
- **THEN** texto e ações quebram linhas sem serem recortados, preservando a ordem e foco dos controles

### Requirement: Composição de páginas sem card obrigatório

A documentação e as demonstrações MUST distinguir estrutura semântica de aparência visual, usar H1 de página, H2 de seções e H3/H4 de subseções pertinentes, e reservar `AdsCard` para conteúdo autocontido e `AdsSurface` para delimitação visual.

#### Scenario: Página de consulta

- **WHEN** uma pessoa abre o exemplo de consulta
- **THEN** encontra heading de página, seção rotulada, filtros e tabela sem wrapper obrigatório de card

#### Scenario: Formulário em seções

- **WHEN** a pessoa abre o exemplo de formulário e tenta enviar dados inválidos
- **THEN** visualiza seções com headings coerentes, mensagens de validação e ações acessíveis

#### Scenario: Dashboard

- **WHEN** uma pessoa abre o dashboard de exemplo
- **THEN** os cards aparecem apenas para indicadores e resumos, e o restante da página mantém sua hierarquia semântica

### Requirement: Uso nos dois modos de consumo

O cabeçalho MUST funcionar tanto em `AdsAdminShell.Main` quanto em um `main` de aplicação que importe somente `components` e `tokens`, sem quebra de SSR/hidratação.

#### Scenario: Renderização no servidor e hidratação

- **WHEN** o cabeçalho é renderizado no servidor e hidratado com as mesmas props
- **THEN** sua hierarquia HTML permanece consistente sem warnings de mismatch e sem adicionar landmarks main duplicados

# Spec Delta

## ADDED Requirements

### Requirement: Logotipo oficial em SVG como fonte da marca

O projeto MUST manter o logotipo oficial como um arquivo SVG em `assets/brand` e MUST tratá-lo como a única fonte do desenho da marca. A paleta do logotipo MUST ser independente da escala `brand*` dos tokens e MUST NOT alterar as cores da interface.

#### Scenario: Pessoa abre o logotipo oficial

- **WHEN** uma pessoa abre o arquivo SVG do logotipo oficial
- **THEN** ela vê o símbolo "A" branco com recorte lilás sobre um quadrado roxo profundo de cantos arredondados, sem fio claro na junção das duas cores

#### Scenario: Tokens e interface permanecem inalterados

- **WHEN** o logotipo é aplicado ao projeto
- **THEN** a escala `brand*`, a cor primária e os temas da interface continuam os mesmos

### Requirement: Variantes da marca para usos distintos

O projeto MUST oferecer, além do logotipo completo, uma variante sem fundo para superfícies escuras, uma variante chapada para tamanhos pequenos de favicon e lockups com o nome em versões para fundo claro e escuro. O favicon MUST permanecer legível em 16 e 32 pixels.

#### Scenario: Marca sobre superfície escura

- **WHEN** a variante sem fundo é exibida sobre uma superfície escura
- **THEN** o símbolo branco e lilás permanece visível sem um quadrado de fundo

#### Scenario: Favicon em tamanho pequeno

- **WHEN** o favicon é exibido em 16 ou 32 pixels
- **THEN** o símbolo "A" e o recorte lilás permanecem distinguíveis

#### Scenario: README em tema claro ou escuro

- **WHEN** a página principal do repositório é exibida em tema claro ou escuro do GitHub
- **THEN** o lockup com o nome é exibido com texto legível sobre o fundo do tema

### Requirement: Versão raster derivada do SVG

O projeto MUST disponibilizar o logotipo em PNG com fundo transparente, gerado a partir do SVG oficial, e o PNG MUST reproduzir o mesmo desenho do SVG.

#### Scenario: PNG e SVG apresentam o mesmo desenho

- **WHEN** o PNG e o SVG do logotipo são comparados na mesma dimensão
- **THEN** o desenho central é equivalente, exceto por diferenças de antialiasing, e os cantos do PNG são transparentes

### Requirement: Logotipo acessível

Os arquivos SVG do logotipo MUST expor nome e descrição acessíveis em português quando exibidos de forma independente e MUST usar identificadores internos únicos para não colidir quando incluídos na mesma página. Quando exibido ao lado do texto do nome do projeto, o logotipo MUST ser tratado como decorativo.

#### Scenario: Logotipo exibido sozinho

- **WHEN** um SVG do logotipo é exibido de forma independente
- **THEN** ele expõe o nome "Admin Design System" e uma descrição em português

#### Scenario: Logotipo ao lado do nome

- **WHEN** o logotipo é exibido junto ao texto "Admin Design System"
- **THEN** tecnologias assistivas anunciam o nome uma única vez

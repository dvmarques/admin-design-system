## MODIFIED Requirements

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

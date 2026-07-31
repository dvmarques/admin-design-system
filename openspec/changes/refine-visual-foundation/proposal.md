## Why

Os componentes atuais precisam de uma fundação visual mais coesa para transmitir uma interface administrativa moderna, limpa e legível em temas claro e escuro. Consolidar as decisões globais em tokens semânticos permite que aplicações consumidoras recebam o refinamento de forma consistente, preservando a capacidade de personalização sem recompilar a biblioteca.

## What Changes

- Revisar os tokens globais públicos de tipografia, cores e estados, mantendo a nomenclatura pública estável sempre que possível.
- Adotar uma pilha tipográfica moderna formada apenas por fontes de licença livre para uso e distribuição comercial, com tokens documentados para família, tamanho, peso e altura de linha.
- Definir uma escala tipográfica responsiva e previsível para texto e títulos, com pesos adequados à hierarquia de interfaces administrativas.
- Refinar as paletas semânticas completa para os temas claro e escuro, incluindo superfícies, conteúdo, bordas, foco, cores de marca e estados informativo, sucesso, aviso e erro.
- Estabelecer pares de cor e critérios mensuráveis de contraste WCAG 2.2 AA para conteúdo, controles, estados e foco nos dois temas.
- Atualizar as histórias do Storybook e os snapshots visuais dos componentes existentes para cobrir temas e estados representativos.
- Refinar a proporção, densidade e hierarquia visual dos componentes existentes com PrimeReact como referência principal, seguido por shadcn/ui, Ant Design e Chakra UI. As referências orientam princípios públicos de design; não serão copiados código-fonte, temas, ativos ou materiais proprietários.
- Não criar componentes, variantes ou APIs de componentes novos; o escopo limita-se aos componentes e contratos já existentes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `typography`: definir uma fundação tipográfica moderna, com pilha de fontes, escala, pesos e tokens públicos documentados.
- `theming`: atualizar os conjuntos semânticos claro e escuro, os estados de cor e os critérios de contraste acessível.
- `design-tokens`: ampliar e refinar os valores semânticos globais consumidos pelos componentes, preservando os contratos públicos.
- `quality-assurance`: exigir atualização da validação visual e cobertura de contraste para a fundação revisada.
- `component-documentation`: atualizar histórias executáveis dos componentes existentes e sua cobertura de temas e estados.

## Impact

- Biblioteca reutilizável: tokens CSS públicos `--ads-*`, metadados TypeScript e estilos compilados distribuídos pelos pacotes.
- Componentes existentes: aparência, legibilidade e estados visuais passam a refletir os tokens globais revisados, sem adicionar novas famílias de componentes.
- Aplicação de demonstração e Storybook: histórias e snapshots visuais serão atualizados para os temas claro e escuro.
- Aplicações consumidoras: recebem uma aparência mais consistente por meio dos tokens; qualquer remoção ou renomeação de token será tratada como alteração incompatível e acompanhada de orientação de migração.

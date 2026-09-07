## Why

O admin-demo já comprova o consumo público da biblioteca, mas ainda mostra poucos estados e fluxos completos para avaliar os componentes em uma interface administrativa real. Ampliar essa referência torna mais fácil identificar incoerências visuais, responsivas e de interação antes de adoções pelas aplicações consumidoras.

## What Changes

- Ampliar o admin-demo com um cenário de carregamento estruturado que utilize AdsSkeleton e explique sua relação com AdsLoadingIndicator.
- Expor, no fluxo de formulário existente, estados de validação, sucesso, somente leitura e indisponibilidade em ambos os temas.
- Demonstrar um fluxo destrutivo completo com confirmação em dialog e feedback por toast, incluindo variantes de informação, aviso e erro.
- Tornar os cenários de componentes já publicados intencionalmente avaliáveis em larguras reduzidas, preservando o tema ativo e sem alterar o Storybook ou APIs públicas da biblioteca.

Fora do escopo:

- Criar novas famílias de componentes, como tabela, sidebar ou shell administrativo.
- Alterar contratos, variantes ou APIs públicas de componentes existentes.
- Redesenhar stories, configuração ou documentação do Storybook.
- Integrar dados remotos, roteamento de negócio, persistência ou dependências de runtime.

## Capabilities

### New Capabilities

- admin-demo-evaluation: cenários administrativos compostos, interativos e responsivos que validam o consumo público dos componentes no admin-demo.

### Modified Capabilities

Nenhuma.

## Impact

- Aplicação afetada: apps/admin-demo.
- Componentes consumidos: formulários, skeleton, loading indicator, button, dialog, toast, surface e typography.
- As APIs públicas e os pacotes @admin-ds/components e @admin-ds/tokens não terão mudanças de contrato.
- A cobertura automatizada do admin-demo será expandida para verificar o consumo por exports e CSS públicos, temas e os fluxos críticos adicionados.

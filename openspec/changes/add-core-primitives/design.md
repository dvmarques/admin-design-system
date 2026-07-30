## Contexto

Consulte `proposal.md` para a motivação. A fundação já distribui variáveis CSS semânticas, uma folha de estilos compilada para componentes, um pacote pequeno `@admin-ds/components`, Storybook e uma aplicação de referência com App Router. Esta change transforma essa fundação em uma API de componentes utilizável, preservando os contratos atuais de distribuição e temas.

## Objetivos e não objetivos

**Objetivos:**

- Estabelecer uma API pequena e consistente de primitivas React em `@admin-ds/components`, que possa ser composta pelas próximas famílias.
- Manter primitivas estáticas compatíveis com Server Components, isolando a interação necessária pelo botão nos limites normais de eventos do React.
- Compilar todos os estilos das primitivas no export público `./styles.css` já existente no pacote e obter os valores visuais a partir de variáveis CSS semânticas.
- Tornar a semântica nativa o padrão e expor entradas específicas de acessibilidade somente quando o elemento nativo não puder expressar a intenção.

**Não objetivos:**

- Criar um ecossistema geral de ícones, uma pipeline de ativos remotos ou uma dependência de terceiros para ícones.
- Introduzir reset global de CSS, provedor de tema específico de componente, sistema de layout ou framework de estado no cliente.
- Definir controles compostos, como botões de menu, campos de formulário, tooltips, cards com comportamento de negócio ou componentes de apresentação de dados.

## Decisões

### As primitivas são exportadas pelo pacote de componentes existente

As sete APIs serão exportadas por `@admin-ds/components`; a change não introduz um pacote por primitiva. Isso preserva o caminho de importação atual para consumidores e evita uma superfície de dependências e lançamentos desproporcional a esta primeira família. Módulos de código-fonte individuais e exports de tipos manterão explícito o ponto de entrada do pacote.

Alternativa considerada: um pacote para cada primitiva. Isso melhoraria a instalação granular, mas adicionaria complexidade de lançamento e dependências desnecessária neste momento.

### APIs públicas de componentes usam o namespace `Ads`

Todo componente React público e seu tipo público de propriedades receberão o prefixo `Ads`, como `AdsButton` e `AdsButtonProps`. O módulo de código-fonte pode manter seu nome curto em minúsculas, enquanto classes CSS públicas de componentes usam `ads-` e as variáveis CSS semânticas mantêm o prefixo já estabelecido `--ads-*`.

Isso torna JSX, tipos e seletores CSS inequívocos quando um consumidor combina várias bibliotecas de interface. O prefixo é uma política fixa do projeto, e não uma opção de runtime, para manter exemplos e imports consistentes entre consumidores.

Alternativa considerada: depender somente do nome do pacote `@admin-ds/components`. O escopo do pacote diferencia imports, mas não o JSX após o import nomeado e não fornece uma convenção correspondente para classes CSS ou tipos.

### Elementos nativos e composição são preferidos

`AdsButton` renderizará por padrão um botão nativo e aceitará atributos padrão de botão. Tipografia e Surface preservarão ou aceitarão um elemento semântico apropriado; Badge, Icon e LoadingIndicator exporão apenas a semântica necessária ao seu papel público. `AdsAvatar` terá um limite de cliente isolado para ocultar uma imagem que falhou e revelar seu fallback. `className` será encaminhada somente ao elemento público externo.

Essa abordagem fornece a consumidores o comportamento nativo de teclado, desabilitado, foco e formulário, sem recriar o comportamento do navegador. Ela também evita APIs que codifiquem regras específicas de produtos futuros.

Alternativa considerada: APIs polimórficas genéricas para cada primitiva. Elas aumentariam a complexidade de tipos e acessibilidade sem uma necessidade atual dos consumidores; escolhas semânticas podem ser ampliadas de forma compatível em uma change futura.

### O limite de cliente é mínimo

As primitivas não precisam de hooks, efeitos ou APIs do navegador, com exceção do `AdsAvatar`, que usa estado local mínimo para tratar falha de carregamento de imagem. As demais serão criadas como componentes React apenas de renderização; `AdsButton` receberá callbacks de eventos normais de um Client Component consumidor quando houver interação. A diretiva `"use client"` ficará restrita ao módulo do Avatar.

Isso maximiza a compatibilidade com Server Components e evita JavaScript desnecessário no cliente. O controle interativo de tema existente permanece separado.

### Os estilos usam utilitários Tailwind estáticos sustentados por tokens

Cada variante e tamanho documentado será mapeado para classes explícitas e estaticamente descobertas no código-fonte do componente. O mapeamento de tema Tailwind existente será ampliado apenas onde faltarem categorias de tokens semânticos. Nenhuma variante será gerada por concatenação de classes em runtime.

O CSS compilado do pacote continuará restrito às classes emitidas pelos componentes e não estilizará elementos simples do consumidor. Consumidores podem sobrescrever variáveis CSS documentadas no escopo de tema que escolherem e aplicar `className` para composição local.

Alternativa considerada: objetos de estilos inline ou configuração Tailwind no consumidor. Estilos inline enfraqueceriam suporte a pseudoestados e media queries; compilar no consumidor quebra o contrato de distribuição estabelecido.

### Acessibilidade faz parte de cada contrato público

`AdsButton` se apoia no contrato nativo de teclado e desabilitado, e o carregamento impede seu acionamento. Avatar aceita texto alternativo para imagens significativas e oculta representações puramente decorativas. Icon é decorativo por padrão e exige um nome quando informativo. LoadingIndicator expõe estado acessível de espera e respeita redução de movimento. Badge inclui texto em vez de comunicar status apenas por cor. Surface e tipografia não fabricam papéis ARIA.

### O conjunto de ícones é local e deliberadamente pequeno

A primeira versão incluirá somente um conjunto curado de caminhos vetoriais criados de forma independente, necessários aos exemplos dos componentes e ações administrativas comuns. Ela não copiará ativos do CoreUI e não adicionará uma dependência de runtime para uma biblioteca de ícones. A união tipada de nomes de ícone é a API suportada.

Risco: o conjunto inicial pode ser limitado demais → Mitigação: adicionar ícones de forma compatível em changes futuras após demanda real de consumidores.

## Riscos e trade-offs

- [Consistência visual em sete primitivas amplia a superfície de CSS] → Mitigação: reutilizar tokens semânticos, manter poucas variantes intencionais e inspecionar a linha de base do CSS compilado.
- [O botão nativo pode não cobrir navegação por link] → Mitigação: deixar ações de link para a futura change de navegação, em vez de enfraquecer a semântica de botão.
- [O comportamento de falha de carregamento de imagens varia por navegador] → Mitigação: testar a renderização de fallback e documentar as entradas de fallback suportadas.
- [Animações podem distrair ou afetar acessibilidade] → Mitigação: incluir um caminho de estilo para movimento reduzido e testar o anúncio acessível de carregamento.
- [Um conjunto local de ícones exige manutenção] → Mitigação: usar componentes SVG simples e tipados, sem dependência de runtime, e adicionar somente ícones revisados.

## Plano de migração

1. Adicionar módulos de código-fonte das primitivas, exports públicos explícitos e estilos estaticamente analisáveis.
2. Adicionar cobertura unitária, de acessibilidade, visual, de pacote e de consumo pela aplicação App Router de referência.
3. Construir e validar os artefatos publicados antes de integrar; esta é uma alteração aditiva, sem migração para consumidores existentes.
4. Caso ocorra regressão em uma versão, remover os novos exports e seu CSS em uma versão de correção; nenhuma API existente será modificada.

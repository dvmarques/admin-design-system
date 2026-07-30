## Context

O repositório contém apenas a configuração do OpenSpec e ainda não possui aplicação, pacotes, pipeline ou decisões materializadas em código. A motivação e o escopo funcional estão em [proposal.md](./proposal.md); os contratos observáveis estão nas seis delta specs desta change.

A fundação precisa atender simultaneamente a quatro restrições:

- servir como biblioteca React reutilizável, e não apenas como template administrativo;
- funcionar em aplicações Next.js com App Router e respeitar limites entre servidor e cliente;
- usar Tailwind CSS internamente sem transferir essa exigência às aplicações consumidoras;
- manter tokens, temas, documentação, testes e artefatos distribuíveis verificáveis desde o início.

## Goals / Non-Goals

**Goals:**

- Criar limites claros entre tokens, componentes, documentação e aplicação de referência.
- Produzir pacotes com APIs públicas explícitas, tipos e CSS pronto para consumo.
- Tornar variáveis CSS semânticas a interface de personalização visual.
- Manter componentes estáticos compatíveis com Server Components.
- Verificar o pacote construído no Storybook e em uma aplicação Next.js de referência.
- Preparar uma base na qual novas famílias de componentes possam ser adicionadas incrementalmente.

**Non-Goals:**

- Definir nesta change a API de todas as famílias de componentes futuras.
- Criar um runtime próprio de CSS-in-JS ou um mecanismo de temas dependente de JavaScript.
- Oferecer persistência universal de preferência de tema; a aplicação consumidora controla cookie, armazenamento ou preferência do usuário.
- Otimizar publicação em múltiplos registros ou distribuição por CDN.
- Criar compatibilidade específica com Pages Router ou frameworks não baseados em React.

## Decisions

### 1. Monorepo com npm workspaces

O repositório será organizado inicialmente assim:

```text
apps/
├── docs/                 # Storybook
└── admin-demo/           # aplicação Next.js de referência
packages/
├── tokens/               # fontes e artefatos públicos de tokens
├── components/           # componentes React reutilizáveis
└── admin/                # composições administrativas futuras
```

Configurações compartilhadas de TypeScript, lint e testes ficam na raiz. Cada pacote declara seus próprios `exports`, tipos, scripts e dependências, evitando imports por caminhos internos.

**Alternativas consideradas:**

- Um único pacote: simplificaria o primeiro build, mas acoplaria tokens, componentes e padrões administrativos e dificultaria o consumo seletivo.
- Repositórios separados: aumentaria o custo de desenvolvimento coordenado e de validação antes de as APIs estabilizarem.
- pnpm ou Turborepo: podem melhorar desempenho em escala, mas npm workspaces atende à fundação com menos ferramentas e já está definido no contexto do projeto.

### 2. Variáveis CSS são a API visual; Tailwind é detalhe interno

Os valores-fonte serão organizados em duas camadas:

```text
tokens de referência
        ↓
tokens semânticos em variáveis CSS
        ↓
tema utilizado pelo Tailwind
        ↓
classes estáticas nos componentes
        ↓
CSS compilado distribuído
```

Tokens de referência representam escalas, enquanto tokens semânticos expressam intenção, como superfície, texto, borda, ação primária e estado de perigo. Somente os contratos documentados são públicos.

Tailwind CSS será usado durante o desenvolvimento e build dos componentes. O pacote distribuirá CSS compilado; o consumidor não precisará instalar Tailwind, adicionar caminhos do pacote à descoberta de classes ou importar a fonte da biblioteca.

Classes variáveis serão selecionadas por mapas estáticos. Concatenação de fragmentos para formar classes Tailwind não será aceita, pois pode produzir CSS ausente no artefato final. `clsx` poderá compor classes já completas. Uma biblioteca de variantes só será adicionada quando componentes reais demonstrarem repetição suficiente para justificar a dependência.

O reset global do Tailwind não será incluído no CSS de componentes, ou será isolado em um ponto de entrada opt-in separado. Essa decisão evita alterar elementos que não pertencem ao design system.

**Alternativas consideradas:**

- Exigir Tailwind no consumidor: reduziria o CSS distribuído, mas acoplaria configuração e versão e violaria o contrato de consumo independente.
- CSS Modules: oferece bom isolamento, mas não aproveita a estratégia Tailwind escolhida e pode complicar a distribuição de estilos compartilhados e tokens.
- CSS-in-JS em runtime: facilita variantes dinâmicas, mas aumenta dependências, custo no cliente e complexidade de SSR.

### 3. Temas orientados por CSS e estado inicial fornecido pela aplicação

O tema explícito será selecionado por `data-theme="light"` ou `data-theme="dark"` em um elemento raiz documentado. Os valores padrão poderão respeitar `prefers-color-scheme` quando não houver seleção explícita.

A biblioteca oferecerá estilos e utilidades de integração, mas a aplicação será responsável por:

- armazenar a preferência em cookie, perfil ou armazenamento local;
- resolver o tema inicial antes ou durante a renderização;
- aplicar o atributo no elemento raiz.

Para Next.js, o exemplo preferencial usará uma preferência disponível no servidor, como cookie, para que servidor e cliente produzam o mesmo tema inicial. Quando isso não for possível, a documentação fornecerá uma estratégia mínima de inicialização anterior à hidratação para reduzir mudança visual sem tornar todos os componentes Client Components.

**Alternativas consideradas:**

- Provider React obrigatório: centralizaria persistência, porém converteria uma parte ampla da árvore em cliente e tornaria a biblioteca responsável por decisões da aplicação.
- Classes `light` e `dark`: funcionariam, mas um atributo nomeado torna o contrato mais explícito e extensível.

### 4. Tokens gerados de uma única fonte estruturada

Uma fonte estruturada e validada gerará:

- variáveis CSS para valores padrão e temas;
- metadados TypeScript somente leitura;
- tipos para nomes públicos;
- documentação de referência.

O build verificará nomes duplicados, referências inexistentes e divergências entre formatos. Artefatos gerados não serão editados manualmente.

**Alternativas consideradas:**

- Manter CSS e TypeScript manualmente: elimina a etapa de geração, mas permite divergência silenciosa entre formatos.
- Expor apenas CSS: seria suficiente para componentes, porém impediria ferramentas e documentação tipada de reutilizarem os mesmos metadados.

### 5. Limites de pacote e APIs públicas

Os pacotes usarão `exports` explícitos e impedirão imports profundos não documentados. React será peer dependency dos pacotes que renderizam componentes; ferramentas de build, Tailwind, Storybook e testes permanecerão como dependências de desenvolvimento quando não forem necessárias em runtime.

O pacote de componentes exporá:

- módulos JavaScript compatíveis com o ambiente-alvo definido pelo projeto;
- declarações TypeScript;
- um ponto de entrada de CSS compilado;
- subpaths públicos apenas quando houver motivo de consumo independente.

`className` será aceito em componentes em que a extensão seja segura. Classes do consumidor serão aplicadas no elemento documentado, mas propriedades ou atributos necessários à acessibilidade não poderão ser silenciosamente anulados por detalhes internos.

O nome final do escopo npm não precisa ser decidido nesta change; nomes de workspace poderão ser privados até a definição da estratégia de publicação.

**Alternativas consideradas:**

- Exportar cada arquivo automaticamente: facilita imports, mas transforma a estrutura interna em API pública e dificulta refatoração.
- Incluir React no bundle: evitaria peer dependency, porém poderia duplicar React e causar incompatibilidades no consumidor.

### 6. Server Components por padrão quando possível

Arquivos puramente apresentacionais não receberão `"use client"`. Componentes com estado, efeitos, handlers, contexto de cliente ou APIs do navegador terão o limite de cliente no arquivo mais estreito possível.

Barrels públicos não deverão promover acidentalmente todo o pacote a Client Component. Se a ferramenta de build não preservar corretamente as diretivas, o pipeline deve falhar por meio do build da aplicação Next.js de referência.

Componentes não acessarão `window`, `document`, hora atual, aleatoriedade ou preferências locais durante a renderização inicial sem uma entrada determinística, reduzindo divergências de hidratação.

**Alternativas consideradas:**

- Marcar o pacote inteiro com `"use client"`: simplificaria imports, mas impediria o uso eficiente em Server Components e aumentaria JavaScript enviado ao navegador.
- Separar imediatamente pacotes server/client: adicionaria complexidade antes de existirem componentes suficientes para justificar essa divisão.

### 7. Storybook e aplicação Next.js exercem contratos diferentes

O Storybook será o catálogo de componentes, estados, variantes, temas e documentação. Ele não será considerado prova suficiente de compatibilidade de distribuição.

A aplicação `admin-demo` deverá consumir os pacotes pelos pontos de entrada públicos e, nos testes de integração do artefato, usar os resultados construídos. Ela verificará:

- importação de tipos, módulos e CSS;
- renderização em Server e Client Components;
- build de produção;
- tema inicial e hidratação;
- ausência de dependência implícita da configuração Tailwind do consumidor.

**Alternativas consideradas:**

- Usar somente Storybook: reduz infraestrutura, mas não exercita App Router, SSR, hidratação e empacotamento do consumidor.
- Usar somente a aplicação demo: valida integração, mas oferece documentação e inspeção de estados inferiores ao catálogo especializado.

### 8. Pirâmide de qualidade

As verificações serão distribuídas por finalidade:

- validação estática: formatação, lint e TypeScript estrito;
- testes de unidade: transformação e validação dos tokens;
- testes de componente: comportamento público com React Testing Library;
- acessibilidade automatizada: semântica, nome, foco e regras detectáveis;
- Storybook: exemplos, temas e inspeção visual;
- Playwright: fluxos de teclado, integração e cenários críticos;
- aplicação Next.js: build e consumo dos artefatos distribuíveis.

Testes devem consultar componentes como usuários e consumidores, evitando acoplamento a classes Tailwind internas. Validação automatizada não substitui revisão manual de acessibilidade para componentes complexos futuros.

**Alternativas consideradas:**

- Testes end-to-end para tudo: aumentariam tempo e instabilidade sem melhorar feedback de regras locais.
- Somente snapshots de markup: seriam baratos, mas frágeis e pouco expressivos sobre comportamento e acessibilidade.

### 9. Controle de tamanho e dependências

Cada pacote deverá ser construído sem incluir dependências que o consumidor já fornece como peer dependency. Pontos de entrada devem permitir eliminação de código não utilizado quando a ferramenta consumidora oferecer tree-shaking.

O pipeline inspecionará o conteúdo do pacote e registrará um baseline de tamanho após a fundação. Limites rígidos por componente serão definidos quando os primeiros componentes representativos existirem.

Dependências de runtime novas exigirão justificativa no design da change que as introduzir. Ferramentas usadas apenas para gerar CSS, documentação ou testes não devem aparecer no runtime do pacote publicado.

## Risks / Trade-offs

- **[CSS compilado pode crescer com o catálogo]** → manter descoberta restrita às fontes da biblioteca, entradas de estilo explícitas e monitoramento do artefato produzido.
- **[Reset ou utilitários globais podem interferir no consumidor]** → excluir o preflight do CSS padrão e tornar qualquer base global um import opt-in documentado.
- **[Personalizações podem quebrar contraste]** → garantir WCAG 2.2 AA nos temas padrão, documentar pares semânticos e oferecer validação no catálogo; customizações externas permanecem responsabilidade do consumidor.
- **[Diretivas de Client Component podem se perder no build]** → preservar diretivas na ferramenta de empacotamento e validar o pacote construído em uma aplicação App Router.
- **[Tema resolvido apenas no cliente pode causar flash ou hidratação divergente]** → priorizar resolução server-side e documentar inicialização anterior à hidratação como alternativa.
- **[Muitos pacotes aumentam configuração inicial]** → começar com três limites de domínio claros e criar novos pacotes somente quando houver independência real.
- **[Storybook e aplicação demo duplicam exemplos]** → manter o Storybook focado em estados isolados e a demo focada em integração e composições administrativas.
- **[Ferramentas de qualidade aumentam o tempo de CI]** → executar verificações rápidas primeiro e reservar Playwright e builds de integração para etapas posteriores ou mudanças afetadas.
- **[A referência CoreUI induz reprodução acidental]** → manter inventário funcional próprio, identidade visual baseada nos tokens do projeto e revisão de licenças para qualquer recurso incorporado.

## Migration Plan

Como o repositório ainda não possui consumidores nem APIs publicadas, não há migração de dados ou compatibilidade anterior a preservar.

1. Criar a estrutura de workspaces e configurações compartilhadas.
2. Implementar a fonte e a geração dos tokens.
3. Produzir os temas e os pontos de entrada de CSS.
4. Configurar o build e os contratos públicos dos pacotes.
5. Configurar Storybook e verificações de qualidade.
6. Criar a aplicação Next.js de referência e validar os artefatos construídos.
7. Registrar o baseline de distribuição antes de iniciar changes de componentes.

Se a fundação precisar ser revertida antes da publicação, os workspaces e aplicações poderão ser removidos juntos, pois ainda não existirão consumidores externos. Depois da primeira publicação, mudanças em tokens, exports e estilos públicos deverão seguir versionamento semântico e orientação de migração.

## Open Questions

- Qual será o nome e o escopo npm definitivo dos pacotes quando a publicação externa entrar no roadmap?
- Qual serviço de revisão visual será adotado, caso o projeto passe a exigir aprovação remota de diferenças de screenshot?

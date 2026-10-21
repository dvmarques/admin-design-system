## Context

Levantamento realizado sobre `develop` no commit
`a4b06a20aaf960b5760579fed2ad4aa05020ad9e`:

- `README.md` cita CoreUI, usa “utilizará” e “serão documentados”, mantém
  “Tecnologias planejadas” e um relato de changes em “Estado atual”.
- `docs/architecture.md` descreve aplicações e componentes no futuro, inclui
  nomes que devem ser conferidos nos exports atuais e repete a ressalva CoreUI PRO.
- `docs/limitations.md` começa dizendo que só existe a fundação e que Button,
  Table, Modal e Sidebar ainda serão implementados. O restante contém limitações
  técnicas que continuam úteis.
- `openspec/config.yaml` determina CoreUI como referência para novos trabalhos.
- `docs/licensing.md` mistura contexto inicial sobre CoreUI com o inventário de
  licenças, incluindo Inter e `@fontsource/inter`.
- `docs/roadmap.md` não existe. As menções encontradas a esse caminho e aos itens
  do antigo roadmap estão no histórico arquivado.
- PrimeReact, shadcn/ui, Ant Design e Chakra UI aparecem como referências em
  `openspec/changes/archive/2026-07-31-refine-visual-foundation`.
- `high-end-visual-design` proíbe Inter e exige estética Apple/Linear;
  `redesign-existing-projects` recomenda substituir Inter; e
  `design-taste-frontend` desencoraja a fonte e oferece referências externas.
- `docs/visual-identity.md` registra a Inter, os tokens e os temas atuais, mas
  também contém texto relativo à etapa que introduziu essas decisões.
- A seção `Em andamento` do changelog é um contrato usado pelos scripts de
  release; ocorrências de “andamento” em indicadores, exemplos e testes não são
  registros de status do projeto.

## Goals / Non-Goals

### Goals

- Fazer a documentação atual representar os recursos entregues e seus limites.
- Usar a identidade existente como referência para manutenção e evolução.
- Evitar que instruções genéricas de design provoquem mudanças visuais não pedidas.
- Preservar informações legais, operacionais e históricas necessárias.

### Non-Goals

Não alterar código de produto, contratos públicos, fronteiras entre Server e
Client Components, estilos, tokens, acessibilidade, dependências, tamanho de bundle
ou a integração das aplicações consumidoras.

## Decisions

### 1. Limpar por significado, não por substituição global

Revisar README, documentação e orientações atuais. Remover referências que
apresentam bibliotecas externas como modelo a seguir. Preservar links técnicos,
origens de materiais incorporados, licenças, referências internas a tokens e o
termo “aplicação de referência” quando descreve o papel do admin demo.

As menções no arquivo histórico do OpenSpec permanecem como registro do contexto
da época. Não editar skills geradas do OpenSpec em nenhuma integração.

### 2. Descrever capacidades existentes sem duplicar o histórico

Usar o presente e nomes públicos conferidos nos exports de `packages/*`. Trocar
o relato cronológico do README por uma visão curta do produto e links úteis.
O changelog e o arquivo do OpenSpec continuam sendo as fontes de histórico.

Corrigir a introdução de limitações e remover somente itens comprovadamente
obsoletos. Manter responsabilidades do consumidor, limites de componentes,
cobertura de navegadores, acessibilidade, snapshots e distribuição de estilos.
A ausência de publicação npm continua sendo informação operacional válida.

### 3. Preservar a identidade e alinhar todas as skills próprias

Manter Inter, escala de marca, temas, tipografia, densidade, espaçamento, raios e
movimento definidos pelo projeto. Tornar essa precedência explícita em
`AGENTS.md`, na configuração OpenSpec e nas três skills próprias.

Remover ou restringir comandos conflitantes nos próprios trechos das skills,
incluindo a proibição de Inter, a obrigação de variar estética a cada execução
e a escolha automática de sistemas externos. Uma orientação no topo não basta
se o restante continuar impondo o contrário. Manter práticas úteis de composição,
responsividade e acessibilidade, subordinadas aos tokens e contratos existentes.

Editar a fonte em `.agents/skills` e executar `npm run sync:agent-skills`.
Conferir com `npm run check:agent-skills`. Preservar a origem das skills no
lock; documentar adaptações locais sem apresentar hash local como hash upstream.

### 4. Preservar o processo de release e as obrigações legais

Simplificar a apresentação em licenciamento, mantendo o inventário,
atribuições, origem de materiais e a licença OFL-1.1 da Inter.
Não eliminar o heading `Em andamento`, entradas existentes do changelog,
versionamento ou scripts de release. Adicionar apenas o registro desta limpeza.

### 5. Tratar esta change como documentação e governança

Usar `skip_specs: true` porque não há mudança em contratos de produto.
Não criar specs artificiais para texto editorial ou instruções operacionais.

## Risks / Trade-offs

- Remover contexto útil por engano: classificar cada ocorrência antes de editar,
  preservando histórico, referências técnicas e atribuições.
- Manter contradições nas skills: revisar as três fontes completas e sincronizar
  as cópias; confirmar que nenhuma regra remanescente exige redesenho automático.
- Declarar recursos inexistentes: conferir nomes e capacidades nos exports,
  Storybook e documentação de integração durante a revisão.
- Tratar “finalizado” como ausência de limites: preservar limitações atuais e
  condições de publicação, sem prometer suporte ou distribuição inexistentes.

## Validation

- Conferir o diff: código, CSS, tokens, lockfile de dependências, baselines e
  histórico arquivado permanecem inalterados.
- Revisar os links locais e as ocorrências restantes de referências externas,
  roadmap, planejamento e andamento, justificando as que permanecem.
- Executar formatação, validação OpenSpec, sincronia de skills e os comandos de
  qualidade exigidos pelo repositório antes de concluir a implementação.
- Não criar testes que apenas espelhem frases de documentação. Não atualizar
  snapshots para acomodar esta limpeza.

## Planning Environment

Os artefatos foram preparados pela API do GitHub porque o ambiente de execução
estava indisponível. A árvore do repositório confirmou a raiz OpenSpec,
`schema: spec-driven` e ausência de changes ativas no commit consultado.
O CLI OpenSpec, o Prettier e os testes não puderam ser executados nesta etapa.
Essa limitação não representa validação concluída; os checks ficam pendentes
antes de marcar a proposta pronta para integração.

# Design — evolução editorial sem alterar o contrato técnico (#286)

## Estado observado

`parseChangelog` interpreta `### [X.Y.Z] - Em andamento` e blocos fechados no padrão `dd-mmm-aaaa`; `release:changelog` sinaliza itens longos/duplicados e atrela a aprovação ao SHA-256 da seção. `release:notes` extrai somente o bloco fechado, removendo apenas a marca HTML de aprovação. `release:prepare`, `release:validate`, GitHub Releases e back-merge dependem desse formato. As notas públicas hoje incluem alguns detalhes de CI e orçamento técnico, mas as releases fechadas são imutáveis.

## Decisões

1. **Publicação por impacto:** manter um registro legível de efeitos públicos para usuários dos pacotes; exigir motivo concreto para qualquer item de CI/tooling/refactor. Histórico técnico permanece em PRs, issues, commits e OpenSpec, não nas Release Notes por padrão.
2. **Categorias normativas e exemplos:** adotar somente seções necessárias (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`) e notas de no máximo 300 caracteres. Uma alteração incompatível ou com migração exige aviso explícito. Consolidação é humana e preserva referências.
3. **Formato atual:** manter o placeholder versionado `Em andamento` e as datas `dd-mmm-aaaa` em `America/Sao_Paulo`; não converter títulos fechados, datas, hashes ou body das Releases. Manter extração integral do bloco fechado, sem filtros ou resumos automáticos: a seleção se faz **antes** do hash.
4. **Crescimento:** não particionar o histórico; scripts já localizam seções por versão e a política reduz entradas futuras. Links de comparação ficam como oportunidade condicionada a tags reais e testes de compatibilidade.

## Alternativas e trade-offs

| Alternativa | Vantagem | Custo/decisão |
| --- | --- | --- |
| `## [Unreleased]` + ISO `YYYY-MM-DD` | Familiaridade com Keep a Changelog e leitura internacional | Altera o parser, placeholders, validações e back-merge; mistura com história passada exige compatibilidade dupla e testes extensivos. **Não adotar agora.** |
| Links permanentes de diff entre versões | Navegação entre tags | Antes da publicação, tags podem não existir; exigiria política de links/bootstrap. **Adiar.** |
| `CHANGELOG-archive-*.md` | Arquivo principal menor | Extração e checks de release precisariam buscar diversos arquivos com garantias idênticas; benefício ainda não medido. **Adiar.** |
| Filtrar itens internos no `release:notes` | Notas públicas mais curtas sem editar changelog | Causa divergência entre texto aprovado, notas extraídas e comparação idempotente. **Rejeitar.** |
| Documentar seleção editorial antes da aprovação | Menor complexidade e preservação integral das garantias | Depende de revisão humana real; **adotar**. |

## Revisão de compatibilidade e segurança

Os scripts, regexes, entradas históricas, marcadores de aprovação, notas já publicadas, checks, tags, workflows e os quatro pacotes permanecem sem alterações. O documento não autoriza release nem aprovação por hash. Não há impacto em bundle, API pública, CSS, acessibilidade, temas, SSR/CSR, Storybook ou Next.js; não é necessário teste visual ou migração de consumidores. **Rollback:** reverter documentação prospectiva sem tocar em releases fechadas.

## Verificações e gates

Revisar diff para garantir que somente o preâmbulo e a seção em andamento do changelog mudaram. A documentação deve referenciar exatamente os comandos ativos: `release:changelog`, `release:prepare`, `release:validate`, `release:notes`, GitHub Releases e back-merge. Não há modificação de parser/extração que exija novos testes automatizados; `npm run test:release` deve continuar passando. Validar OpenSpec strict, format e `npm run validate` (incluindo E2E) e observar CI no SHA final. Sem checkout executável neste ambiente, os comandos locais ficam pendentes; checks pulados por `docs_only` não equivalem a execução.

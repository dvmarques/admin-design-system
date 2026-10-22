# Validação por impacto (experimental)

A issue #164 introduz `scripts/ci-impact.mjs`, um classificador conservador que identifica workspaces modificados e seus dependentes transitivos. O resultado é JSON com `mode` (`docs`, `scoped` ou `full`), `reason` e `affected`.

## Uso local

```bash
node scripts/ci-impact.mjs
node --test scripts/ci-impact.test.mjs
npm run validate:impact:lint
npm run validate:impact:types
npm run validate:impact:test
```

O comando compara `HEAD^1` com `HEAD` por padrão. É possível fornecer `GITHUB_BASE_SHA` para selecionar a revisão inicial. Execute a partir da raiz do repositório, com Git e manifests disponíveis. Na ausência de informação confiável, o resultado é `full`.

**Não utilize o resultado para dispensar os gates atuais de PR ou release.** Os jobs da CI continuam completos. Uma futura integração precisa testar o grafo com os manifests reais, cobrir alterações globais e comprovar equivalência de cobertura antes de otimizar execução.

## Medição antes/depois

Colete IDs dos runs GitHub Actions, commit, tipo de alteração, duração dos jobs, conclusão e número de reruns. Compare grupos de mudanças equivalentes, em condições similares, antes e depois. Só reporte tokens e custo quando a telemetria do agente disponibilizar valores verificáveis. Não confunda a redução de jobs executados com ganho medido de tempo ou custo.

## Limitações

A classificação considera dependências declaradas nos manifests e não substitui análise de imports, scripts compartilhados, contratos visuais ou testes de integração. Alterações em configurações globais, manifests e arquivos desconhecidos retornam `full`. O modo `scoped` é apenas informativo nesta fase.

## Baseline inicial auditável

Run de referência: [39806673826](https://github.com/dvmarques/admin-design-system/actions/runs/39806673826), anterior à implementação #164. Os jobs `Qualidade rápida`, `Política de develop`, `Artefatos de distribuição`, `Fluxos no navegador` (Chromium, Firefox e WebKit) concluíram com `success`; `Validação de release` foi `skipped` por regra de branch. Este registro **não** é comparação quantitativa: durações por job, custo, tokens e retrabalho não foram coletados. Não é correto declarar economia ou equivalência de cobertura a partir desse run.

Para fechar o benchmark, registrar no mínimo três runs comparáveis por condição, seus tempos por job e reruns; separar o efeito de cache, variação do runner e mudanças no escopo. A CI atual apenas informa o impacto, sem dispensar testes.\n
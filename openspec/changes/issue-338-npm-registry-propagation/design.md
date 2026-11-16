# Design — confirmação npm com deadline (#338)

## Decisão

1. Após `publishTarball`, usar relógio monotônico e janela de até **150.000 ms por pacote**, no máximo **20 leituras**. A primeira leitura é imediata e os atrasos seguem `min(15.000, round(2.500 × 1,5^(tentativa-1)))`, limitados ao saldo de tempo.
2. Passar a `getVersion` o menor valor entre timeout individual de 30.000 ms e o tempo restante. `registryVersion` aceita terceiro argumento opcional; chamadas anteriores mantêm 30 segundos. Injetar relógio e `sleep` em testes, sem esperas reais.
3. Em versão encontrada, verificar imediatamente `name`, `version` e `dist.integrity`; divergência é fatal e não é tratada como atraso. Esgotamento falha com contexto do pacote/versão, limite e orientação de reconciliação e reexecução com o mesmo artifact.
4. Preservar preflight dos quatro pacotes, ordem tokens/components/highlighted-code/admin, dependência de components antes de admin, verificação final, OIDC e ausência de tokens. `publish-npm` recebe `timeout-minutes: 30`. O teto acumulado de polling é 10 minutos, reservando margem para as demais etapas.
5. Reexecução permanece manual, idempotente, usando artifact imutável já aprovado; nenhuma publicação ocorrerá nesta change.

## Alternativas e riscos

Mais tentativas em intervalo fixo causam polling desnecessário; aumentar apenas tentativas ignora latência de requisições HTTP. Confiar no exit code do publish é inseguro. Latências superiores a 150 s falham propositalmente. Erros de rede não-404 seguem fatais. O job inteiro tem timeout finito para não reter a fila indefinidamente. Sem alterações em identidade visual, APIs, CSS, bundles ou permissões.

Rollback por nova PR antes de release; versões npm existentes nunca serão sobrescritas. Validar testes de publicação, timeout, integridade e idempotência, `npm run validate`, E2E, OpenSpec strict, CI e revisão independente. A execução real de npm é proibida neste escopo.

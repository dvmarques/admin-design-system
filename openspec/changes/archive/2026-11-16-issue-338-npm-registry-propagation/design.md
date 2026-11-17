# Design — confirmação npm com deadline (#338)

## Decisão

1. Após `publishTarball`, usar relógio monotônico e janela de até **150.000 ms por pacote**, no máximo **20 leituras**. A primeira leitura é imediata e os atrasos seguem `min(15.000, round(2.500 × 1,5^(tentativa-1)))`, limitados ao saldo de tempo.
2. Passar a `getVersion` o menor valor entre timeout individual de 30.000 ms e o tempo restante. `registryVersion` aceita terceiro argumento opcional; chamadas anteriores mantêm 30 segundos. Injetar relógio e `sleep` em testes, sem esperas reais.
3. Extrair um helper único de releitura, parametrizado por janela, tentativas, atraso, relógio e fase. Na confirmação final, reservar até **60.000 ms e 12 leituras por pacote**, com os mesmos intervalos progressivos. A verificação final continua exclusivamente read-only e exige nova confirmação de identidade e integridade mesmo após o primeiro sucesso; um `404` isolado não invalida uma versão já confirmada.
4. Nas duas fases de confirmação, somente HTTP **429 e 5xx**, `TimeoutError` e erros de transporte reconhecidos (`TypeError` do `fetch`, `ECONNRESET`, `ETIMEDOUT`, `EAI_AGAIN`, `ENOTFOUND`, `ECONNREFUSED`, `EHOSTUNREACH`, `ENETUNREACH` e timeout de conexão undici) admitem releitura. HTTP 4xx não-429, JSON inválido, e divergências em `name`, `version` ou `dist.integrity` encerram imediatamente. A última falha transitória integra o diagnóstico de prazo/tentativas esgotado. Não repetir o próprio `npm publish`, consultas de preflight ou check de dependência `components`: falhas nessas etapas continuam bloqueantes antes de nova escrita.
5. Em versão encontrada, verificar imediatamente `name`, `version` e `dist.integrity`; divergência é fatal e não é tratada como atraso. Esgotamento falha com contexto do pacote/versão, limite e orientação de reconciliação e reexecução com o mesmo artifact.
6. Preservar preflight dos quatro pacotes, ordem tokens/components/highlighted-code/admin, dependência de components antes de admin, verificação final, OIDC e ausência de tokens. `publish-npm` recebe `timeout-minutes: 30`. O teto agregado de polling pós-publicação é 10 minutos, acrescido de até 4 minutos de verificação final; o job conserva 16 minutos para outras operações dentro do timeout de 30 minutos.
7. Reexecução permanece manual, idempotente, usando artifact imutável já aprovado; nenhuma publicação ocorrerá nesta change.

## Alternativas e riscos

Mais tentativas em intervalo fixo causam polling desnecessário; aumentar apenas tentativas ignora latência de requisições HTTP. Confiar no exit code do publish é inseguro. Latências superiores a 150 s falham propositalmente. Falhas transitórias de transporte/HTTP são repetidas apenas dentro dos limites; erros permanentes seguem fatais. O preflight original continua sem retry automático. O job inteiro tem timeout finito para não reter a fila indefinidamente. Sem alterações em identidade visual, APIs, CSS, bundles ou permissões.

Rollback por nova PR antes de release; versões npm existentes nunca serão sobrescritas. Validar testes de publicação, timeout, integridade e idempotência, `npm run validate`, E2E, OpenSpec strict, CI e revisão independente. A execução real de npm é proibida neste escopo.

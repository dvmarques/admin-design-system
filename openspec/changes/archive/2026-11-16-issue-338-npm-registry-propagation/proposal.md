# Proposal — tolerância à propagação do registry npm (#338)

## Why

Na publicação OIDC da 0.1.3, o pacote tokens ficou invisível no registry por mais de ~30 segundos após o sucesso do npm publish. A confirmação fixa atual abortou a execução, deixando publicação parcial que exigiu reexecução idempotente.

**Perfil Critical:** mudança em supply chain e comportamento de release.

## What Changes

- Expandir a confirmação para 150 segundos por pacote e 20 consultas, usando backoff progressivo (2,5 até 15 segundos), deadline monotônico e timeout individual limitado ao saldo.
- Validar nome, versão e dist.integrity antes de avançar; esgotamento e divergência devem falhar com diagnóstico claro.
- Limitar o job npm a 30 minutos sem alterar a fila release-publication, Trusted Publisher/OIDC, provenance, integridades ou permissões.
- Adicionar testes determinísticos de propagação >30 s, timeout, divergência e reexecução, além de documentação e spec.
- Reutilizar um verificador de polling na confirmação pós-publicação e na reconciliação final (até 60 segundos e 12 consultas por pacote), incluindo o cenário `200 → 404 → 200`.
- Repetir somente falhas transitórias de leitura durante essas duas etapas (`TimeoutError`, erros de transporte temporários, HTTP 429/5xx); preservar falha imediata em HTTP 4xx não transitório, JSON inválido ou divergência de identidade/integridade.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `npm-publication`: confirmação tardia e temporizada com falha fechada.

## Impact

Somente script de publicação, testes, workflow, documentação e OpenSpec. Não altera bytes de tarballs, APIs públicas, componentes, bundles, CSS, temas, acessibilidade, apps ou dependências. A disponibilidade futura dos pacotes no npm torna-se mais robusta sem mudar o consumo.

Fora de escopo: publicar/republicar 0.1.3, disparar workflow, gerar artifacts, criar tags, releases, mudar provenance existente ou credenciais.

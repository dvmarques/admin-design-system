# Design

## Contexto e escopo

A PR #293 atualiza guias e READMEs após a publicação npm de `0.1.1`. A spec `consumer-adoption` precisa continuar válida para pacotes publicados e também para pacotes futuros que ainda não tenham uma publicação verificada.

## Decisão

Atualizar o requisito existente para exigir texto de instalação npm baseado no estado verificável de cada pacote. Para versões publicadas, os guias apresentam comandos remotos aplicáveis sem avisos de pré-publicação. Para pacotes sem publicação verificada, os guias não afirmam disponibilidade ou teste remoto.

## Limites

- Pacotes reutilizáveis: nenhum código ou API será alterado.
- Aplicações de demonstração: nenhuma alteração.
- Não altera release, configuração de Trusted Publisher ou processo de publicação.
- Mantém a issue #195 aberta.

## Verificação

Validar o delta e a spec sincronizada com `openspec.cmd validate --all --strict`; formatar com `npm run format`.

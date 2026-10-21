## 1. Contexto
- [x] 1.1 Identificar duplicações e regras que não podem ser removidas.
- [x] 1.2 Criar mapa conciso de pacotes e documentos com gatilhos de leitura.
- [x] 1.3 Reduzir o contexto descritivo do OpenSpec sem remover regras operacionais.
- [x] 1.4 Atualizar AGENTS.md para leitura direcionada, preservando contratos e compatibilidade entre agentes.

## 2. Modelos
- [x] 2.1 Substituir recomendação fixa por matriz por complexidade e custo efetivo.
- [x] 2.2 Definir política de escalonamento e limites de contexto.

## 3. Verificação
- [x] 3.1 Documentar benchmark reproduzível e critérios de regressão.
- [x] 3.2 Revisar instruções cruzadas e ajustar inconsistências.
- [ ] 3.3 Executar validação OpenSpec e check:agent-skills; registrar limitações do ambiente.

## Revisão
- Contratos de API, acessibilidade, release e regras de artefatos foram mantidos; o bloco descritivo duplicado de contexto foi condensado.
- Validação automática ainda pendente: esta sessão de edição via GitHub não dispõe de execução de comandos no checkout remoto. Não marcar 3.3 até executar os comandos em CI ou ambiente local.

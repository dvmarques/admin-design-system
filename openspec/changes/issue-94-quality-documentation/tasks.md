## 1. Inspeção de pacotes
- [x] 1.1 Definir orçamento por pacote e por métrica; preservar baseline de distribuição.
- [x] 1.2 Implementar medição de JS/CSS e gzip, excluindo mapas e declarações do tráfego.
- [ ] 1.3 Implementar cenários representativos de consumo e diagnósticos de limite.
- [ ] 1.4 Criar testes para estouro de cada orçamento e documentação de atualização.

## 2. Qualidade
- [ ] 2.1 Configurar geração do relatório de cobertura.
- [ ] 2.2 Publicar cobertura como artefato de CI e testar configuração.

## 3. Documentação
- [x] 3.1 Criar guia de migração em pt-BR.
- [x] 3.2 Documentar changelog por componente.
- [x] 3.3 Reorganizar limitações por componente sem perder restrições existentes.

## 4. Validação
- [ ] 4.1 Executar build, lint, tipos, testes e testes de consumo do CSS/Next.js.
- [ ] 4.2 Executar npm run test:e2e sem falhas; não alterar snapshots sem mudança visual intencional.
- [ ] 4.3 Executar prettier nos arquivos alterados, npm run format e openspec.cmd validate --all --strict.

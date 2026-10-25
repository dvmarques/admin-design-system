## 1. Inventário e rastreabilidade

- [x] 1.1 Confirmar conclusão da #196 e localizar changes arquivadas relevantes.
- [x] 1.2 Identificar origem e ambiente das capturas de #187, sem afetar baselines oficiais.
- [x] 1.3 Verificar referências e acesso às 18 capturas antes de remover o diretório original.
- [x] 1.4 Realocar os mesmos blobs para a change arquivada de #187 e atualizar todos os links.

## 2. Documentação permanente

- [x] 2.1 Corrigir o caminho de #135 e separar cronologia de medição do procedimento atual.
- [ ] 2.2 Qualificar dados de bundle por data/commit/toolchain verificáveis, inclusive Node 22.
- [x] 2.3 Distinguir documentação vigente, contribuição e histórico no README.

## 3. Reconciliação OpenSpec

- [ ] 3.1 Comparar semanticamente os 17 títulos arquivados com as specs atuais (matriz preliminar por títulos em docs/openspec-history-reconciliation.md; análise de cenários pendente).
- [ ] 3.2 Registrar equivalência, substituição ou perda e as evidências por requisito (17 candidatos documentados; sem equivalência funcional atestada).
- [ ] 3.3 Identificar as três tasks abertas em archives; reutilizar a #164.

## 4. Validação

- [ ] 4.1 Verificar referências textuais e links relativos, diff apenas documental e integridade dos arquivos preservados.
- [ ] 4.2 Executar npm run validate.
- [ ] 4.3 Executar openspec.cmd validate --all --strict.
- [ ] 4.4 Revisar e corrigir os achados, documentando skips/limitações reais.

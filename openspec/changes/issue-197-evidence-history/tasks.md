## 1. Inventário e rastreabilidade

- [x] 1.1 Confirmar conclusão da #196 e localizar changes arquivadas relevantes.
- [x] 1.2 Identificar origem e ambiente das capturas de #187, sem afetar baselines oficiais.
- [x] 1.3 Verificar referências e acesso às 18 capturas antes de remover o diretório original.
- [x] 1.4 Realocar os mesmos blobs para a change arquivada de #187 e atualizar todos os links.

## 2. Documentação permanente

- [x] 2.1 Corrigir o caminho de #135 e separar cronologia de medição do procedimento atual.
- [x] 2.2 Qualificar dados de bundle por data/commit/toolchain verificáveis, inclusive Node 22 (histórico preservado; informações ausentes nas medições originais não foram inventadas).
- [x] 2.3 Distinguir documentação vigente, contribuição e histórico no README.

## 3. Reconciliação OpenSpec

- [x] 3.1 Comparar semanticamente os 17 títulos arquivados com as specs atuais (títulos, requisitos e cenários cotejados em docs/openspec-history-reconciliation.md; verificação de comportamento não executada).
- [x] 3.2 Registrar equivalência documental, cobertura parcial ou possível lacuna e as fontes por requisito (17 casos documentados; sem alegar regressão funcional).
- [x] 3.3 Identificar as três tasks abertas em archives; reutilizar a #164 (inventário em docs/archived-openspec-followups.md).

## 4. Validação

- [x] 4.1 Verificar referências textuais e links relativos, diff apenas documental e integridade dos arquivos preservados (15 Markdown verificados contra a árvore Git; 18 PNGs migrados com mesmo SHA de blob, sem alterações em e2e/ ou budgets).
- [ ] 4.2 Executar npm run validate.
- [ ] 4.3 Executar openspec.cmd validate --all --strict.
- [ ] 4.4 Revisar e corrigir os achados, documentando skips/limitações reais.

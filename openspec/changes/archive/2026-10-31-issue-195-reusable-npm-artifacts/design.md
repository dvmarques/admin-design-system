## Context

O job prepare-npm atual empacota novamente em cada publicação. Artifacts v4 são imutáveis por ID, mas podem ser excluídos/expirar; nomes não são identidades confiáveis.

## Decisions

- Workflow release-prepare.yml manual em develop, sem OIDC/escrita, resolve os merges e gera/smoke-testa tarballs uma vez. Re-run da preparação é recusado; nova preparação é uma nova execução e não substitui o ID anterior.
- Plano inclui origem (repositório, SHA do workflow, run ID e tentativa). Nome inclui versão, merge SHA e run/tentativa. Retenção solicitada: 90 dias, sujeita aos limites do repositório; operador verifica expires_at real.
- release.yml exige artifact ID. API GitHub valida workflow ID/path, evento manual, develop, conclusão success, mesmo repository/head repository, commit ancestral de develop e identidade de run/tentativa no plano. Digest ZIP é validado de forma fatal; extração permite somente quatro tgz e plano sem caminhos, links ou duplicatas. Nenhum código do artifact é executado.
- Cada job npm baixa/verifica o mesmo ID. Publicação verifica hashes e manifests contra git show do merge resolvido; dependências internas exatas e plano de versão coordenada permanecem obrigatórios. OIDC e escrita GitHub continuam isolados. Lógica confiável vem do SHA que disparou o workflow; código de build vem do merge aprovado.
- Artifact ausente/expirado causa falha antes de qualquer publicação. Após publicação parcial, interromper: preservar versões existentes e deliberar recuperação gerenciada ou próxima versão, sem reconstruir as faltantes como se fossem o conjunto anterior. Após todos publicados, bytes podem ser recuperados do registry e comparados a evidências, mas não substituem automaticamente o artifact expirado no fluxo.

## Alternatives

Rebuild determinístico não garante identidade futura. Assets de GitHub Release exigiriam publicação antes dos gates existentes. Armazenamento externo permanente adicionaria credenciais/custos; optamos por retenção temporária e interrupção segura. Artifact ID arbitrário sem validar origem permitiria PR/fork poisoning, portanto é recusado.

## Compatibility and risks

Não há mudanças Server/Client, acessibilidade, temas, responsividade, Tailwind, estilos, dependências de runtime ou bundle. O smoke Next.js cobre consumo existente. Retenção não é backup permanente; exclusão administrativa pode interromper uma publicação. Dispatch e branches protegidas continuam sendo o gate humano; não há publicação automática. Rollback: manter publicação bloqueada, nunca voltar a reconstruir versão parcialmente publicada.

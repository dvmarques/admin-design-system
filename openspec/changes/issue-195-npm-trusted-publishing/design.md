# Design

## Decisões

1. A preparação npm só começa após o job read-only resolver o merge commit da release em master e comprovar o back-merge em develop. Nenhum build obtém `id-token: write`.
2. O smoke externo por tarballs da #194 pode escrever os **mesmos arquivos** em diretório persistido como artifact entre jobs; cada arquivo tem nome, versão e hash SHA-512 registrados no manifesto. O job publicador revalida os bytes do artifact antes de usar npm publish.
3. Inventário fechado: `tokens -> components -> highlighted-code -> admin`. Raiz e apps são privados. Versões iguais à release, public access, MIT, dependências internas coerentes e nenhuma instalação de fontes do monorepo no consumidor.
4. Publicação usa `npm@11.19.1`, `node@24`, GitHub-hosted runner, OIDC com `id-token: write` **somente** no job npm e `npm publish <tarball> --access public --provenance`. Não haverá `NODE_AUTH_TOKEN`, `.npmrc` de escrita nem credenciais persistentes. O workflow chama a publicação só após validação dos artefatos.
5. Consultar antes todas as versões no registry; se `dist.integrity` já existir deve coincidir exatamente com a integridade local. Uma divergência bloqueia antes da primeira escrita. Reconsultar a dependência já publicada e o próprio pacote depois de cada envio. Uma falha parcial é recuperável por reexecução, sem sobrescrever pacote nem marcar sucesso falso.
6. O job final de tag/GitHub Release mantém a lógica confiável existente, recebe `contents: write` apenas depois de confirmação npm; ele nunca executa código do commit de release com privilégios de escrita.
7. O arquivo workflow exato é `.github/workflows/release.yml` (configuração npm usa apenas `release.yml`), conta/namespace `dvmarques`, repositório `admin-design-system` e ação permitida `npm publish`. Configurar publisher para cada pacote após a disponibilidade inicial no npm; se for necessário bootstrap por publicação autenticada, o mantenedor a executará manualmente **com os tarballs aprovados da mesma release** e 2FA, nunca com versão provisória.
8. GitHub Release e tag refletem exclusivamente o commit de merge da release em master; uma eventual master posterior não muda a identidade do pacote publicado.

## Falhas/recuperação

- Registry indisponível, OIDC faltante, pacote privado, versão divergente, artifact inesperado: falhar fechado sem publicar ou continuar.
- Npm publish concluído mas leitura do registry atrasada: tentar leituras com atraso limitado; ao esgotar falhar, deixando reexecução segura.
- Publicação parcial: reexecutar; nomes já existentes com mesma integridade são no-op, ausentes são publicados na ordem.
- Quatro pacotes confirmados, tag/GitHub Release falham: a próxima execução valida os pacotes e recupera apenas tag/release; tags existentes divergentes nunca são substituídas.
- O bootstrap npm e as configurações de trusted publishing são gates humanos externos. Jamais registrar tokens, senhas ou códigos.

## Validação

Testes mock de estados do registro, integridade, publicação parcial, reexecução e scripts de workflow. Testes smoke em tarballs e aplicação externa. `npm run validate`, OpenSpec estrito, CI Ready. Nesta PR não executar `workflow_dispatch` de publicação.

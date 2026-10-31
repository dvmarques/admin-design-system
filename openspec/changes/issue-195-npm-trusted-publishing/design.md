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

## Consolidação do changelog antes de fechar a versão

- O comando `npm run release:changelog -- X.Y.Z` produz uma **proposta não destrutiva** para a seção `Em andamento`: lista os itens, sugere títulos resumidos a partir das primeiras frases, identifica referências de issues repetidas e itens muito longos. É heurístico: **não pode decidir sozinho** que duas alterações são semanticamente equivalentes, eliminar breaking changes nem mudar o changelog.
- O mantenedor consolida manualmente as entradas da versão em andamento, organiza `Added / Changed / Fixed / Security / Removed` conforme necessário, mantém os números de issues e garante que incompatibilidades e migrações continuem explícitas. O histórico de versões fechadas não é reescrito.
- `npm run release:changelog -- X.Y.Z --approve` exige branch `release/X.Y.Z`, entradas não duplicadas e textos breves, e grava um comentário de aprovação `release-changelog-approved sha256` ligado ao corpo exato (excluída a própria marca). É confirmação editorial explícita por quem prepara a release, seguida da revisão da PR para master. Commitar o changelog aprovado antes de chamar `release:prepare` (que exige working tree limpa).
- `release:prepare` falha antes de escrever quando o texto não foi aprovado ou foi modificado após a aprovação; `release:validate` verifica a mesma integridade na seção fechada. A CI para master executa essa validação; o back-merge preserva o bloco exato.
- A marca invisível documenta o review no changelog versionado, mas **não** aparece nas GitHub Release Notes nem nas notas npm. Entradas breves e sem duplicidade são verificáveis objetivamente; a qualidade semântica depende da revisão humana. Nenhum modelo generativo publica texto automaticamente.
- Versões fechadas anteriores à adoção não exigem retroativamente novas marcas; o gate vale para o alvo preparado e fechado daqui para frente.

## Falhas/recuperação

- Registry indisponível, OIDC faltante, pacote privado, versão divergente, artifact inesperado: falhar fechado sem publicar ou continuar.
- Npm publish concluído mas leitura do registry atrasada: tentar leituras com atraso limitado; ao esgotar falhar, deixando reexecução segura.
- Publicação parcial: reexecutar; nomes já existentes com mesma integridade são no-op, ausentes são publicados na ordem.
- Quatro pacotes confirmados, tag/GitHub Release falham: a próxima execução valida os pacotes e recupera apenas tag/release; tags existentes divergentes nunca são substituídas.
- O bootstrap npm e as configurações de trusted publishing são gates humanos externos. Jamais registrar tokens, senhas ou códigos.

## Validação

Testes mock de estados do registro, integridade, publicação parcial, reexecução e scripts de workflow. Testes smoke em tarballs e aplicação externa. `npm run validate`, OpenSpec estrito, CI Ready. Nesta PR não executar `workflow_dispatch` de publicação.

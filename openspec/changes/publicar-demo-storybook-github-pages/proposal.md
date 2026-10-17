## Why

O demo (`apps/admin-demo`) e o catálogo Storybook (`apps/docs`) só rodam localmente: não há hospedagem, e quem quiser avaliar o design system precisa clonar o repositório. O projeto é pessoal, de estudo e sem uso comercial, então o GitHub Pages atende sem custo e sem conta adicional (issue #103).

## What Changes

- Publicação automática do demo e do Storybook no GitHub Pages por um workflow único: o demo na raiz do site e o Storybook em `/storybook/`.
- O build do demo para o Pages gera um site estático com `basePath` do repositório; os builds de desenvolvimento, de produção normal e dos testes E2E continuam como hoje.
- No build estático, o tema deixa de depender de `cookies()` do servidor e passa a ser resolvido no navegador antes da pintura, sem alterar o comportamento do build normal.
- O demo exibe um link para o Storybook somente quando o endereço do catálogo está configurado (build do Pages).
- O `README.md` passa a apontar para o site demonstrativo e para o Storybook publicados.
- Documentação do procedimento em `docs/`.

## Capabilities

### New Capabilities

- `site-publishing`: publicação gratuita, reproduzível e automática do demo e do Storybook como um único site estático, com links entre si e a partir do README.

### Modified Capabilities

- `admin-demo-application`: o demo pode ser gerado como site estático sob um subcaminho, preservando navegação, tema escolhido e acessibilidade, e oferece link para o Storybook quando configurado.

## Impact

- **Pacotes e APIs públicas:** nenhum pacote em `packages/` é alterado; não há mudança de API pública nem publicação no npm.
- **Aplicação de demonstração:** `apps/admin-demo` (configuração do Next.js, leitura do tema, link no cabeçalho). Sem regras de negócio.
- **Catálogo:** `apps/docs` apenas é construído e publicado; nenhuma story muda.
- **CI/infra:** novo workflow `.github/workflows/pages.yml`; configuração manual única em Settings → Pages (Source: GitHub Actions).
- **Dependências:** nenhuma nova no runtime.
- **Valor:** qualquer pessoa avalia o design system pelo navegador, sem instalar nada.

### Fora do escopo

- Publicação dos pacotes `@admin-ds/*` no npm (tratada depois).
- Preview por Pull Request (o GitHub Pages não oferece).
- Domínio próprio e link de volta do Storybook para o demo.
- Hospedagem com servidor (Vercel, Cloudflare etc.).

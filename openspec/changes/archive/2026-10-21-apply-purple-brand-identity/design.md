# Design

## Contexto

A marca é um conjunto de arquivos estáticos, não um componente. O demo, o
Storybook e o README os consomem por caminho. O Pages publica o demo na raiz de
`/admin-design-system/` e o Storybook em `/admin-design-system/storybook/`, então
nenhuma referência pode assumir a raiz do domínio.

## Decisões

**SVG como fonte, PNG derivado.** O SVG é a única fonte do desenho. O PNG
(512×512, transparente) é gerado dele para usos que exigem raster. Alternativa
descartada: manter o PNG desenhado à parte, o que já produziu um desenho
divergente do SVG.

**Paleta do logotipo independente dos tokens.** Roxo e lilás pertencem à marca; a
interface mantém a escala `brand*` azul. Evita redesenhar o tema por causa do
logotipo e mantém a customização por tokens inalterada.

**Favicon chapado separado do logotipo.** Em 16 e 32px o gradiente perde leitura.
O favicon usa cores sólidas e um símbolo maior, sem borda. O logotipo completo
mantém gradiente e uma borda branca sutil de 1px para não sumir sobre fundos
escuros.

**Sem emenda visível entre as duas cores do "A".** A parte branca e a lilás são
recortadas por `clipPath` com uma sobreposição mínima, em vez de dois paths
vizinhos, para evitar um fio claro causado por antialiasing.

**Texto dos lockups em curvas.** Os lockups são exibidos como imagem (README), onde
fontes da página não se aplicam. Converter o texto da Inter em curvas elimina a
dependência de fonte instalada. Não há kerning aplicado.

**IDs únicos nos SVGs.** `ads-logo-*`, `ads-mark-*`, `ads-fav-*` e `ads-lockup-*`
evitam colisão se mais de um SVG for incluído inline na mesma página.

**`basePath` explícito para o logotipo do demo.** `next/image` não aplica o
`basePath` a um `src` raiz-relativo. O export do Pages define
`NEXT_PUBLIC_BASE_PATH`; o cabeçalho monta o `src` com ele. `next dev` e
`next start` não definem a variável e continuam sem prefixo. É o mesmo padrão do
link do Storybook (`NEXT_PUBLIC_STORYBOOK_URL`). Alternativa descartada: depender
do `images.path`, que não altera `src` com `unoptimized`.

**Favicons do Storybook com `href` relativo ao documento.** `./admin-ds-favicon.svg`
resolve sob `/storybook/` no Pages e na raiz no Storybook local, tanto no manager
quanto em `iframe.html`.

**Título oculto visualmente em tela estreita.** Em 390px o logotipo fazia o título
quebrar em três linhas e o cabeçalho crescer de 64 para 76px. Até 30rem o logotipo
substitui o título visível, que permanece no DOM, visualmente oculto, para
tecnologias assistivas. Alternativas descartadas: reduzir o logotipo (ganha pouco
espaço) e aceitar a quebra em três linhas.

## Limites entre pacotes e Server/Client Components

Nenhum pacote publicado muda. O cabeçalho do demo continua sendo Server Component;
a leitura de `process.env.NEXT_PUBLIC_BASE_PATH` ocorre em tempo de build. Não há
Tailwind nem CSS novo na biblioteca.

## Acessibilidade

O logotipo do cabeçalho usa `alt=""`: o texto "Admin Design System" ao lado é o
nome acessível, e repetir o nome faria leitores de tela anunciá-lo duas vezes.
Os SVGs standalone têm `role="img"` com `<title>` e `<desc>` em português.

## Impacto

Sem dependências novas e sem efeito no bundle dos pacotes. Os SVGs somam poucos
KB; o PNG tem cerca de 55 KB. As cópias do favicon em `apps/docs/public` e
`apps/admin-demo/app/icon.svg` devem permanecer idênticas a
`assets/brand/admin-ds-favicon.svg`.

## Riscos

- Os snapshots visuais mudam porque o cabeçalho do demo ganha o logotipo; foram
  regenerados pelo workflow `update-visual-baselines.yml` e revisados.
- O favicon no Pages só é confirmado depois da publicação a partir de `develop`.

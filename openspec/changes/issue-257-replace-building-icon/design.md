## Contexto e fonte

`building` já é um nome público utilizado por composições. A geometria atual é de origem não documentada. O SVG substituto foi consultado diretamente em [Hugeicons Free Building06Icon](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/src/Building06Icon.ts), licença [MIT do pacote gratuito](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md), copyright (c) 2025 Hugeicons.

## Decisões

- Copiar **somente** os quatro paths oficiais na mesma ordem para `iconPaths.building`; não instalar `@hugeicons/core-free-icons`.
- O componente `AdsIcon` fornece SVG, `viewBox="0 0 24 24"`, `fill="none"`, `currentColor`, classe de tamanho e semântica decorativa/informativa. Preservá-los.
- Os caminhos oficiais usam `strokeWidth="1.5"`, `strokeLinejoin="round"`, e `strokeLinecap="round"` somente onde declarado; sobrescrever pontualmente `strokeLinecap="butt"` nos caminhos em que a fonte não fornece ponta arredondada para neutralizar a herança `AdsIcon`. Assim o SVG mantém a geometria e a aparência do original.
- Registrar comentário de origem ao lado de `building` e licença MIT integral em `THIRD_PARTY_NOTICES.md`. Não atribuir os 19 demais ícones à Hugeicons.
- O teste precisa assegurar quatro caminhos na ordem do original e contratos públicos/a11y; teste visual/Storybook para avaliar a troca de desenho, sem alterar snapshots sem revisão explícita.
- A mudança visual é intencional: prédios semelhantes, mas com porta visível e contorno redesenhado. Não mudar tokens, CSS, React Client/Server, responsividade ou exportações.

Alternativas descartadas: manter SVG de proveniência incerta (risco documental), usar Tabler `building` simétrico (maior divergência visual), instalar biblioteca inteira (dependência sem benefício para um SVG).

## Validação

`openspec validate --all --strict`, `npm run format`, testes unitários, lint, tipos, build e `npm run test:e2e`, além de revisão visual dos consumidores e conferência dos avisos de licença.

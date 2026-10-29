# Avisos de terceiros

Este arquivo preserva avisos de licenças aplicáveis a recursos de terceiros possivelmente incorporados ao Admin Design System.

A presença de um aviso **não comprova** que um SVG específico foi copiado, derivado ou originalmente desenhado pela biblioteca referenciada. A auditoria de `AdsIcon` identifica equivalências geométricas e semelhanças para os demais desenhos, mas a proveniência individual não foi comprovada. A exceção é `building`, substituído explicitamente por uma fonte MIT identificada abaixo. Veja [docs/icons-license-audit.md](docs/icons-license-audit.md).

## Feather Icons — MIT

- Projeto: [Feather Icons](https://github.com/feathericons/feather)
- Autor identificado no aviso original: Cole Bemis
- Licença: MIT
- Contexto: aviso preservado **preventivamente** devido a formas geométricas equivalentes (`chevronDown`, `chevronLeft`, `chevronRight`, `close`, `plus`) e possíveis adaptações (`logOut`, `moon`, `settings`, além de outros desenhos descritos na auditoria). Essas comparações não bastam para afirmar a origem exata do código.

Texto integral da licença do repositório Feather consultado em 2026-10-29:

```text
The MIT License (MIT)

Copyright (c) 2013-2023 Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Hugeicons Free — Building06Icon (MIT)

- Recurso incorporado: `AdsIcon name="building"`, usando exclusivamente os quatro `path` do `Building06Icon`.
- Pacote de origem: `@hugeicons/core-free-icons` (pacote gratuito).
- Código-fonte: [Building06Icon.ts](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/src/Building06Icon.ts).
- Licença original: [MIT do pacote gratuito](https://github.com/hugeicons/hugeicons/blob/main/packages/core-free-icons/LICENSE.md).
- Autor/aviso original: Copyright (c) 2025 Hugeicons.
- Adaptação de integração: somente encapsulamento JSX no `AdsIcon`; os comandos `d`, o `strokeWidth="1.5"` e o estilo das pontas de cada path foram preservados. Não foi adicionada dependência npm.

Texto integral da licença original do pacote Hugeicons Free consultada em 2026-10-29:

```text
MIT License

Copyright (c) 2025 Hugeicons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Referências comparadas, sem derivação confirmada

Lucide Icons (ISC/MIT conforme o desenho), Tabler Icons (MIT) e Heroicons (MIT) também foram consultados na auditoria; **não há evidência suficiente para atribuir os demais desenhos a esses projetos**. Não se afirma uso efetivo dessas obras apenas por sua inclusão nas comparações.

Os créditos e condições dessas outras licenças precisarão ser incorporados caso a origem de algum desenho nelas seja estabelecida.

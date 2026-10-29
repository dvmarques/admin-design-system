# Arquitetura dos ícones do Admin DS

**Estado:** módulo interno em `@admin-ds/components`, preparado para possível extração. **Não existe pacote `@admin-ds/icons` nesta versão.**

## Estrutura

```text
packages/components/src/
├── icon.tsx           # Reexport de compatibilidade
├── index.ts           # Export público do pacote (inalterado)
└── icons/
    ├── paths.tsx      # Geometria oficial dos 20 ícones licenciados
    ├── types.ts       # AdsIconName, AdsIconProps e AdsIconSize
    ├── icon.tsx       # Componente React AdsIcon e regras de tamanho
    └── index.ts       # Barrel do módulo interno
```

O consumidor continua importando `AdsIcon` e seus tipos de `@admin-ds/components`, sem subpath adicional nem nova dependência. O caminho `src/icon.tsx`, usado pelo próprio pacote e pelos testes, continua reexportando a implementação modular e preservando a identidade da função.

Os arquivos de SVG são apenas elementos JSX embutidos: o pacote não instala Feather, Lucide nem Hugeicons em tempo de execução. As 20 fontes e licenças estão discriminadas em [Auditoria de ícones](icons-license-audit.md) e os textos integrais de licença são entregues no `dist/THIRD_PARTY_NOTICES.md`, com o `LICENSE.md` do projeto.

## Extração futura (fora do escopo da PR #258)

Uma change independente deverá avaliar: (1) criação efetiva de `@admin-ds/icons`; (2) como desacoplar o uso interno de `classNames`; (3) publicação de licenças e atribuições com o pacote novo; (4) preservação de `AdsIcon` e dos tipos reexportados por `@admin-ds/components`; (5) estratégia de versionamento, builds e orçamento; (6) testes de API e identidade visual. A modularização atual não implica compromisso com um pacote separado ou alteração da API.

## Validação de compatibilidade

`packages/components/tests/icon-modules.test.tsx` confere os 20 nomes oficiais e a identidade dos exports público/legado/modular, além da renderização dos ícones. `content-primitives.test.tsx` cobre as geometrias, larguras de traço, acessibilidade e tamanhos. As mudanças visuais decorrentes da substituição dos SVGs ainda precisam ser revisadas no Storybook e nos snapshots da CI antes do merge.

## Why

A auditoria da issue #257 identificou desenhos SVG locais cuja origem individual não estava comprovada. O projeto é um design system reutilizável, portanto precisa permitir que consumidores rastreiem claramente as permissões de redistribuição dos ícones atuais.

## What Changes

Perfil **Standard**, agora ampliado por decisão do responsável em 29/10/2026: substituir a geometria visual dos **20 ícones** por SVGs oficiais com licença conhecida, preservando nomes e APIs.

- **18 Feather Icons (MIT):** `alertCircle`, `alertTriangle`, `bell`, `calendar`, `check`, `chevronDown`, `chevronLeft`, `chevronRight`, `close`, `logOut`, `monitor`, `moon`, `info`, `plus`, `sun`, `settings`, `search`, `user`.
- **1 Lucide Icons (ISC):** `chevronsUpDown`.
- **1 Hugeicons Free (MIT):** `building`.
- Manter `AdsIcon` e `AdsIconName`, cor herdada, acessibilidade, tamanhos e imports públicos existentes; nenhum pacote de ícones como dependência.
- Modularizar internamente o conjunto em `packages/components/src/icons/` (`paths.tsx`, `types.ts`, `icon.tsx` e `index.ts`), com `src/icon.tsx` como reexport de compatibilidade. **Não criar** `@admin-ds/icons` nesta etapa; deixar a separação preparada para extração futura.
- Registrar arquivo-fonte e licença para cada nome em `docs/icons-license-audit.md`, textos integrais das licenças em `THIRD_PARTY_NOTICES.md` e regra de distribuição em `docs/licensing.md`.
- Garantir que `@admin-ds/components` publique `LICENSE.md` e `THIRD_PARTY_NOTICES.md` em `dist/`, com verificação automatizada.
- Atualizar testes, Storybook, changelog, validação visual e limites de bundle se necessário, com medições reais.

Fora do escopo: alteração das exportações, tokens, estilos dos componentes, publicação npm, pacote separado de ícones, mudança dos commits históricos ou certificação de originalidade dos desenhos antigos.

## Capabilities

### Modified Capabilities

- `icon`: desenhos visuais dos nomes públicos agora correspondem a fontes MIT/ISC identificadas; acessibilidade e integração permanecem iguais.

## Impact

- `@admin-ds/components`: geometria dos 20 ícones e arquivos de aviso em `dist/`; possível alteração mensurável de tamanho do pacote.
- `apps/docs` e consumidores: alteração visual intencional nos ícones; API inalterada.
- Scripts de build/validação e documentos: garantir distribuição conforme licenças MIT/ISC.

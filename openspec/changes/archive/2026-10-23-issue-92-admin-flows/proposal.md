# Evoluir fluxos administrativos: ConfirmDialog e StepForm (#92)

## Perfil de risco

**Critical**: altera API pública (`AdsDialogProps`, `AdsStepDefinition`, `AdsStepFormLabels`), a semântica ARIA de um componente existente (`AdsConfirmDialog` passa a usar `alertdialog` em ações destrutivas) e o fluxo assíncrono de `AdsStepForm`. Exige validação de consumidores, SSR, `axe` e E2E.

## Problema

- `AdsConfirmDialog` sempre usa `role="dialog"`, embora a ação destrutiva peça o `alertdialog`. O painel interno já aceita `alertdialog`, mas `AdsDialogProps` não expõe `role`.
- `AdsStepForm` só avança e volta pelos botões: o indicador de etapas não é navegável.
- `validate` é síncrona; validações que dependem de servidor (unicidade, CEP) obrigam o consumidor a contornar o componente.

## Objetivo

1. Expor `role` (`dialog` | `alertdialog`) em `AdsDialogProps` e usar `alertdialog` em `AdsConfirmDialog` quando `destructive`.
2. Permitir navegar pelo indicador de etapas, apenas para etapas já válidas.
3. Aceitar `validate` que retorna `Promise<boolean>`, com estado de carregamento acessível.
4. Atualizar `docs/limitations.md`, stories, testes (componente, SSR, `axe`) e CHANGELOG.

## Pacotes e contratos

- Biblioteca: `packages/components` (`AdsDialogProps.role`) e `packages/admin` (`AdsConfirmDialog`, `AdsStepForm`, CSS compilado).
- Novas props e campos são opcionais; `AdsStepFormLabels` ganha `validating` com padrão em pt-BR.
- Demonstração: `apps/docs` (stories) e `apps/admin-demo` (consumo público, sem mudança de rotas).

## Fora do escopo

Etapas condicionais, desmontar etapas inativas, `role` em `AdsDrawer`, novas dependências e mudança de identidade visual.

## Compatibilidade e rollback

`validate` síncrona continua síncrona (sem microtask extra). O único efeito observável para consumidores existentes é que `AdsConfirmDialog` destrutivo (padrão) passa a expor `role="alertdialog"`; quem precisar do papel anterior passa `role="dialog"`. Reverter os commits da change desfaz tudo; nenhum export é removido.

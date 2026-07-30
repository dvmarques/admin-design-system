# Arquitetura do monorepo

## Limites de responsabilidade

- `packages/tokens` mantém a fonte, geração e distribuição dos design tokens.
- `packages/components` contém componentes React reutilizáveis e seus estilos.
- `packages/admin` conterá composições administrativas sem dependência de roteamento ou regras de negócio.
- `apps/docs` documenta e demonstra as APIs públicas dos pacotes.
- `apps/admin-demo` valida o consumo dos pacotes por uma aplicação Next.js App Router.

## APIs públicas

Consumidores devem importar apenas caminhos declarados no campo `exports` de cada pacote. Caminhos sob `src`, `scripts` e demais diretórios internos não fazem parte da API pública.

Pacotes React declaram `react` e `react-dom` como peer dependencies, evitando duplicação no bundle. Ferramentas de build, documentação, testes e Tailwind CSS permanecem como dependências de desenvolvimento até que uma necessidade de runtime seja comprovada.

## Estilos

Variáveis CSS semânticas serão a API de personalização visual. Tailwind CSS será usado internamente para gerar CSS distribuível, sem exigir que aplicações consumidoras instalem ou configurem Tailwind.

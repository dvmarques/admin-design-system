# Validar composições administrativas integradas (#320)

## Why

O épico #315 concluiu as capacidades públicas de ícones (#316), cabeçalhos semânticos (#317), classes responsivas opt-in (#318) e footer/dropdown/tema (#319). Restam a integração auditável dos cenários e evidências de compatibilidade, evitando tratar exemplos isolados como comprovação de um fluxo administrativo completo.

## What Changes

- Criar um índice de validação integrada no Admin Demo, reutilizando as páginas de consulta, formulário e dashboard existentes e o único AdsAdminShell do layout compartilhado.
- Completar a consulta com paginação, ações por linha e estados controláveis de carregamento e erro, preservando busca, vazio e ação de filtro já existentes.
- Completar o formulário com campo desabilitado e feedback de sucesso/erro, sem transporte nem armazenamento de dados.
- Expor rotas de validação no catálogo da Demo e referências cruzadas no Storybook e na documentação, distinguindo padrões, primitivos e estados.
- Executar testes de integração Playwright, axe, teclado, foco, temas, reflow e hidratação, além das verificações de distribuição/bundle existentes. Registrar métricas reais do SHA final e riscos não cobertos.

## Perfil e impacto

**Critical**, por abranger demonstrações, compatibilidade de pacotes e acessibilidade integrada de mais de uma aplicação. Afeta apenas `apps/admin-demo`, `apps/docs`, `e2e`, `docs` e `openspec`. **Nenhum novo export, token, dependência de runtime ou CSS publicado** é planejado. Os pacotes `tokens`, `components` e `admin` conservam seus contratos públicos. A implementação da aplicação cliente deve usar somente esses exports e o CSS compilado já importado em seu layout.

## Valor ao consumidor

O consumidor pode partir de quatro composições ligadas entre si, executar casos vazios/de erro/de carregamento, visualizar a navegação e comparar página sem card com card de indicadores sem depender de um backend nem adotar Tailwind.

## Fora do escopo

Serviços externos, autenticação real, persistência, novos componentes públicos, ícones obrigatórios, reestruturação de layout ou de theme engine, aceitação automática de snapshots, merge, archive ou publicação de release.

## 1. Preparação e OpenSpec

- [x] 1.1 Conferir #198, dependências encerradas, contratos dos pacotes, skill adaptativa, configuração OpenSpec e guias existentes.
- [x] 1.2 Criar branch `docs/issue-198-consumer-adoption` a partir de `develop` e a change spec-driven; revisar escopo e risco Fast.
- [ ] 1.3 Validar a change em OpenSpec estrito e corrigir inconsistências encontradas.

## 2. Documentação da entrada de adoção

- [x] 2.1 Reestruturar README raiz: proposta de valor real, Demo/Storybook, instalação progressiva, exemplo Next.js, tabela dos quatro pacotes, temas, limitações, licenciamento e contribuição curta.
- [x] 2.2 Completar READMEs de tokens, components, admin e highlighted-code com requisitos, exemplos, CSS, peers, opt-in e links absolutos válidos no npm.
- [x] 2.3 Documentar em integração exemplo externo reproduzível com CSS em ordem, limites Server/Client, fonte, tema e ausência de Tailwind no consumidor; conferir contra manifests/exports da #194.

## 3. Migração e rastreabilidade

- [x] 3.1 Completar guia de migração dos quatro nomes, subpath de máscara, ThemeToggle → AdsThemeControl e compatibilidade sem depreciação fictícia.
- [x] 3.2 Atualizar changelog por componente com ThemeControl, AccountMenu, NotificationCenter, OrganizationSwitcher, evolução do shell e referências #182, #185 e #187, sem inventar versões publicadas.
- [x] 3.3 Revisar limitações por componente, tema, acessibilidade e demonstração, preservando a diferença entre validação manual e automatizada.
- [x] 3.4 Corrigir exclusões descritas em `docs/admin-demo-catalog.md` de acordo com o teste real, incluindo `getAdsSmartTableCsv`; não alterar o teste.
- [x] 3.5 Registrar efeito em `CHANGELOG.md` e conferir links cruzados, disponibilidade pré-npm e fronteira documental da #195.

## 4. Revisão e validação

- [x] 4.1 Revisar cada snippet com exports, manifests e CSS reais; conferir ausência de imports internos e dependência obrigatória de Shiki/máscara.
- [ ] 4.2 Executar formatação dos arquivos, `npm run format`, `npm run validate` e OpenSpec estrito conforme AGENTS; registrar testes indisponíveis, skips e evidência da CI (sem declarar aprovação presumida).
- [ ] 4.3 Abrir PR Draft para `develop`, após revisão marcar Ready, verificar checks do SHA final e registrar achados/pendências. Não fazer archive nem merge.

## Evidências da revisão estática

- Branch e change registradas, com proposta, design, tasks e delta de spec.
- README principal, quatro READMEs de pacote, integração externa, migração, histórico, limitações e catálogo revisados e commitados; CHANGELOG da versão em andamento atualizado.
- Nomes, imports, `package.json#exports`, peer `react-imask` e Shiki opcional comparados ao código/manifests de `develop`; correção do exemplo de `ReactNode` na revisão.
- A lista de exclusões do catálogo foi corrigida para incluir `getAdsSmartTableCsv`, conforme o teste existente, sem alteração do teste.
- Links e anchors cruzados entre README, integração, migração, limitações e histórico conferidos estaticamente, sem erro nesse conjunto.
- Gates de formatação, OpenSpec, build, qualidade e E2E **não** executados localmente neste ambiente. A validação por GitHub Actions deve ser consultada no SHA da PR Ready; checks pulados não valem como teste executado.

## Evidências e limites

A execução desta sessão usa GitHub conectado, sem checkout de trabalho no container; validação de comandos locais depende de ambiente com Node 24.15+/npm 11.19.1 ou CI da PR. Tasks não verificadas permanecem abertas.

## 1. Inventário e contrato de tokens

- [x] 1.1 Inventariar os tokens CSS e metadados TypeScript atuais, seus consumidores e quaisquer valores visuais codificados nos componentes existentes.
- [x] 1.2 Mapear tokens públicos que exigem aliases de compatibilidade e documentar qualquer impacto de migração antes de remover ou renomear valores.
- [x] 1.3 Definir os nomes públicos `--ads-*` para família, escala, pesos, alturas de linha, papéis de superfície/conteúdo, foco e estados semânticos, mantendo equivalência nos metadados TypeScript.

## 2. Fundação tipográfica e de temas

- [x] 2.1 Implementar a pilha tipográfica padrão `Inter, Roboto, sans-serif`, permitindo sobrescrita pelo token público documentado e excluindo fontes proprietárias da distribuição.
- [x] 2.2 Adicionar aos artefatos distribuídos os avisos SIL Open Font License 1.1 (Inter) e Apache License 2.0 (Roboto), caso seus arquivos sejam empacotados.
- [x] 2.3 Implementar a escala `12/14/16/18/20/24/30/36 px`, pesos `400/500/600/700` e alturas de linha semânticas nos tokens globais.
- [x] 2.4 Implementar os papéis de canvas, superfícies, conteúdo, bordas, ação primária e foco para os temas claro e escuro conforme a base aprovada no design.
- [x] 2.5 Implementar tokens de conteúdo, fundo sutil, borda e interação para os estados informativo, sucesso, aviso e erro nos dois temas.
- [x] 2.6 Atualizar os mapeamentos estáticos do Tailwind para consumir exclusivamente os tokens semânticos revisados, sem gerar classes dinamicamente.

## 3. Propagação pelos componentes existentes

- [x] 3.1 Migrar os componentes existentes que usam valores tipográficos ou cromáticos específicos para os papéis globais revisados, preservando suas APIs públicas.
- [x] 3.2 Revisar estados de foco, desabilitado, erro, carregamento e vazio já suportados para assegurar que usem tokens adequados e não dependam apenas de cor.
- [x] 3.3 Validar a aparência responsiva dos componentes afetados em larguras reduzidas, com a escala tipográfica e os fallbacks de fonte configurados.

## 4. Documentação e regressão visual

- [x] 4.1 Atualizar a documentação dos tokens com a pilha tipográfica, escala, pesos, paletas claro/escuro, estados e exemplos de sobrescrita por consumidores.
- [x] 4.2 Atualizar as histórias dos componentes existentes afetados para demonstrar seus estados representativos nos temas claro e escuro, sem criar novas famílias de componentes.
- [x] 4.3 Atualizar e revisar os snapshots visuais aprovados para os componentes e estados afetados nos dois temas.

## 5. Acessibilidade e validação de distribuição

- [x] 5.1 Adicionar ou atualizar a verificação automatizada dos pares críticos de contraste para texto, controles, estados e foco, com mínimo WCAG 2.2 AA aplicável em ambos os temas.
- [x] 5.2 Executar testes de acessibilidade aplicáveis para foco visível, navegação por teclado e estados semânticos dos componentes afetados.
- [x] 5.3 Validar o CSS compilado e os tokens públicos na aplicação Next.js de demonstração, incluindo alternância de tema sem recompilação da biblioteca.
- [x] 5.4 Executar formatação, lint, tipos, testes, build e validação visual; corrigir falhas antes de considerar a change pronta.
- [x] 5.5 Executar `npm run format` e confirmar que todos os arquivos novos e alterados estão formatados antes de arquivar a change.

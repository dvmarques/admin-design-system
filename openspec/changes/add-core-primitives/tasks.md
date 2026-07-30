## 1. Base compartilhada

- [x] 1.1 Registrar a convenção global no contexto e nas convenções do projeto: componentes e tipos públicos `Ads*`, classes públicas `ads-*` e tokens `--ads-*`.
- [x] 1.2 Criar utilitários internos mínimos para composição estática de classes e aplicar o contrato de `className` aos elementos públicos.
- [x] 1.3 Atualizar a configuração de estilos para que todas as classes das primitivas sejam incluídas no CSS compilado sem efeitos globais no consumidor.

## 2. Ações e feedback

- [ ] 2.1 Implementar `Button` com variantes, tamanhos, atributos nativos, foco visível e prevenção de acionamento nos estados desabilitado e carregando.
- [ ] 2.2 Implementar `LoadingIndicator` com tamanhos, semântica acessível de espera, suporte a temas e preferência de movimento reduzido.
- [ ] 2.3 Adicionar testes unitários e de acessibilidade para os comportamentos públicos de `Button` e `LoadingIndicator`, incluindo teclado, estados e nomes acessíveis.

## 3. Conteúdo e identidade

- [ ] 3.1 Implementar `Badge` com variantes semânticas, conteúdo textual e comportamento responsivo baseado em tokens.
- [ ] 3.2 Implementar `Avatar` com tamanhos, imagem, fallback e contrato de texto alternativo para conteúdo significativo e decorativo.
- [ ] 3.3 Implementar `Icon` com conjunto local inicial, nomes tipados, tamanhos e semântica distinta para uso decorativo ou informativo.
- [ ] 3.4 Implementar `Typography` com texto e títulos semanticamente corretos, escalas públicas e estilos responsivos baseados em tokens.
- [ ] 3.5 Adicionar testes unitários e de acessibilidade para `Badge`, `Avatar`, `Icon` e `Typography`, cobrindo fallback, semântica e temas aplicáveis.

## 4. Composição visual

- [ ] 4.1 Implementar `Surface` com níveis visuais públicos, conteúdo composicionável e estilos sem largura fixa ou regras globais.
- [ ] 4.2 Adicionar testes para variantes de `Surface`, customização por tokens, responsividade e temas claro e escuro.

## 5. API, documentação e consumo

- [ ] 5.1 Exportar `AdsButton`, `AdsBadge`, `AdsAvatar`, `AdsSurface`, `AdsTypography`, `AdsIcon`, `AdsLoadingIndicator` e seus tipos pelo ponto de entrada público de `@admin-ds/components`, verificando que nenhuma API exige caminhos internos.
- [ ] 5.2 Criar uma história Storybook para cada componente público, incluindo variantes, tamanhos, estados não ideais e visualização nos dois temas.
- [ ] 5.3 Documentar propósito, propriedades, valores padrão, requisitos de acessibilidade e integração de cada primitiva no catálogo visual.
- [ ] 5.4 Atualizar a aplicação Next.js de referência com exemplos que importem as primitivas e o CSS exclusivamente pelos exports públicos.
- [ ] 5.5 Verificar o consumo da folha CSS compilada na aplicação Next.js sem configuração Tailwind do consumidor.

## 6. Validação de entrega

- [ ] 6.1 Executar e corrigir format, lint, typecheck, testes unitários e verificações de acessibilidade dos pacotes afetados.
- [ ] 6.2 Executar build, inspeção de CSS e verificação de pacote, confirmando que os novos exports e estilos distribuídos estão presentes.
- [ ] 6.3 Executar testes visuais e E2E aplicáveis nos temas claro e escuro e registrar qualquer limitação conhecida antes da conclusão.

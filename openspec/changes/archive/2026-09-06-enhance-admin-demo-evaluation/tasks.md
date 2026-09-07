## 1. Cenários de estado e carregamento

- [x] 1.1 Adicionar ao admin-demo um cenário comparativo de AdsSkeleton e AdsLoadingIndicator com estrutura administrativa previsível, e verificar os temas claro/escuro e redução de movimento no navegador.
- [x] 1.2 Ampliar o formulário de referência com estados normal, erro, sucesso, somente leitura e desabilitado para controles textuais e de seleção, e verificar rótulos, ajuda, mensagens e comportamento nativo por teclado.

## 2. Fluxos existentes compostos

- [x] 2.1 Implementar um fluxo local de ação destrutiva com AdsButton, AdsDialog e AdsToast, incluindo confirmação, cancelamento, retorno de foco e variantes de feedback, e verificar com testes de interação.

## 3. Layout, responsividade e qualidade

- [x] 3.1 Refinar os estilos locais do admin-demo para separar layout de demonstração da aparência dos componentes, usar tokens públicos nas superfícies locais e verificar a visualização compacta sem overflow horizontal.
- [x] 3.2 Expandir testes do admin-demo para consumo de CSS e exports públicos, tema e fluxos críticos adicionados, e executar npm run test --workspace @admin-ds/admin-demo.
- [x] 3.3 Executar npm run format, npm run lint, npm run typecheck e npm run build --workspace @admin-ds/admin-demo, corrigindo falhas antes de concluir.

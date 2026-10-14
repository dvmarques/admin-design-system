## 1. Fundação e contratos públicos

- [ ] 1.1 Revisar o placeholder atual de `@admin-ds/admin`, dependências do workspace e contratos públicos existentes em `@admin-ds/components` que serão reutilizados pelo shell.
- [ ] 1.2 Definir a API pública final de `AdsAdminShell` e suas partes estruturais (`Header`, `Sidebar`, `Content` ou contrato equivalente), incluindo tipos React, atributos HTML suportados, nomes acessíveis, forma de expor o estado estrutural da sidebar e contrato público do trigger mobile.
- [ ] 1.3 Substituir `createAdminShell` pelo componente React real, preservando `react`/`react-dom` como peer dependencies e sem introduzir dependência de runtime desnecessária.
- [ ] 1.4 Definir explicitamente a relação de runtime entre `@admin-ds/admin` e `@admin-ds/components` caso o shell importe componentes públicos como `AdsDrawer`, usando dependency/peer dependency compatível com o modelo de publicação do workspace e evitando resolução incidental do monorepo.
- [ ] 1.5 Mapear tokens existentes para superfícies, bordas, texto, foco, espaçamento, sombras e motion; criar novos tokens somente quando houver conceito estrutural público realmente ausente.
- [ ] 1.6 Garantir CSS distribuído consumível sem Tailwind na aplicação final, exportar estilos próprios de `@admin-ds/admin` quando necessários e documentar explicitamente quaisquer imports públicos de CSS requeridos de `@admin-ds/components`.
- [ ] 1.7 Atualizar verificação de pacote/exports e testes de consumo para detectar dependências ou estilos não declarados.

## 2. Estrutura do Admin Shell

- [ ] 2.1 Implementar o root `AdsAdminShell` com organização responsiva de header, sidebar e conteúdo principal.
- [ ] 2.2 Implementar região de header composicional para branding, ações, usuário e controles fornecidos pela aplicação, sem props de domínio específicas.
- [ ] 2.3 Implementar região de sidebar composicional com nome acessível configurável e suporte a conteúdo React arbitrário por APIs públicas, sem assumir que `AdsNav` atual atende automaticamente ao layout vertical.
- [ ] 2.4 Implementar região principal com landmark `main`, dimensionamento seguro, overflow adequado e preservação do fluxo de foco.
- [ ] 2.5 Implementar classes, data attributes e/ou CSS variables públicas apenas quando necessárias para estilização e integração previsível pelo consumidor.

## 3. Sidebar desktop e preferências

- [ ] 3.1 Implementar estados expandido e recolhido da sidebar em viewports amplas sem sobrepor o conteúdo principal.
- [ ] 3.2 Implementar contrato controlado (`collapsed`/equivalente + callback) e não controlado (`defaultCollapsed`/equivalente) seguindo convenções React previsíveis.
- [ ] 3.3 Tratar `collapsed`/`defaultCollapsed` exclusivamente como preferência estrutural da sidebar desktop, sem derivar automaticamente largura compacta, labels ocultos ou outra apresentação reduzida no drawer mobile.
- [ ] 3.4 Expor o estado estrutural da sidebar de forma suficiente para que a composição consumidora adapte labels, ícones ou outra representação quando recolhida no desktop, sem transformação automática de conteúdo pelo shell.
- [ ] 3.5 Garantir que o estado recolhido não torne controles existentes inacessíveis; conteúdo fornecido pela aplicação deve continuar com nome acessível e ordem de teclado válida.
- [ ] 3.6 Manter `mobileOpen`/equivalente como estado separado de `collapsed`, sem derivação automática entre preferência desktop e abertura móvel.
- [ ] 3.7 Não persistir automaticamente a preferência; documentar exemplo de persistência externa controlada pelo consumidor.
- [ ] 3.8 Cobrir expansão/recolhimento, modo controlado, modo não controlado, atualização externa, adaptação explícita do conteúdo consumidor e independência entre `collapsed` e `mobileOpen` com testes unitários e de acessibilidade.

## 4. Navegação responsiva

- [ ] 4.1 Definir e implementar o breakpoint estrutural do shell usando CSS responsivo sempre que possível, evitando listeners de viewport desnecessários.
- [ ] 4.2 Em viewports estreitas, retirar a sidebar persistente do fluxo e disponibilizar contrato público para abertura da navegação móvel.
- [ ] 4.3 Garantir que o drawer mobile use apresentação completa por padrão, sem herdar largura recolhida, labels ocultos ou representação compacta da sidebar desktop quando `collapsed` estiver ativo; adaptações específicas para mobile devem depender de composição explícita do consumidor.
- [ ] 4.4 Implementar `MobileMenuTrigger` ou API equivalente, permitindo composição visual pelo consumidor enquanto o shell coordena `aria-expanded`, associação com a navegação, abertura/fechamento e retorno de foco.
- [ ] 4.5 Garantir que `aria-expanded` e demais atributos de estado do trigger reflitam a apresentação móvel efetivamente aberta/operável, e não apenas uma prop controlada temporariamente suprimida no desktop.
- [ ] 4.6 Reutilizar `AdsDrawer` para a navegação móvel quando compatível, preservando portal, backdrop, foco, Escape e retorno de foco sem duplicar lógica de overlay.
- [ ] 4.7 Implementar contrato controlado e não controlado para abertura da navegação móvel e callback de alteração para coordenação pela aplicação, garantindo que o trigger não mantenha estado concorrente.
- [ ] 4.8 Implementar a transição desktop/mobile preservando uma única instância lógica do conteúdo arbitrário da sidebar por vez; não manter duas montagens simultâneas como estratégia padrão.
- [ ] 4.9 Implementar mobile aberto → desktop no modo não controlado encerrando o overlay e resetando o estado interno `mobileOpen`/equivalente para impedir estado latente e reabertura inesperada ao voltar para mobile.
- [ ] 4.10 Implementar mobile aberto → desktop no modo controlado sem mutar a prop externa, disparando callback de fechamento e desativando imediatamente backdrop, portal, focus trap e qualquer representação mobile operável enquanto o layout desktop estiver ativo.
- [ ] 4.11 No modo controlado, registrar apenas coordenação transitória suficiente para invalidar o `true` antigo após a solicitação de fechamento por breakpoint; não tratar essa coordenação como segunda fonte pública de verdade para `mobileOpen`.
- [ ] 4.12 Exigir reconhecimento do fechamento controlado (`mobileOpen=false`) antes de aceitar nova abertura (`false → true`) após a transição para desktop, impedindo que um `true` antigo cause reabertura quando a viewport voltar ao mobile.
- [ ] 4.13 Garantir que a transição mobile aberto → desktop termine com foco em elemento válido ainda montado e nunca force retorno para trigger que esteja desmontado, oculto ou não focável no desktop.
- [ ] 4.14 Garantir que desktop → mobile após o fechamento coordenado mantenha o drawer fechado até nova ação explícita no modo não controlado ou nova intenção controlada reconhecida após o fechamento.
- [ ] 4.15 Tornar a estratégia responsiva segura para SSR/hidratação: não acessar `window`/`matchMedia` no servidor, manter primeiro render determinístico e evitar hydration mismatch.
- [ ] 4.16 Validar que mudança de breakpoint não produz IDs duplicados, estado interno duplicado, efeitos/listeners duplicados, backdrop/focus trap residual ou duas representações operáveis na árvore de acessibilidade.
- [ ] 4.17 Caso uma exceção exija duas montagens simultâneas, registrar a justificativa técnica no design e cobrir explicitamente colisões de IDs, estado, efeitos e acessibilidade antes de aceitar a solução.
- [ ] 4.18 Respeitar `prefers-reduced-motion` nas transições estruturais e validar navegação por teclado em desktop e mobile.

## 5. Integração com componentes e temas

- [ ] 5.1 Validar se `AdsNav` atende ao uso lateral apenas por sua API pública; se faltar orientação vertical e a capacidade for genérica, evoluir `AdsNav` minimamente e cobrir essa evolução separadamente. Caso contrário, demonstrar a sidebar com outra composição pública apropriada.
- [ ] 5.2 Demonstrar composição do shell com componentes públicos adequados como `AdsButton`, `AdsIcon`, `AdsDrawer` e `ThemeToggle`, sem imports privados.
- [ ] 5.3 Garantir que tema claro/escuro seja herdado pelo shell pelos tokens existentes, sem estado de tema próprio em `@admin-ds/admin`.
- [ ] 5.4 Validar foco visível, contraste, divisores, superfícies e estados estruturais em ambos os temas.
- [ ] 5.5 Confirmar que nenhuma mudança em `@admin-ds/components` é necessária além de eventual capacidade genérica indispensável identificada no item 5.1.

## 6. Documentação e demonstração

- [ ] 6.1 Criar documentação Storybook para API, composição das regiões, trigger mobile, desktop expandido, desktop recolhido, mobile fechado/aberto e estados controlados/não controlados.
- [ ] 6.2 Adicionar exemplo de composição com branding, navegação, ações e controle de tema sem acoplamento a um domínio específico.
- [ ] 6.3 Demonstrar como o consumidor posiciona/customiza o trigger mobile sem reproduzir a coordenação interna de estado e acessibilidade do shell.
- [ ] 6.4 Demonstrar como o consumidor adapta o conteúdo da sidebar ao estado recolhido no desktop sem depender de transformação automática feita pelo shell e deixar explícito que o drawer mobile permanece completo por padrão.
- [ ] 6.5 Atualizar `apps/admin-demo` com uma demonstração mínima do Admin Shell usando apenas `@admin-ds/admin`, `@admin-ds/components` e CSS públicos.
- [ ] 6.6 Manter a demo desta change limitada à validação do shell, sem antecipar a remodelação completa prevista em `add-nextjs-admin-demo`.
- [ ] 6.7 Documentar responsabilidades do consumidor: roteamento, autenticação, autorização, persistência de preferências, definição dos itens de navegação, adaptação explícita do conteúdo recolhido, conteúdo do header e imports de estilos públicos necessários.

## 7. Testes e validação

- [ ] 7.1 Criar testes unitários para landmarks, composição, atributos públicos, expansão/recolhimento, trigger mobile e contratos controlado/não controlado.
- [ ] 7.2 Criar testes de acessibilidade para nomes de navegação, estado e associação ARIA do trigger, foco, Escape, retorno de foco e ausência de conteúdo interativo duplicado.
- [ ] 7.3 Atualizar testes de consumo público para exports, tipos, dependencies/peer dependencies declaradas, build e CSS compilado/importável de `@admin-ds/admin` e integrações requeridas de `@admin-ds/components`.
- [ ] 7.4 Criar testes com conteúdo de sidebar que possua ID, estado interno e efeito próprio para garantir ausência de duas montagens simultâneas entre desktop e mobile.
- [ ] 7.5 Criar testes específicos garantindo que `collapsed`/`defaultCollapsed` afetem somente a sidebar desktop e que o drawer mobile permaneça completo por padrão, inclusive quando a preferência desktop estiver recolhida.
- [ ] 7.6 Criar testes de mobile aberto → desktop no modo não controlado validando reset de `mobileOpen`, fechamento do drawer, foco válido e ausência de backdrop, portal e focus trap residual.
- [ ] 7.7 Criar testes de mobile aberto → desktop no modo controlado validando callback de fechamento, não mutação da prop, desativação dos efeitos do overlay e ausência de segunda instância operável da navegação.
- [ ] 7.8 Criar teste controlado em que a prop permanece `true` após o callback e a viewport volta ao mobile, garantindo que o drawer não reabra até ocorrer reconhecimento `false` seguido de nova abertura explícita `true`.
- [ ] 7.9 Criar teste garantindo que `aria-expanded` reflita o overlay efetivamente operável durante a supressão controlada no desktop.
- [ ] 7.10 Criar teste de foco para mobile aberto → desktop quando o trigger mobile deixa de estar focável, garantindo destino válido e ausência de foco em conteúdo desmontado.
- [ ] 7.11 Criar teste desktop → mobile após fechamento coordenado garantindo que o drawer não reabra sem nova ação explícita ou nova intenção controlada reconhecida.
- [ ] 7.12 Criar teste de renderização sem DOM/SSR e hidratação para garantir ausência de acesso a APIs de viewport no servidor e ausência de hydration mismatch no primeiro render do cliente.
- [ ] 7.13 Criar/atualizar Playwright para fluxo desktop, fluxo mobile, abertura/fechamento pelo trigger, teclado e mudanças de viewport, incluindo mobile aberto → desktop → mobile.
- [ ] 7.14 Atualizar snapshots visuais representativos nos temas claro e escuro para desktop expandido/recolhido e mobile.
- [ ] 7.15 Executar format, lint, typecheck, testes, build, E2E e validação OpenSpec strict; corrigir falhas relacionadas à change.
- [ ] 7.16 Revisar o diff final e confirmar que a implementação permanece dentro do escopo da Issue #15 antes de concluir e arquivar a change.

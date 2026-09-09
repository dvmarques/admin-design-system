## 1. Fundação e contratos públicos

- [ ] 1.1 Revisar o placeholder atual de `@admin-ds/admin`, dependências do workspace e contratos públicos existentes em `@admin-ds/components` que serão reutilizados pelo shell.
- [ ] 1.2 Definir a API pública final de `AdsAdminShell` e suas partes estruturais (`Header`, `Sidebar`, `Content` ou contrato equivalente), incluindo tipos React, atributos HTML suportados, nomes acessíveis e forma de expor o estado estrutural da sidebar à composição consumidora.
- [ ] 1.3 Substituir `createAdminShell` pelo componente React real, preservando `react`/`react-dom` como peer dependencies e sem introduzir dependência de runtime desnecessária.
- [ ] 1.4 Mapear tokens existentes para superfícies, bordas, texto, foco, espaçamento, sombras e motion; criar novos tokens somente quando houver conceito estrutural público realmente ausente.
- [ ] 1.5 Garantir CSS distribuído consumível sem Tailwind na aplicação final e atualizar verificação de pacote/exports de `@admin-ds/admin`.

## 2. Estrutura do Admin Shell

- [ ] 2.1 Implementar o root `AdsAdminShell` com organização responsiva de header, sidebar e conteúdo principal.
- [ ] 2.2 Implementar região de header composicional para branding, ações, usuário e controles fornecidos pela aplicação, sem props de domínio específicas.
- [ ] 2.3 Implementar região de sidebar composicional com nome acessível configurável e suporte a conteúdo React arbitrário por APIs públicas, sem assumir que `AdsNav` atual atende automaticamente ao layout vertical.
- [ ] 2.4 Implementar região principal com landmark `main`, dimensionamento seguro, overflow adequado e preservação do fluxo de foco.
- [ ] 2.5 Implementar classes, data attributes e/ou CSS variables públicas apenas quando necessárias para estilização e integração previsível pelo consumidor.

## 3. Sidebar desktop e preferências

- [ ] 3.1 Implementar estados expandido e recolhido da sidebar em viewports amplas sem sobrepor o conteúdo principal.
- [ ] 3.2 Implementar contrato controlado (`collapsed`/equivalente + callback) e não controlado (`defaultCollapsed`/equivalente) seguindo convenções React previsíveis.
- [ ] 3.3 Expor o estado estrutural da sidebar de forma suficiente para que a composição consumidora adapte labels, ícones ou outra representação quando recolhida, sem transformação automática de conteúdo pelo shell.
- [ ] 3.4 Garantir que o estado recolhido não torne controles existentes inacessíveis; conteúdo fornecido pela aplicação deve continuar com nome acessível e ordem de teclado válida.
- [ ] 3.5 Não persistir automaticamente a preferência; documentar exemplo de persistência externa controlada pelo consumidor.
- [ ] 3.6 Cobrir expansão/recolhimento, modo controlado, modo não controlado, atualização externa e adaptação do conteúdo consumidor com testes unitários e de acessibilidade.

## 4. Navegação responsiva

- [ ] 4.1 Definir e implementar o breakpoint estrutural do shell usando CSS responsivo sempre que possível, evitando listeners de viewport desnecessários.
- [ ] 4.2 Em viewports estreitas, retirar a sidebar persistente do fluxo e disponibilizar controle acessível para abertura da navegação móvel.
- [ ] 4.3 Reutilizar `AdsDrawer` para a navegação móvel quando compatível, preservando portal, backdrop, foco, Escape e retorno de foco sem duplicar lógica de overlay.
- [ ] 4.4 Implementar contrato controlado e não controlado para abertura da navegação móvel e callback de alteração para coordenação pela aplicação.
- [ ] 4.5 Garantir que somente uma representação operável da navegação esteja exposta por vez e que elementos ocultos não permaneçam focáveis ou duplicados na árvore de acessibilidade.
- [ ] 4.6 Respeitar `prefers-reduced-motion` nas transições estruturais e validar navegação por teclado em desktop e mobile.

## 5. Integração com componentes e temas

- [ ] 5.1 Validar se `AdsNav` atende ao uso lateral apenas por sua API pública; se faltar orientação vertical e a capacidade for genérica, evoluir `AdsNav` minimamente e cobrir essa evolução separadamente. Caso contrário, demonstrar a sidebar com outra composição pública apropriada.
- [ ] 5.2 Demonstrar composição do shell com componentes públicos adequados como `AdsButton`, `AdsIcon`, `AdsDrawer` e `ThemeToggle`, sem imports privados.
- [ ] 5.3 Garantir que tema claro/escuro seja herdado pelo shell pelos tokens existentes, sem estado de tema próprio em `@admin-ds/admin`.
- [ ] 5.4 Validar foco visível, contraste, divisores, superfícies e estados estruturais em ambos os temas.
- [ ] 5.5 Confirmar que nenhuma mudança em `@admin-ds/components` é necessária além de eventual capacidade genérica indispensável identificada no item 5.1.

## 6. Documentação e demonstração

- [ ] 6.1 Criar documentação Storybook para API, composição das regiões, desktop expandido, desktop recolhido, mobile fechado/aberto e estados controlados/não controlados.
- [ ] 6.2 Adicionar exemplo de composição com branding, navegação, ações e controle de tema sem acoplamento a um domínio específico.
- [ ] 6.3 Demonstrar como o consumidor adapta o conteúdo da sidebar ao estado recolhido sem depender de transformação automática feita pelo shell.
- [ ] 6.4 Atualizar `apps/admin-demo` com uma demonstração mínima do Admin Shell usando apenas `@admin-ds/admin`, `@admin-ds/components` e CSS públicos.
- [ ] 6.5 Manter a demo desta change limitada à validação do shell, sem antecipar a remodelação completa prevista em `add-nextjs-admin-demo`.
- [ ] 6.6 Documentar responsabilidades do consumidor: roteamento, autenticação, autorização, persistência de preferências, definição dos itens de navegação, adaptação do conteúdo recolhido e conteúdo do header.

## 7. Testes e validação

- [ ] 7.1 Criar testes unitários para landmarks, composição, atributos públicos, expansão/recolhimento e contratos controlado/não controlado.
- [ ] 7.2 Criar testes de acessibilidade para nomes de navegação, estado dos controles, foco, Escape, retorno de foco e ausência de conteúdo interativo duplicado.
- [ ] 7.3 Atualizar testes de consumo público para exports, tipos, peer dependencies, build e CSS compilado de `@admin-ds/admin`.
- [ ] 7.4 Criar/atualizar Playwright para fluxo desktop, fluxo mobile, abertura/fechamento da navegação, teclado e mudança de viewport.
- [ ] 7.5 Atualizar snapshots visuais representativos nos temas claro e escuro para desktop expandido/recolhido e mobile.
- [ ] 7.6 Executar format, lint, typecheck, testes, build, E2E e validação OpenSpec strict; corrigir falhas relacionadas à change.
- [ ] 7.7 Revisar o diff final e confirmar que a implementação permanece dentro do escopo da Issue #15 antes de concluir e arquivar a change.

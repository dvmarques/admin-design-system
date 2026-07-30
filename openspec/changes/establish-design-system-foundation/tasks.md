## 1. Estrutura do workspace

- [x] 1.1 Inicializar o `package.json` raiz como workspace privado, declarar os diretórios `apps/*` e `packages/*` e confirmar que `npm install` reconhece todos os workspaces.
- [x] 1.2 Criar os workspaces `packages/tokens`, `packages/components`, `packages/admin`, `apps/docs` e `apps/admin-demo`, cada um com manifesto e scripts mínimos executáveis.
- [x] 1.3 Definir nomes privados provisórios para os pacotes e declarar `exports`, `types`, `files` e `sideEffects` sem expor caminhos internos.
- [x] 1.4 Configurar TypeScript estrito na raiz e configurações especializadas para bibliotecas React, Storybook e Next.js, verificando que todos os workspaces executam typecheck.
- [x] 1.5 Configurar formatação e lint compartilhados, incluindo regras que impeçam imports internos entre pacotes e façam o comando raiz falhar ao encontrar violações.
- [x] 1.6 Criar scripts raiz para format, lint, typecheck, test, build e validação completa, confirmando que cada script encaminha a execução aos workspaces aplicáveis.
- [x] 1.7 Documentar a estrutura do monorepo, os limites entre pacotes e a convenção para APIs públicas e dependências de runtime.

## 2. Fonte e geração de design tokens

- [x] 2.1 Definir a fonte estruturada de tokens de referência e semânticos para cores, tipografia, espaçamento, dimensões, bordas, raios, elevação, opacidade e movimento.
- [x] 2.2 Definir a nomenclatura pública dos tokens e documentar quais nomes possuem garantia de compatibilidade semântica.
- [x] 2.3 Implementar o gerador que produz variáveis CSS, metadados TypeScript somente leitura e tipos de nomes públicos a partir da mesma fonte.
- [x] 2.4 Adicionar validações para nomes duplicados, referências inexistentes, categorias obrigatórias e divergências entre os artefatos gerados.
- [x] 2.5 Criar testes unitários do gerador cobrindo geração válida e falhas de validação representativas.
- [x] 2.6 Configurar o pacote de tokens para distribuir somente fontes públicas necessárias, CSS, JavaScript e declarações TypeScript pelos exports documentados.
- [x] 2.7 Adicionar uma verificação reprodutível que falhe quando artefatos gerados estiverem desatualizados em relação à fonte dos tokens.

## 3. Temas e personalização

- [x] 3.1 Definir valores completos dos tokens semânticos para os temas claro e escuro, incluindo pares de superfície, conteúdo, borda, ação e estados.
- [x] 3.2 Gerar os seletores públicos de tema para `data-theme="light"`, `data-theme="dark"` e a preferência padrão baseada em `prefers-color-scheme`.
- [x] 3.3 Criar testes que alternem o atributo `data-theme` e comprovem a resolução dos valores correspondentes sem recompilar estilos.
- [x] 3.4 Criar testes que sobrescrevam tokens em cada escopo de tema e comprovem que as personalizações permanecem independentes.
- [x] 3.5 Verificar automaticamente os pares de cores padrão aplicáveis contra os critérios de contraste do WCAG 2.2 nível AA nos dois temas.
- [x] 3.6 Documentar seleção de tema, preferência do sistema, sobrescrita de tokens e responsabilidade da aplicação pela persistência da preferência.

## 4. Tailwind CSS e distribuição de estilos

- [x] 4.1 Configurar Tailwind CSS para consumir as variáveis CSS semânticas e restringir a descoberta de classes às fontes controladas pelo design system.
- [x] 4.2 Configurar o build de CSS para produzir uma folha de estilos de tokens e uma folha de estilos compilada para componentes.
- [x] 4.3 Excluir o preflight do ponto de entrada padrão e, caso seja necessário, disponibilizar estilos globais somente por um ponto de entrada opt-in documentado.
- [x] 4.4 Adicionar uma fixture interna com classes Tailwind estáticas e variantes mapeadas explicitamente para verificar que o CSS necessário aparece no artefato construído.
- [x] 4.5 Criar teste que importe o CSS compilado sem instalar nem configurar Tailwind no consumidor e confirme que os estilos da fixture são aplicados.
- [x] 4.6 Criar teste que importe os estilos públicos e confirme que elementos externos à fixture não recebem resets ou alterações globais não documentadas.
- [x] 4.7 Inspecionar o CSS construído para detectar classes ausentes, conteúdo não utilizado evidente e referências a arquivos internos do workspace.

## 5. Build e contratos dos pacotes React

- [x] 5.1 Configurar o build de `packages/components` para produzir módulos, declarações TypeScript e CSS pelos pontos de entrada públicos.
- [x] 5.2 Configurar o build de `packages/admin` sem introduzir dependência de roteamento Next.js nem regras de negócio.
- [x] 5.3 Declarar React como peer dependency nos pacotes de renderização e confirmar que React não é incorporado aos bundles produzidos.
- [x] 5.4 Configurar a preservação de diretivas `"use client"` em módulos interativos sem marcar o pacote ou barrels inteiros como Client Components.
- [x] 5.5 Adicionar verificações de API que aceitem somente imports documentados e rejeitem imports profundos em arquivos internos.
- [x] 5.6 Empacotar os workspaces distribuíveis e verificar que cada pacote contém apenas arquivos declarados, tipos resolvíveis e exports válidos.
- [x] 5.7 Registrar as dependências de runtime e um baseline inicial de tamanho para cada artefato distribuível.

## 6. Infraestrutura de testes e acessibilidade

- [x] 6.1 Configurar Vitest e React Testing Library para testes de tokens, componentes e contratos públicos, com ambiente adequado para DOM quando necessário.
- [x] 6.2 Integrar verificações automatizadas de acessibilidade para semântica, nome acessível, foco e regras detectáveis em componentes interativos futuros.
- [x] 6.3 Configurar Playwright para fluxos de teclado, temas e integração do pacote construído.
- [ ] 6.4 Criar helpers de teste que renderizem fixtures nos temas claro e escuro sem acoplar as asserções a classes Tailwind internas.
- [ ] 6.5 Definir e documentar o critério de conclusão de componentes públicos: API tipada, CSS compilado, documentação, testes de comportamento e verificações de acessibilidade aplicáveis.
- [ ] 6.6 Configurar os comandos de teste para falharem em caso de teste, regra de acessibilidade ou artefato obrigatório ausente.

## 7. Storybook e documentação

- [ ] 7.1 Configurar `apps/docs` com Storybook para consumir os pacotes apenas por seus pontos de entrada públicos.
- [ ] 7.2 Adicionar um controle global que aplique `data-theme` e permita alternar todos os exemplos entre os temas claro e escuro.
- [ ] 7.3 Criar exemplos da fundação que demonstrem escalas de tokens, superfícies, tipografia, estados semânticos e personalização por variáveis CSS.
- [ ] 7.4 Configurar documentação automática de propriedades e um modelo de página que exija propósito, API, variantes, estados e acessibilidade para componentes públicos futuros.
- [ ] 7.5 Criar a documentação de instalação, importação de CSS, aplicação de temas e consumo em Next.js usando somente exports públicos.
- [ ] 7.6 Configurar build estático do Storybook e confirmar que exemplos, temas e documentação funcionam no artefato produzido.
- [ ] 7.7 Adicionar validação visual local representativa para os dois temas, sem depender nesta change de um serviço remoto de revisão.

## 8. Aplicação Next.js de referência

- [ ] 8.1 Inicializar `apps/admin-demo` com Next.js App Router, TypeScript estrito e sem configuração Tailwind necessária para processar fontes da biblioteca.
- [ ] 8.2 Importar tokens e CSS compilado exclusivamente pelos pontos de entrada públicos e apresentar uma página mínima de verificação da fundação.
- [ ] 8.3 Implementar um exemplo server-side que consuma APIs estáticas da biblioteca sem converter seu ancestral em Client Component.
- [ ] 8.4 Implementar um limite de cliente mínimo para alternância de tema, mantendo a preferência e a resolução inicial sob responsabilidade da aplicação.
- [ ] 8.5 Implementar resolução inicial de tema compatível com servidor e cliente e criar teste que detecte divergência de hidratação.
- [ ] 8.6 Criar um teste de integração que consuma os pacotes construídos, e não seus caminhos-fonte, e falhe diante de imports internos ou artefatos ausentes.
- [ ] 8.7 Executar o build de produção da aplicação sem varredura Tailwind sobre a biblioteca e confirmar que os estilos públicos permanecem disponíveis.

## 9. Pipeline e controles finais

- [ ] 9.1 Configurar o pipeline para executar formatação, lint, typecheck e testes rápidos antes dos builds mais demorados.
- [ ] 9.2 Adicionar ao pipeline a geração reprodutível de tokens, o build dos pacotes, o build do Storybook e o build da aplicação Next.js.
- [ ] 9.3 Adicionar ao pipeline os testes Playwright de teclado, temas, hidratação e consumo do CSS compilado.
- [ ] 9.4 Adicionar inspeção dos pacotes produzidos para validar exports, peer dependencies, conteúdo publicado e baseline de tamanho.
- [ ] 9.5 Executar a suíte completa nos temas claro e escuro e corrigir todas as falhas de comportamento, acessibilidade, tipos, lint e build.
- [ ] 9.6 Revisar licenças e atribuições das dependências e recursos incorporados, confirmando que nenhum código ou asset proprietário do CoreUI PRO foi incluído.
- [ ] 9.7 Atualizar a documentação da arquitetura e registrar limitações conhecidas antes de considerar a fundação concluída.
- [ ] 9.8 Executar `openspec validate establish-design-system-foundation --strict` e confirmar que a change e todos os artefatos permanecem válidos.

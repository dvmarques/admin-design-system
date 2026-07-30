## 1. Fundação visual e contratos públicos

- [ ] 1.1 Definir os tokens semânticos de formulário necessários para superfícies, bordas, foco e estados de validação nos temas claro e escuro, com testes de geração.
- [ ] 1.2 Estender o tema Tailwind e os estilos estáticos do pacote de componentes para consumir os tokens de formulário sem introduzir classes públicas sem prefixo.
- [ ] 1.3 Definir tipos públicos compartilhados para tamanho e estado de validação, garantindo encaminhamento seguro de `className` e atributos HTML nativos.

## 2. Controles textuais

- [ ] 2.1 Implementar `AdsInput` com atributos nativos, estados de foco, desabilitado, somente leitura, erro e sucesso, e exportá-lo pelo ponto de entrada público.
- [ ] 2.2 Implementar `AdsTextarea` com os mesmos contratos de atributos, estados e export público de `AdsInput`.
- [ ] 2.3 Implementar `AdsSelect` com opções filhas, atributos nativos, estados de validação e export público.
- [ ] 2.4 Criar testes unitários e de acessibilidade para os controles textuais, incluindo temas, foco por teclado, estados e personalização por tokens.

## 3. Controles de seleção

- [ ] 3.1 Implementar `AdsCheckbox` e `AdsRadio` sobre elementos nativos, com uso controlado e não controlado, estados de validação e exports públicos.
- [ ] 3.2 Implementar `AdsSwitch` com semântica de checkbox, rótulo acessível, operação por teclado e estados documentados.
- [ ] 3.3 Criar testes unitários e de acessibilidade para checkbox, radio e switch, cobrindo seleção, desabilitado, erro, teclado e temas.

## 4. Composição de campos

- [ ] 4.1 Implementar a composição pública de campo, rótulo, descrição e mensagem de validação, associando corretamente nome, descrição, erro e estado inválido ao controle.
- [ ] 4.2 Implementar grupos de entrada com conteúdo adjacente e grupos de seleção nomeados, preservando a semântica e a operação nativa dos controles filhos.
- [ ] 4.3 Criar testes de acessibilidade para associações de rótulo, descrição, erros e grupos, incluindo a precedência de identificadores fornecidos pelo consumidor.

## 5. Documentação e consumo externo

- [ ] 5.1 Adicionar histórias no Storybook para cada componente público, seus estados de validação, composição, responsividade e temas claro e escuro.
- [ ] 5.2 Adicionar exemplos de formulário no admin demo consumindo somente exports públicos e `@admin-ds/components/styles.css`.
- [ ] 5.3 Atualizar os testes de consumo público e CSS compilado para cobrir a nova família sem exigir Tailwind na aplicação Next.js.

## 6. Validação final

- [ ] 6.1 Executar e corrigir typecheck, testes unitários, testes de acessibilidade, snapshots visuais e fluxos Playwright aplicáveis aos formulários.
- [ ] 6.2 Executar build, inspeção do CSS e verificação do pacote, confirmando exports, peer dependencies e tamanho do artefato distribuído.

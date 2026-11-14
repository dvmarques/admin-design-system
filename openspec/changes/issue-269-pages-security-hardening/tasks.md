## 1. Diagnóstico e especificação

- [x] 1.1 Revisar issue #269, fontes principais, limite do Pages, perfil Critical e regras do repositório.
- [ ] 1.2 Revisar a proposta, design e delta de spec; validar OpenSpec 1.15.0 em modo estrito.

## 2. Segurança compatível com hospedagem estática

- [ ] 2.1 Implementar CSP parcial e meta referrer no Admin Demo e no manager/preview do Storybook sem afetar scripts, estilos e WASM.
- [ ] 2.2 Documentar inventário de superfícies, hipótese versus risco comprovado, headers não suportados, alternativas e demonstrações de autenticação.
- [ ] 2.3 Registrar nota pública da issue #269 no CHANGELOG em andamento.

## 3. Regressão e entrega

- [ ] 3.1 Adicionar testes de contrato e do build estático (CSP, meta referrer, links, tema, login e destaque de código).
- [ ] 3.2 Executar formatação, lint, build, types, qualidade, E2E principal/Pages e OpenSpec estrito sem falha.
- [ ] 3.3 Revisar diff, abrir PR para develop e verificar CI Ready/Pages/Security nos checks efetivamente executados.
- [ ] 3.4 Revisar feedback e corrigir regressões sem relaxamento injustificado; marcar somente tarefas com evidência.

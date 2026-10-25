# Design: AdsPasswordInput

## Composição
Criar componente controlável e não controlado usando convenções de AdsField/inputs existentes, com botão de visibilidade acessível. Preservar foco e seleção ao alternar tipo quando suportado pelo navegador. API pública tipada com props de input e opções explícitas para regras e força; nenhuma regra de autenticação no pacote.

## Acessibilidade
Rótulo associado ao campo; botão com nome acessível que muda entre mostrar e ocultar; teclado, foco visível, mensagens de erro e descrições associadas; evitar anunciar senha em texto claro. Regras e força devem ser compreensíveis sem cor.

## Estilos e distribuição
Usar tokens `--ads-`, classes `ads-` e pipeline de CSS compilado existente; evitar dependência de configuração Tailwind no consumidor e conflitos globais. Não introduzir dependências sem justificativa. Componente interativo deve expor boundary Client Component apropriado, compatível com consumidores Next.js.

## Demo e documentação
Reutilizar exatamente navegação, estrutura de página, playground e exemplos existentes no Admin Demo. Criar stories equivalentes. Não criar layout paralelo.

## Alternativas
Preferir composição com componentes existentes a um campo inteiramente independente; preferir indicador de força opt-in a cálculo obrigatório, evitando peso e comportamento inesperado no bundle.

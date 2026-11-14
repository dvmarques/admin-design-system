## Contexto e decisão

O módulo `src/icons/` contém 20 geometrias próprias de terceiros com notices existentes. `AdsIcon` deve continuar nomeado e tipado. Botões e navegação já aceitam `children`/nós React; `AdsAlert.icon` já suporta `ReactNode | null`.

**Escolha: `AdsIconSlot icon: ReactNode`, não `icon: ComponentType` e não uma união dentro de `AdsIcon`.** Ao receber `<Truck />`, o design system não conhece as props do componente e não presume suporte a `size`, `color`, `aria-hidden` ou `className`. `ReactNode` funciona com SVG local, wrappers, imports seletivos de diferentes bibliotecas e RSC quando os elementos forem serializáveis. Componente como valor, sem instância, exigiria criar elementos e supor props; é desnecessário. Sem `cloneElement`, registry, import dinâmico e adaptadores por biblioteca.

O `span` do slot estabelece caixa de alinhamento com classes `ads-icon-slot`, `inline-flex`, tamanhos `sm/md/lg` e `currentColor` herdado. Não modifica o filho nem sobrescreve seu tamanho/traço/cores: o consumidor pode fornecer `width`, `height`, `size` e `strokeWidth` próprios. Ícone decorativo: `aria-hidden=true` no wrapper. Informativo: `role=img` e `aria-label` no wrapper; sem informação exclusiva em SVG se ação/estado não possuir rótulo acessível. Elemento externo interativo não deve ser colocado em slot decorativo.

## Limites e integração

- A API `AdsIcon` original preserva todos os SVGs, tipos, nomes e o tamanho/traço. `AdsIconSlot` será exportado pelo entrypoint público, do lado de Server Components; sem hooks ou `use client`.
- Slots de componentes interativos recebem nós já renderizados; a fronteira client continua no próprio componente e no consumidor quando necessário.
- Alertas: `icon` existente e `closeIcon` opcional; toasts: `closeIcon`; controle de tema: mapa opcional `icons` por preferência; menu de conta: `iconNode` opcional por ação preservando `icon?: AdsIconName`. Em todos, `undefined` preserva default; `null` pode ocultar o desenho sem remover o nome acessível do botão. Conteúdo já tipado como `ReactNode` (botões/nav) não precisa API extra.
- Outros usos internos são inventariados e priorizados por necessidade real, não convertidos em massa. Manter os padrões atuais quando não há customização.
- Estilos seguem tokens e CSS distribuído, não requerem Tailwind no consumidor, não dependem da biblioteca externa. Testar temas, foco, disabled, SSR e hidratação.
- Storybook/Next devem demonstrar `AdsIcon`, composição genérica, SVG local, e bibliotecas externas opcionais; dependências de catálogo ficam restritas ao ambiente de demonstração, nunca em runtime do ADS. Não afirmar exemplo funcional até passar build.
- Treeshaking: imports seletivos do consumidor, `sideEffects` permanece somente CSS. Registrar `npm pack` e medições reais dos cenários; não alegar valores sem execução.

## Alternativas rejeitadas

1. Tornar Lucide peer obrigatório: força fornecedor e instalação extra, rejeitado.
2. `icon={Truck}` com `ComponentType<SVGProps<SVGSVGElement>>`: muitas bibliotecas não seguem esse contrato e implica injeção/instanciação; rejeitado.
3. Clonar `ReactElement` para sobrescrever props: invalida componentes personalizados e valores previamente definidos; rejeitado.
4. Registry global de nomes e imports de catálogos: dificulta tree-shaking e serialização SSR; rejeitado.

## Riscos e validação

Nós externos podem usar tamanhos/cores/ARIA próprios. Os exemplos devem mostrar como o consumidor faz a escolha consciente. `AdsIconSlot` não altera o SVG; essa é a garantia de interoperabilidade e a responsabilidade de quem fornece o elemento. Testar defaults, acessibilidade, RSC/SSR, duas variantes de temas, foco e desabilitado. CI e revisão humana são gates separados; sem validação local, registrar lacuna em vez de marcar tasks concluídas.

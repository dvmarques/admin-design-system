# Design

## Alternativas

1. **Somente `AdsInput type=file` + `AdsButton`**: já seleciona arquivos e é suficiente quando o consumidor só precisa do seletor. Porém, não cobre de modo uniforme `accept`, limites, remoção, feedback, mesmo arquivo e callbacks tipados; cada consumidor precisaria repetir essa lógica.
2. **`AdsFileUpload` leve sobre `input type=file` (escolhida)**: contém apenas seleção, validação de UX e feedback, sem parser, transporte ou modal. O controle mantém a seleção nativa, com botão acessível de acionamento e lista textual de metadados.

## API e estado

- `files?: readonly File[]` + `defaultFiles?: readonly File[]`: quando `files` é definido, o consumidor controla a lista. `onFilesChange(files, reason)` informa seleção/remoção/limpeza. A lista substitui a anterior a cada nova seleção; não acumula silenciosamente.
- `onReject(rejections)`: lista tipada com `file`, `reason: 'type' | 'size' | 'count'` e `message`. Arquivos rejeitados não entram na lista; se a seleção não contiver válidos, preserva-se a seleção anterior.
- `accept` faz verificação adicional após o seletor nativo por extensão, MIME ou padrão `type/*`; `maxSizeBytes` e `maxFiles` fazem validação local. Todos são **advisory**; servidor deve validar novamente.
- `multiple` habilita múltiplos arquivos por seleção; sem ele, um arquivo é aceito. Com `maxFiles` o total é limitado mesmo em seleção múltipla.
- `disabled` e `isLoading` bloqueiam mutações e abertura do seletor; `error` externo substitui visualmente mensagem local quando informado.
- Input é limpo após `change`, permitindo reselecionar o mesmo arquivo. Cancelamento do seletor não altera os dados.
- O botão tem semântica nativa e operação por `Enter`/`Space`; o input recebe rótulo e fica fora da sequência de tabulação para evitar foco duplicado. Rejeições aparecem em `role=alert` e são associadas à região selecionável por `aria-describedby`.

## Temas, CSS, distribuição e consumo

- Classes utilitárias estáticas usam apenas tokens semânticos `--ads-*` e classes `ads-*`; Tailwind compila no CSS distribuído, nunca no consumidor.
- Não há CSS global novo ou dependência de runtime. Respeita `focus-visible`, cores dos dois temas, reflow 320px e redução de movimento pelas classes existentes do `AdsButton`.
- App Router: a biblioteca delimita o estado com `'use client'`; a Demo monta `AdsDialog` e simula o envio somente no cliente.
- Impacto em bundle deve ser medido na CI/build; se o orçamento for excedido, medir e justificar antes de merge.

## Riscos e revisão

- `accept` é filtro de UX e não proteção contra arquivo malicioso; validar tipo real e conteúdo no backend.
- Navegadores não garantem evento de cancelamento do picker; ausência de `change` preserva seleção.
- A File API não serializa para SSR como dados comuns; `File` só entra no componente após interação do navegador.
- Não incluir drag-and-drop até existir teste de paridade de teclado e anúncios acessíveis.
- Verificar feedback de rejeições parciais, comparação de tamanho inclusiva, atualização controlada, reset de input e ausência de upload real. Fazer revisão independente e medir E2E/CI antes de encerrar.

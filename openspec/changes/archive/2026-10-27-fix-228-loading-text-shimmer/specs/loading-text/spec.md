## MODIFIED Requirements

### Requirement: Texto em atualização preserva conteúdo

A biblioteca SHALL disponibilizar `AdsLoadingText` como componente público, capaz de exibir texto fornecido pelo consumidor enquanto sinaliza visualmente atualização em andamento. Quando `loading=true`, a razão de contraste WCAG entre a cor-base do texto e o pico da faixa luminosa SHALL ser de aproximadamente 4,2:1 (entre 4,1:1 e 4,3:1) tanto em tema claro quanto escuro, sem ocultar texto ou alterar layout.

#### Scenario: Atualização ativa

- **WHEN** `AdsLoadingText` recebe `loading=true` em tema claro ou escuro
- **THEN** o texto permanece legível durante todo o ciclo
- **THEN** o brilho percorre as letras com razão de contraste de aproximadamente 4,2:1 em relação à cor-base
- **THEN** a animação não provoca deslocamento de layout

#### Scenario: Contraste entre base e pico

- **WHEN** `AdsLoadingText` recebe `loading=true` em tema claro ou escuro
- **THEN** a razão de contraste WCAG entre a cor-base e o pico do brilho é de aproximadamente 4,2:1 (entre 4,1:1 e 4,3:1), derivada de tokens semânticos
- **THEN** o pico mantém contraste alto com a superfície

#### Scenario: Atualização inativa

- **WHEN** `loading=false` ou omitido
- **THEN** o conteúdo é exibido como texto comum sem animação

### Requirement: Temas e acessibilidade

O componente SHALL usar tokens semânticos do Admin DS, suportar claro/escuro e manter apresentação legível com preferências de movimento reduzido e cores forçadas. A diferença de cor entre base e pico do shimmer SHALL distinguir atualização visualmente sem depender apenas da mudança de layout.

#### Scenario: Movimento reduzido

- **WHEN** o usuário prefere movimento reduzido
- **THEN** o texto aparece sólido e sem animação

#### Scenario: Alto contraste

- **WHEN** o sistema ativa cores forçadas
- **THEN** o texto é exibido em cor de sistema legível, sem depender do gradiente

#### Scenario: Atualizações de leitores de tela

- **WHEN** apenas `loading` muda
- **THEN** o componente não cria anúncios automáticos ou atualizações repetitivas em regiões live

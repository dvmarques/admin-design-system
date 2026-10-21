# Spec Delta

## MODIFIED Requirements

### Requirement: Tooltips revelam descrição contextual

O sistema MUST exportar um tooltip público prefixado por `Ads` que associe uma descrição breve ao seu gatilho e seja revelado por foco ou apontamento. O tooltip MUST desaparecer quando o gatilho perde foco ou apontamento, exceto enquanto o apontamento estiver sobre o próprio tooltip quando esse comportamento for oferecido. Enquanto aberto, o tooltip MUST preservar o `aria-describedby` que o gatilho já possui, referenciando o id do consumidor e o do tooltip, nessa ordem, separados por espaço; ao fechar, o gatilho MUST voltar ao `aria-describedby` original, ou ficar sem o atributo se não havia.

#### Scenario: Usuário focaliza um gatilho com tooltip

- **WHEN** o usuário alcança pelo teclado um gatilho que possui tooltip
- **THEN** a descrição contextual é apresentada e fica associada ao gatilho para tecnologias assistivas

#### Scenario: Gatilho já possui aria-describedby

- **WHEN** o tooltip é aberto por foco ou apontamento em um gatilho com `aria-describedby="ajuda"`
- **THEN** o `aria-describedby` do gatilho referencia `ajuda` e o id do tooltip, nessa ordem, e a ajuda do consumidor continua associada

#### Scenario: Tooltip fecha em gatilho com aria-describedby

- **WHEN** o tooltip fecha, por perda de foco ou fim do apontamento, mesmo que Escape tenha sido pressionado enquanto estava aberto
- **THEN** o `aria-describedby` do gatilho volta a ser apenas `ajuda`, e um gatilho sem o atributo original fica sem ele

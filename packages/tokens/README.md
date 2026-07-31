# @admin-ds/tokens

Os design tokens possuem uma única fonte em `source/tokens.mjs`. A partir
dela, `npm run generate` produz:

- `dist/tokens.css`, com variáveis CSS públicas;
- `dist/tokens.meta.json`, com os metadados de referência;
- `src/generated.ts`, com valores e tipos TypeScript.

## Temas

Use `data-theme="light"` ou `data-theme="dark"` no elemento raiz da
aplicação. Sem um atributo explícito, o CSS respeita
`prefers-color-scheme`.

```css
:root[data-theme='dark'] {
	--ads-color-primary: #0ea5e9;
}
```

A aplicação consumidora é responsável por persistir a preferência do
usuário e aplicar o atributo antes da hidratação, quando necessário.

## Tipografia

A pilha padrão é `Inter, Roboto, sans-serif`. Inter e Roboto são fontes de
licença livre para uso comercial (SIL Open Font License 1.1 e Apache License
2.0, respectivamente). O pacote não distribui arquivos de fonte; consumidores
que fizerem o download ou empacotamento dessas fontes devem preservar seus
avisos de licença.

## Compatibilidade

Nomes de tokens públicos são contratos semânticos. Remoções ou renomeações
exigem orientação de migração e versionamento compatível com uma alteração
de API pública.

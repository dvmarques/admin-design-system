// Geração determinística da referência de API; usa a matriz #151 e os tipos fonte.
import { readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out=join(root,'apps/docs/src/api-reference');
const bt=String.fromCharCode(96);
const read=p=>readFileSync(join(root,p),'utf8');
const parse=p=>ts.createSourceFile(p,read(p),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const excluded=new Set(['fixtureVariants','getAdsPaginationItems','getAdsSmartTableCsv','useAdsAdminShell']);
const optionalExcluded=new Set(['ADS_HIGHLIGHTED_CODE_LANGUAGES','languageLabel','normalizeHighlightedLanguage','registerHighlightedLanguageLoader']);
function exportsOf(path){
  const file=parse(path),result=[];
  for(const node of file.statements){
    if(ts.isExportDeclaration(node)&&!node.isTypeOnly&&node.exportClause&&ts.isNamedExports(node.exportClause))
      for(const e of node.exportClause.elements) if(!e.isTypeOnly)result.push(e.name.text);
    if(ts.isVariableStatement(node)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))
      for(const e of node.declarationList.declarations)if(ts.isIdentifier(e.name))result.push(e.name.text);
  }
  return result;
}
const expected=[
  ...exportsOf('packages/components/src/index.ts'),...exportsOf('packages/admin/src/index.ts'),
  ...exportsOf('packages/highlighted-code/src/index.ts').filter(n=>!optionalExcluded.has(n)),
  ...exportsOf('packages/components/src/masked-input.tsx')
].filter(n=>!excluded.has(n));
const matrix=read('docs/admin-demo-catalog.md');
const notes=JSON.parse(read('apps/docs/api-reference-notes.json'));

const entries=matrix.split('\n').filter(l=>l.startsWith('| '+bt+'Ads')||l.startsWith('| '+bt+'ThemeToggle')||l.startsWith('| '+bt+'StyleFixture'))
  .map(l=>{
    const p=l.split('|').slice(1);
    return {name:p[0].trim().replaceAll(bt,''),group:p[1].trim(),
      route:p[2].trim().replaceAll(bt,''),stories:[...p[3].matchAll(/([\w-]+\.stories\.tsx)/g)].map(m=>m[1])};
  });
const names=entries.map(e=>e.name);
if(new Set(names).size!==names.length)throw Error('Export duplicado na matriz');
const missing=expected.filter(n=>!names.includes(n)),extra=names.filter(n=>!expected.includes(n));
if(missing.length||extra.length)throw Error('Matriz #151 divergente: ausentes='+missing.join(',')+'; extras='+extra.join(','));
const catalog=parse('apps/admin-demo/app/catalogo/catalog-data.ts');
const descriptions=new Map();
for(const node of catalog.statements){
  if(!ts.isVariableStatement(node))continue;
  for(const d of node.declarationList.declarations){
    if(!ts.isIdentifier(d.name)||d.name.text!=='catalogEntries'||!d.initializer||!ts.isArrayLiteralExpression(d.initializer))continue;
    for(const item of d.initializer.elements){
      if(!ts.isObjectLiteralExpression(item))continue;
      const value=name=>{
        const p=item.properties.find(x=>ts.isPropertyAssignment(x)&&x.name.getText(catalog)===name);
        return p&&ts.isStringLiteral(p.initializer)?p.initializer.text:'';
      };
      if(value('name'))descriptions.set(value('name'),value('description'));
    }
  }
}
const modules=new Map();
for(const index of ['packages/components/src/index.ts','packages/admin/src/index.ts','packages/highlighted-code/src/index.ts']){
  const file=parse(index);
  for(const node of file.statements){
    if(!ts.isExportDeclaration(node)||node.isTypeOnly||!node.moduleSpecifier||!node.exportClause||!ts.isNamedExports(node.exportClause))continue;
    const base=resolve(dirname(join(root,index)),node.moduleSpecifier.text.replace(/\.js$/,''));
    const path=[base+'.tsx',base+'.ts'].find(existsSync);
    if(path)for(const e of node.exportClause.elements)if(!e.isTypeOnly)modules.set(e.name.text,path);
  }
}
modules.set('AdsMaskedInput',join(root,'packages/components/src/masked-input.tsx'));
function typeInfo(name){
  const path=modules.get(name);
  if(!path)throw Error('Sem módulo público para '+name);
  const code=readFileSync(path,'utf8');
  const file=ts.createSourceFile(path,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const decl=file.statements.find(n=>(ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n))&&n.name.text===name+'Props');
  const props=decl&&ts.isInterfaceDeclaration(decl)?decl.members.filter(ts.isPropertySignature).map(p=>({
    name:p.name.getText(file).replaceAll("'",'').replaceAll('"',''),
    type:p.type?.getText(file).replace(/\s+/g,' ')||'desconhecido',
    required:!p.questionToken,
    desc:ts.getJSDocCommentsAndTags(p).map(j=>typeof j.comment==='string'?j.comment:'').filter(Boolean).join(' ')
  })):[];
  const heritage=decl&&ts.isInterfaceDeclaration(decl)?(decl.heritageClauses||[]).map(n=>n.getText(file)).join('; '):
    decl&&ts.isTypeAliasDeclaration(decl)?decl.type.getText(file):'Tipo de props composto ou declarado em outro módulo.';
  const defaults=new Map();
  function visit(n){
    if(ts.isParameter(n)&&ts.isObjectBindingPattern(n.name))for(const e of n.name.elements){
      if(!e.initializer||!ts.isIdentifier(e.name))continue;
      const key=e.name.text;
      if(!defaults.has(key))defaults.set(key,new Set());
      defaults.get(key).add(e.initializer.getText(file));
    }
    ts.forEachChild(n,visit);
  }
  visit(file);
  for(const p of props){
    const values=defaults.get(p.name);
    p.def=values?.size===1?[...values][0]:'—';
  }
  return {props,heritage,path:path.slice(root.length+1).replaceAll('\\','/')};
}
function storyFor(entry){
  const candidates=entry.stories.filter(n=>existsSync(join(root,'apps/docs/src',n))).map(n=>{
    const content=read('apps/docs/src/'+n);
    return {name:n,content,score:(n===entry.route.split('/').pop()+'.stories.tsx'?10:0)+(content.includes('<'+entry.name)?4:0)};
  }).sort((a,b)=>b.score-a.score);
  for(const c of candidates){
    const file=ts.createSourceFile(c.name,c.content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const vars=file.statements.filter(ts.isVariableStatement).filter(n=>n.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))
      .flatMap(n=>n.declarationList.declarations).filter(n=>ts.isIdentifier(n.name));
    const picked=vars.find(d=>d.initializer?.getText(file).includes('<'+entry.name))||vars[0];
    if(picked)return {file:c.name,name:picked.name.text};
  }
  throw Error('Exemplo Storybook ausente para '+entry.name);
}
const esc=x=>String(x||'—').replaceAll('|','\\|').replaceAll('\n',' ').replaceAll('<','&lt;').replaceAll('>','&gt;');
function render(entry){
  const api=typeInfo(entry.name),story=storyFor(entry);
  const pkg=entry.name==='AdsMaskedInput'?'@admin-ds/components/masked-input':
    entry.name==='AdsHighlightedCodeSnippet'?'@admin-ds/highlighted-code':
    api.path.startsWith('packages/admin/')?'@admin-ds/admin':'@admin-ds/components';
  const a=[
    "import { Meta, Canvas } from '@storybook/addon-docs/blocks';",
    "import * as ExampleStories from '../"+story.file.replace('.tsx','')+"';",
    '',
    '<Meta title="API/'+entry.name+'" />',
    '',
    '# '+entry.name,'',
    esc(descriptions.get(entry.name)||'Componente público do design system.'),'',
    '**Importação pública:** '+bt+pkg+bt+'. **Grupo:** '+esc(entry.group)+'.','',
    '## Propriedades e tipos','',
    '**Contrato:** '+bt+entry.name+'Props'+bt+'.','',
    '**Composição/herança:** '+bt+esc(api.heritage).replaceAll(bt,"'")+bt+'.',''
  ];
  if(api.props.length){
    a.push('| Propriedade | Tipo | Obrigatória | Padrão verificado | Descrição |',
      '| --- | --- | --- | --- | --- |');
    for(const p of api.props)a.push('| '+bt+esc(p.name)+bt+' | '+bt+esc(p.type)+bt+' | '+(p.required?'Sim':'Não')+
      ' | '+bt+esc(p.def)+bt+' | '+esc(p.desc)+' |');
  }else a.push('API composta ou genérica: confira os tipos públicos e os exemplos abaixo.');
  if(notes[entry.name])a.push('','## Observações específicas','',esc(notes[entry.name]));
  a.push('','**Origem TypeScript:** '+bt+api.path+bt+'.','',
    'Padrões são mostrados apenas quando encontrados de forma inequívoca na desestruturação da implementação. '+
    'O travessão não prova a existência de um padrão. Props HTML/React herdadas podem não aparecer nesta tabela.','',
    '## Variantes, estados e acessibilidade','',
    'Confira as variantes e estados nos exemplos. Preserve semântica, nomes acessíveis, navegação por teclado '+
    'e foco visível quando aplicáveis; os tipos e a implementação são a fonte do comportamento.','',
    '## Exemplo executável','',
    '<Canvas of={ExampleStories.'+story.name+'} />','',
    'Outros exemplos: '+bt+story.file+bt+'. Partes compostas podem compartilhar exemplos do componente pai.','');
  return a.join('\n');
}
mkdirSync(out,{recursive:true});
const desired=new Set(entries.map(e=>e.name+'.mdx'));
for(const file of readdirSync(out))if(file.endsWith('.mdx')&&!desired.has(file))unlinkSync(join(out,file));
for(const entry of entries){
  const file=join(out,entry.name+'.mdx'),content=render(entry);
  if(!existsSync(file)||readFileSync(file,'utf8')!==content)writeFileSync(file,content);
}
console.log('Referências Storybook geradas: '+entries.length+' exports.');

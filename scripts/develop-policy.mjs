#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { discoverManifests, isAllowedReleaseFile, parseChangelog, readJson, validateCoordinatedManifests } from './release-utils.mjs';
const base=process.env.GITHUB_BASE_SHA; const headRef=process.env.GITHUB_HEAD_REF??''; const sameRepo=process.env.PR_HEAD_REPO===process.env.GITHUB_REPOSITORY;
if(!base) throw new Error('GITHUB_BASE_SHA obrigatório.');
const show=(ref,file)=>execFileSync('git',['show',`${ref}:${file}`],{encoding:'utf8'});
const headChangelog=await fs.readFile('CHANGELOG.md','utf8'); const baseChangelog=show(base,'CHANGELOG.md');
const headParsed=parseChangelog(headChangelog); const baseParsed=parseChangelog(baseChangelog);
if(headParsed.ongoing.length!==1) throw new Error('Head deve conter exatamente uma seção Em andamento.');
const manifests=await Promise.all((await discoverManifests()).map(async rel=>({rel,json:await readJson(rel)}))); const headVersion=validateCoordinatedManifests(manifests);
const baseRoot=JSON.parse(show(base,'package.json')); const isBackmerge=sameRepo&&/^release\/\d+\.\d+\.\d+$/.test(headRef);
if(!isBackmerge){
 if(headVersion!==baseRoot.version) throw new Error('PR comum não pode alterar a versão coordenada.');
 if(headParsed.ongoing[0].version!==baseParsed.ongoing[0]?.version) throw new Error('PR comum não pode alterar o heading Em andamento.');
 for(const closed of baseParsed.closed){ const bStart=closed.index, bNext=baseParsed.sections.find(s=>s.index>bStart)?.index??baseChangelog.length; const h=headParsed.closed.find(s=>s.version===closed.version); if(!h) throw new Error(`Bloco fechado ${closed.version} removido.`); const hNext=headParsed.sections.find(s=>s.index>h.index)?.index??headChangelog.length; if(baseChangelog.slice(bStart,bNext)!==headChangelog.slice(h.index,hNext)) throw new Error(`Bloco fechado ${closed.version} alterado.`); }
 console.log('develop-policy comum: ok');
} else {
 const changed=execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean); const bad=changed.filter(f=>!isAllowedReleaseFile(f)); if(bad.length) throw new Error(`Back-merge altera arquivos não permitidos: ${bad.join(', ')}`);
 const version=headRef.slice('release/'.length); if(headVersion!==version) throw new Error(`Back-merge ${version} com manifests ${headVersion}.`); if(!headParsed.closed.some(s=>s.version===version)) throw new Error(`Bloco fechado ${version} ausente.`); console.log(`develop-policy back-merge ${version}: ok`);
}

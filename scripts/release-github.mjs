#!/usr/bin/env node
import fs from 'node:fs/promises';
import { extractReleaseNotes, normalizeReleaseBody, parseChangelog, predecessorVersion, RELEASE_TAG } from './release-utils.mjs';

const [command, version] = process.argv.slice(2);
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) throw new Error('GITHUB_REPOSITORY e GITHUB_TOKEN são obrigatórios.');
const [owner] = repo.split('/');
const headers = {Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'};
async function api(path,{allow404=false}={}) { const r=await fetch(`https://api.github.com/repos/${repo}${path}`,{headers}); if(allow404&&r.status===404)return null; if(!r.ok) throw new Error(`${r.status} ${path}: ${await r.text()}`); return r.json(); }
async function contentAt(path,ref){ const x=await api(`/contents/${path}?ref=${encodeURIComponent(ref)}`); return Buffer.from(x.content.replace(/\n/g,''),'base64').toString('utf8'); }
async function resolveMerged(v,base){ const q=new URLSearchParams({state:'closed',base,head:`${owner}:release/${v}`,per_page:'100'}); const pulls=await api(`/pulls?${q}`); const candidates=pulls.filter(p=>p.merged_at&&p.head?.repo?.full_name===repo&&p.head?.ref===`release/${v}`&&p.base?.ref===base); if(candidates.length!==1) throw new Error(`Esperada 1 PR merged release/${v} -> ${base}; encontradas ${candidates.length}.`); return candidates[0]; }
async function tagState(v){ const ref=await api(`/git/ref/tags/v${v}`,{allow404:true}); if(!ref)return {exists:false}; if(ref.object.type!=='tag') return {exists:true,annotated:false,commit:ref.object.sha}; const tag=await api(`/git/tags/${ref.object.sha}`); if(tag.object.type!=='commit') throw new Error(`v${v} não aponta para commit.`); return {exists:true,annotated:true,commit:tag.object.sha,tagObject:ref.object.sha}; }
async function releaseState(v){ return api(`/releases/tags/v${v}`,{allow404:true}); }
async function published(v){ const pr=await resolveMerged(v,'master'); const tag=await tagState(v); const release=await releaseState(v); if(!tag.exists||!tag.annotated||tag.commit!==pr.merge_commit_sha) throw new Error(`Tag v${v} ausente, lightweight ou divergente do commit esperado.`); if(!release) throw new Error(`GitHub Release v${v} ausente.`); const notes=extractReleaseNotes(await contentAt('CHANGELOG.md',pr.merge_commit_sha),v); if(release.tag_name!==`v${v}`||release.name!==`v${v}`||release.draft||release.prerelease||normalizeReleaseBody(release.body??'')!==normalizeReleaseBody(notes)) throw new Error(`GitHub Release v${v} divergente.`); return {version:v,pr:pr.number,commit:pr.merge_commit_sha,tag,release:{id:release.id,tag_name:release.tag_name,name:release.name,draft:release.draft,prerelease:release.prerelease}}; }

if(command==='resolve') console.log(JSON.stringify(await resolveMerged(version,process.argv[4]??'master')));
else if(command==='state') console.log(JSON.stringify({tag:await tagState(version),release:await releaseState(version)}));
else if(command==='target-absent') { const s={tag:await tagState(version),release:await releaseState(version)}; if(s.tag.exists||s.release) throw new Error(`v${version} já possui tag/release antes da integração.`); console.log('ok'); }
else if(command==='published') console.log(JSON.stringify(await published(version)));
else if(command==='predecessor') { const parsed=parseChangelog(await fs.readFile('CHANGELOG.md','utf8')); const p=predecessorVersion(parsed,version); if(!p){ console.log(JSON.stringify({predecessor:null})); process.exit(0); } console.log(JSON.stringify({predecessor:p,published:await published(p)})); }
else if(command==='bootstrap-remote') { const parsed=parseChangelog(await fs.readFile('CHANGELOG.md','utf8')); if(predecessorVersion(parsed,version)){ console.log('not-bootstrap'); process.exit(0); } const tags=await api('/tags?per_page=100'); const releaseTags=tags.map(t=>t.name).filter(n=>RELEASE_TAG.test(n)); const releases=await api('/releases?per_page=100'); const releaseNames=releases.map(r=>r.tag_name).filter(n=>RELEASE_TAG.test(n)); if(releaseTags.length||releaseNames.length) throw new Error(`Bootstrap incompatível com histórico remoto: tags=${releaseTags.join(',')} releases=${releaseNames.join(',')}`); console.log('ok'); }
else throw new Error(`Comando desconhecido: ${command}`);

import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
for(const name of ['Poster','Token']){
 const artifact=JSON.parse(readFileSync(new URL(`../artifacts/contracts/${name}.sol/${name}.json`,import.meta.url)));
 writeFileSync(new URL(`../../poster-ui/public/${name}.json`,import.meta.url),JSON.stringify({abi:artifact.abi,bytecode:artifact.bytecode},null,2));
}
const folder=new URL('../artifacts/build-info/',import.meta.url);const name=readdirSync(folder).find(n=>n.endsWith('.json')&&!n.endsWith('.output.json'));const info=JSON.parse(readFileSync(new URL(name,folder)));
writeFileSync(new URL('../../verification/standard-input.json',import.meta.url),JSON.stringify(info.input,null,2));

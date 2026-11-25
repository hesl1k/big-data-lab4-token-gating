import {readFileSync,writeFileSync} from 'node:fs';
const d=JSON.parse(readFileSync(new URL('../../poster-ui/public/deployment.sepolia.json',import.meta.url)));
const stdJsonInput=JSON.parse(readFileSync(new URL('../../verification/standard-input.json',import.meta.url)));
const source=Object.keys(stdJsonInput.sources).find(s=>s.endsWith('/Poster.sol'));
const r=await fetch(`https://sourcify.dev/server/v2/verify/11155111/${d.address}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stdJsonInput,compilerVersion:'0.8.30+commit.73712a01',contractIdentifier:source+':Poster',creationTransactionHash:d.creation})});
const result=await r.json();console.log(JSON.stringify(result,null,2));if(!r.ok)throw Error('Verification failed');writeFileSync(new URL('../../verification/sourcify-ticket.json',import.meta.url),JSON.stringify(result,null,2));

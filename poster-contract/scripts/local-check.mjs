import {readFileSync,writeFileSync} from 'node:fs';
import {createPublicClient,createWalletClient,http} from 'viem';
import {hardhat} from 'viem/chains';
const client=createPublicClient({chain:hardhat,transport:http('http://127.0.0.1:8545')});
const wallet=createWalletClient({chain:hardhat,transport:http('http://127.0.0.1:8545')});
const [owner,other]=await wallet.getAddresses();
const artifact=n=>JSON.parse(readFileSync(new URL(`../../poster-ui/public/${n}.json`,import.meta.url)));
async function deploy(name,args){const a=artifact(name);const hash=await wallet.deployContract({...a,args,account:owner});const r=await client.waitForTransactionReceipt({hash});return {address:r.contractAddress,abi:a.abi,block:r.blockNumber};}
const token=await deploy('Token',['Study Token','STDY',10000n*10n**18n]);
const poster=await deploy('Poster',[token.address,10n*10n**18n]);
const write=async(c,functionName,args,account=owner)=>{const hash=await wallet.writeContract({...c,functionName,args,account});return client.waitForTransactionReceipt({hash})};
await write(poster,'post',['Локальная проверка доступа','тест']);
let denied=false;try{await client.simulateContract({...poster,functionName:'post',args:['Нет токенов','тест'],account:other})}catch(e){if(!e.message.includes('Not enough tokens'))throw e;denied=true}
if(!denied)throw Error('Missing rejection');
await write(token,'transfer',[other,10n*10n**18n]);await write(poster,'post',['Ровно 10 STDY: доступ разрешён','тест'],other);
const result={poster:poster.address,token:token.address,block:poster.block.toString(),zeroBalanceRejected:denied,exactThresholdAccepted:true};
writeFileSync(new URL('../../evidence/local-check.json',import.meta.url),JSON.stringify(result,null,2));
writeFileSync(new URL('../../poster-ui/public/deployment.local.json',import.meta.url),JSON.stringify({address:poster.address,block:poster.block.toString(),chain:'31337'},null,2));console.log(result);

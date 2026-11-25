import {readFileSync,writeFileSync} from 'node:fs';
import {createPublicClient,http} from 'viem';
import {sepolia} from 'viem/chains';
const d=JSON.parse(readFileSync(new URL('../../poster-ui/public/deployment.sepolia.json',import.meta.url)));
const abi=JSON.parse(readFileSync(new URL('../../poster-ui/public/Poster.json',import.meta.url))).abi;
const client=createPublicClient({chain:sepolia,transport:http('https://ethereum-sepolia-rpc.publicnode.com')});
const read=(functionName,args=[])=>client.readContract({address:d.address,abi,functionName,args});
const receipt=await client.getTransactionReceipt({hash:d.creation});
const [owner,tokenAddress,threshold,events]=await Promise.all([read('owner'),read('tokenAddress'),read('threshold'),client.getContractEvents({address:d.address,abi,eventName:'NewPost',fromBlock:BigInt(d.block)})]);
const tokenAbi=JSON.parse(readFileSync(new URL('../../poster-ui/public/Token.json',import.meta.url))).abi;
const testAccount='0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
const [ownerBalance,testBalance]=await Promise.all([owner,testAccount].map(account=>client.readContract({address:tokenAddress,abi:tokenAbi,functionName:'balanceOf',args:[account]})));
let denial='';try{await client.simulateContract({address:d.address,abi,functionName:'post',args:['Проверка отказа','тест'],account:testAccount})}catch(e){denial=e.shortMessage;if(!e.message.includes('Not enough tokens'))throw e}
if(!denial)throw Error('Expected insufficient balance rejection');
const result={...d,status:receipt.status,owner,tokenAddress,threshold,ownerBalance,testAccount,testBalance,denial,events};
const out=JSON.stringify(result,(_,v)=>typeof v==='bigint'?v.toString():v,2);writeFileSync(new URL('../../evidence/sepolia.json',import.meta.url),out);console.log(out);

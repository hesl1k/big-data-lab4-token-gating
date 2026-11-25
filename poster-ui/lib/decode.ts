import Web3 from 'web3';
// Smart-account wallets can wrap post calldata inside a batch transaction.
// Accept a candidate only when both its content and indexed tag hash match the log.
export function recoverTag(input:string,content:string,tagHash:string):string {
 const selector=new Web3().eth.abi.encodeFunctionSignature('post(string,string)').slice(2).toLowerCase();
 const hex=input.slice(2);let offset=hex.toLowerCase().indexOf(selector);
 while(offset>=0){
  if(offset%2===0)try{
   const args=new Web3().eth.abi.decodeParameters(['string','string'],'0x'+hex.slice(offset+8));
   const tag=String(args[1]);
   if(String(args[0])===content&&Web3.utils.keccak256(tag)===tagHash)return tag;
  }catch{}
  offset=hex.toLowerCase().indexOf(selector,offset+2);
 }
 return '[тег недоступен]';
}


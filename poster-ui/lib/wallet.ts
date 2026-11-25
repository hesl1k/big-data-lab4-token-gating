export type RequestProvider = {
 request: (args: {method:string;params?:unknown[]}) => Promise<unknown>;
};

/** A stalled extension must not leave the application busy indefinitely. */
export async function walletRequest<T>(provider:RequestProvider,args:{method:string;params?:unknown[]},timeoutMs=30000):Promise<T>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{
  return await Promise.race([
   provider.request(args) as Promise<T>,
   new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('MetaMask не ответил. Нажмите значок лисы в Chrome, разблокируйте кошелёк и завершите или отклоните ожидающий запрос. Затем повторите подключение.')),timeoutMs);})
  ]);
 }catch(error){
  const code=(error as {code?:number})?.code;
  if(code===-32002)throw new Error('В MetaMask уже ожидает запрос. Нажмите значок лисы в Chrome и завершите или отклоните его, затем повторите подключение.');
  if(code===4001)throw new Error('Подключение отклонено в MetaMask. Можно попробовать снова.');
  throw error;
 }finally{if(timer!==undefined)clearTimeout(timer);}
}

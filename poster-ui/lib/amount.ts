export function toUnits(value:string,decimals:number):bigint{
 if(!Number.isInteger(decimals)||decimals<0||decimals>255)throw Error('Некорректное decimals');
 const normalized=value.trim().replace(',','.');
 if(!/^\d+(\.\d+)?$/.test(normalized))throw Error('Введите положительное число без экспоненты');
 const [whole,fraction='']=normalized.split('.');
 if(fraction.length>decimals)throw Error(`Допустимо знаков после запятой: ${decimals}`);
 const units=BigInt(whole)*10n**BigInt(decimals)+BigInt((fraction+'0'.repeat(decimals)).slice(0,decimals)||'0');
 if(units<=0n)throw Error('Количество должно быть больше нуля');
 if(units>2n**256n-1n)throw Error('Количество превышает uint256');
 return units;
}
export function fromUnits(value:bigint,decimals:number):string{
 const scale=10n**BigInt(decimals);const whole=value/scale;
 const fraction=(value%scale).toString().padStart(decimals,'0').replace(/0+$/,'');
 return `${whole}${fraction?'.'+fraction:''}`;
}

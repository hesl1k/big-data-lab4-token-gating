import {buildModule} from '@nomicfoundation/hardhat-ignition/modules';
export default buildModule('PosterModule',m=>{
 const token=m.contract('Token',['Study Token','STDY',10000n*10n**18n]);
 const poster=m.contract('Poster',[token,10n*10n**18n]);
 return {token,poster};
});

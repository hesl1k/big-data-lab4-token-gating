import assert from 'node:assert/strict';import {test} from 'node:test';import Web3 from 'web3';import {recoverTag} from '../lib/decode.ts';
const call=new Web3().eth.abi.encodeFunctionCall({name:'post',type:'function',inputs:[{name:'content',type:'string'},{name:'tag',type:'string'}]},['Сообщение','учёба']);const hash=Web3.utils.keccak256('учёба');
test('decodes direct post unicode tag',()=>assert.equal(recoverTag(call,'Сообщение',hash),'учёба'));
test('decodes nested smart account calldata',()=>assert.equal(recoverTag('0xabcdef12'+'00'.repeat(103)+call.slice(2)+'00'.repeat(32),'Сообщение',hash),'учёба'));
test('rejects candidates with different event content or hash',()=>{assert.equal(recoverTag(call,'Другое',hash),'[тег недоступен]');assert.equal(recoverTag(call,'Сообщение',Web3.utils.keccak256('other')),'[тег недоступен]')});


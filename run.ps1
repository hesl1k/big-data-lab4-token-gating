param([ValidateSet('test','build','start','node','local-check')][string]$Task='start')
$ErrorActionPreference='Stop'
$runtime=Get-ChildItem 'C:\Program Files\WindowsApps' -Directory -Filter 'OpenAI.CodexPrimaryRuntime*' | Sort-Object Name -Descending | Select-Object -First 1
$node=if($runtime){Join-Path $runtime.FullName 'dependencies\node\bin\node.exe'}else{(Get-Command node).Source}
if($Task -eq 'test'){Push-Location "$PSScriptRoot\poster-contract";try{& $node node_modules/hardhat/dist/src/cli.js test;if($LASTEXITCODE){exit $LASTEXITCODE}}finally{Pop-Location};Push-Location "$PSScriptRoot\poster-ui";try{& $node --test tests/decode.test.ts}finally{Pop-Location}}
elseif($Task -eq 'node'){Push-Location "$PSScriptRoot\poster-contract";try{& $node node_modules/hardhat/dist/src/cli.js node}finally{Pop-Location}}
elseif($Task -eq 'local-check'){Push-Location "$PSScriptRoot\poster-contract";try{& $node scripts/local-check.mjs}finally{Pop-Location}}
else{Push-Location "$PSScriptRoot\poster-ui";try{if($Task -eq 'build'){& $node node_modules/next/dist/bin/next build --webpack}else{& $node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3002}}finally{Pop-Location}}

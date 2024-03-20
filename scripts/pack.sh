mkdir -p ./temp/r3_filehost
cp ./{fxmanifest.lua,LICENSE,README.md} ./temp/r3_filehost
cp -r ./dist ./temp/r3_filehost
cd ./temp && zip -r ../r3_filehost.zip ./r3_filehost
cd .. && rm -rf ./temp

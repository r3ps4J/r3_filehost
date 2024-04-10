#!/bin/bash

# Create temporary directory
mkdir -p ./temp/r3_filehost

# Copy files to include in pack
cp ./{fxmanifest.lua,LICENSE,README.md} ./temp/r3_filehost
cp -r ./{dist,assets} ./temp/r3_filehost

# Create zip and remove temp directory
cd ./temp && zip -r ../r3_filehost.zip ./r3_filehost
cd .. && rm -rf ./temp

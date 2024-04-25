mkdir nodejs
cp ./libraries/package.json nodejs/
cd nodejs
npm i
cd ..
zip -r libraries.zip nodejs
rm -rf nodejs

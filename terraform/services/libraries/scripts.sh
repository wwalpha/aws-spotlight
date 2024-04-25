mkdir nodejs
cp ./libraries/package.json nodejs/
cd nodejs
npm i
cd ..
zip -r libraries.zip nodejs
sleep 10
ls
rm -rf nodejs

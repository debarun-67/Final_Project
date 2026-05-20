const { runCoreCommand } = require('./backend/api/src/config/core_bridge');
const path = require('path');

const recordsDir = 'c:\\Users\\debar\\Documents\\GitHub\\Final_Project\\demo_instances\\node1\\offchain\\records';
const sourceFile = 'record-1779292215227-58082409.txt.enc';
const sourcePath = path.join(recordsDir, sourceFile);
const destPath = path.join(recordsDir, sourceFile + '.dec_test');
const userId = 'PAT_001';

console.log('Decrypting file:', sourcePath);
console.log('Destination file:', destPath);
console.log('User ID:', userId);

runCoreCommand('DECRYPT', [sourcePath, destPath, userId])
    .then(output => {
        console.log('Success! Output from core:');
        console.log(output);
    })
    .catch(err => {
        console.error('Error from core:', err);
    });

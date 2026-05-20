const { runCoreCommand } = require('./backend/api/src/config/core_bridge');

runCoreCommand('ALL')
    .then(output => {
        console.log('Blockchain blocks:');
        console.log(output);
    })
    .catch(err => {
        console.error('Error:', err);
    });

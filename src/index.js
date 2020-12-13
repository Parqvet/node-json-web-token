// starting the server

const app = require('./app');

async function init() {
    await app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));
}

init();
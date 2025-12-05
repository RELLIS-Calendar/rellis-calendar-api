'use strict';

import Hapi, {Server} from '@hapi/hapi';

let server: Server;

const init = async function (): Promise<Server> {

    server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Routes

    return server;
};

const start = async function (): Promise<void> {
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection');
    console.error(err);
    process.exit(1);
});

init()
.then(() => start())
.catch((err) => console.error("Error while starting server:", err));
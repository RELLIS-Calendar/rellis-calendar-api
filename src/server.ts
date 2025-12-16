'use strict';

import Hapi, {Server} from '@hapi/hapi';
import {registerRoutes} from './routes';

let server: Server;

const init = async function (): Promise<Server> {

    server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['https://main.d2nd1e6tb57dgk.amplifyapp.com/'], // In production, replace with Amplify domain
                credentials: true
            }
        }
    });

    registerRoutes(server);

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
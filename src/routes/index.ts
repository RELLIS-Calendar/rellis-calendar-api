import {Server} from "@hapi/hapi";
import {eventRoutes} from "./events";


/**
 * Registers application routes to the given server instance.
 *
 * @param {Server} server - The server instance to which the routes will be registered.
 * @return {void} No return value.
 */
export function registerRoutes(server: Server): void {
    server.route(eventRoutes);
}

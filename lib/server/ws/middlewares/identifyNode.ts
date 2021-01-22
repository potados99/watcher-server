import {Socket} from "socket.io/dist/socket";
import {ExtendedError} from "socket.io/dist/namespace";

/**
 * Sets `nodeName` to the socket.
 * @param socket
 * @param next
 */
export default function identifyNode(socket: Socket, next: (err?: ExtendedError) => void) {
    // @ts-ignore
    const {nodeName} = socket.handshake.query;

    if (!nodeName) {
        next(new Error('No node name!'));
    } else {
        // @ts-ignore
        socket.nodeName = nodeName;

        next();
    }
}

import {Socket} from "socket.io";

abstract class ConnectionRepository {

    private connections = new Map<string, Socket>();

    getAllConnections() {
        return Array.from(this.connections.values());
    }

    addConnection(name: string, socket: Socket) {
        this.connections.set(name, socket);
    }

    removeConnection(name: string) {
        this.connections.delete(name);
    }

    getConnectionByName(name: string) {
        return this.connections.get(name);
    }

    getNameOfConnection(socket: Socket) {
        for (const entry of this.connections.entries()) {
            if (entry[1] === socket) {
                return entry[0];
            }
        }

        return undefined;
    }

    emitAll(event: string, arg?: any) {
        this.getAllConnections().forEach((socket) => {
           socket.emit(event, arg);
        });
    }
}

export default ConnectionRepository;

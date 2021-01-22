import nodeConnectionRepository from "../repositories/NodeConnectionRepository";
import appConnectionRepository from "../repositories/AppConnectionRepository";
import watcherNodeRepository from "../repositories/WatcherNodeRepository";
import WatcherNode from "../entities/WatcherNode";
import Property from "../entities/Property";
import {Socket} from "socket.io";

class WatcherService {
    private static notifyNodeUpdated(node: WatcherNode) {
        appConnectionRepository.emitAll('node:update', {node});
    }

    private static notifyPropUpdated(nodeName: string, prop: Property) {
        appConnectionRepository.emitAll('prop:update', {nodeName, prop});
    }

    handleNodeOnline(socket: Socket) {
        // @ts-ignore
        const {nodeName} = socket;
        if (!nodeName) {
            throw new Error('nodeName not found. Check your middleware.');
        }

        socket.join(nodeName);

        console.log(`Node [${nodeName}] attached.`);

        nodeConnectionRepository.addConnection(nodeName, socket);
        const node = watcherNodeRepository.updateNode(nodeName, true);

        WatcherService.notifyNodeUpdated(node);

        return nodeName;
    }

    handleNodeOffline(nodeName: string, socket: Socket) {
        const savedSocket = nodeConnectionRepository.getConnectionByName(nodeName);
        const savedSocketIsAlive = savedSocket && !savedSocket.disconnected;

        if (savedSocketIsAlive && savedSocket !== socket) {
            // Saved socket is overridden by new connection before disconnect.
            // In this case we have a live connection, so that we don't need to mark this node offline.
            console.warn(`Previous connection is abandoned.`);
            return;
        }

        console.log(`Node [${nodeName}] detached.`);

        nodeConnectionRepository.removeConnection(nodeName);
        watcherNodeRepository.updateNode(nodeName, false);
    }

    handlePropUpdate(nodeName: string, propName: string, propValue: any) {
        console.log(`[${nodeName}] ${propName}: ${propValue}`);

        const prop = watcherNodeRepository.updateProperty(nodeName, propName, propValue);

        WatcherService.notifyPropUpdated(nodeName, prop);
    }

    handleRequestForUpdate(nodeName?: string) {
        if (nodeName) {
            nodeConnectionRepository.getConnectionByName(nodeName)?.emit('request:update');
        } else {
            nodeConnectionRepository.emitAll('request:update');
        }
    }

    handleAppOnline(socket: Socket) {
        appConnectionRepository.addConnection(socket.id, socket);
    }

    handleAppOffline(socket: Socket) {
        appConnectionRepository.removeConnection(socket.id);
    }
}

const watcherService = new WatcherService();

export default watcherService;

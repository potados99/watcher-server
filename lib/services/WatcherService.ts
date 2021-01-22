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

        console.log(`Node ${nodeName} attached.`);

        nodeConnectionRepository.addConnection(nodeName, socket);
        socket.join(nodeName);

        const node = watcherNodeRepository.updateNode(nodeName, true);

        WatcherService.notifyNodeUpdated(node);

        return nodeName;
    }

    handleNodeOffline(nodeName: string, socket: Socket) {
        if (nodeConnectionRepository.getConnectionByName(nodeName) !== socket) {
            // New connection is created and this connection is abandoned.
            console.log(`Previous connection is abandoned.`);
            return;
        }

        console.log(`Node ${nodeName} detached.`);

        nodeConnectionRepository.removeConnection(nodeName);
        watcherNodeRepository.updateNode(nodeName, false);
    }

    handlePropUpdate(nodeName: string, propName: string, propValue: any) {
        console.log(`${propName}: ${propValue}`);

        const prop = watcherNodeRepository.updateProperty(nodeName, propName, propValue);

        WatcherService.notifyPropUpdated(nodeName, prop);
    }

    handleRequestForUpdate(nodeName: string | null) {
        if (nodeName === null) {
            nodeConnectionRepository.emitAll('request:update');
        } else {
            nodeConnectionRepository.getConnectionByName(nodeName)?.emit('request:update');
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

import {Socket} from "socket.io";
import watcherNodeRepository from "../../../repositories/WatcherNodeRepository";
import nodeConnectionRepository from "../../../repositories/NodeConnectionRepository";

export default function handleNodeConnection(socket: Socket) {
    // @ts-ignore
    const {nodeName} = socket;
    if (!nodeName) {
        throw new Error('nodeName not found. Check your middleware.');
    }

    nodeConnectionRepository.addConnection(nodeName, socket);
    watcherNodeRepository.updateWatcher(nodeName, true);

    socket.join(nodeName);

    socket.on('prop:update', (prop: any) => {
        console.log(`${prop.name}: ${prop.value}`);

        watcherNodeRepository.updateProperty(nodeName, prop.name, prop.value);
    });

    socket.on('disconnect', () => {
        console.log(`Node ${nodeName} detached.`);

        nodeConnectionRepository.removeConnection(nodeName);
        watcherNodeRepository.updateWatcher(nodeName, false);
    });
}

import {Socket} from "socket.io";
import watcherNodeRepository from "../../../repositories/WatcherNodeRepository";

export default function onNodeConnection(socket: Socket) {
    const nodeName = "Watcher";
    if (!nodeName) {
        return;
    }

    console.log(`Node ${nodeName} attached.`);

    socket.join(nodeName);

    socket.on('prop:update', (prop: any) => {
        console.log(`${prop.name}: ${prop.value}`);

        watcherNodeRepository.updateProperty(nodeName, prop.name, prop.value);
    });

    socket.on('disconnect', () => {
        console.log(`Node ${nodeName} detached.`);
    });
}

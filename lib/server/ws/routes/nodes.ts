import {Socket} from "socket.io";
import watcherService from "../../../services/WatcherService";

export default function handleNodeConnection(socket: Socket) {
    const nodeName = watcherService.handleNodeOnline(socket);

    socket.on('prop:update', (prop: any) => {
        watcherService.handlePropUpdate(nodeName, prop.name, prop.value);
    });

    socket.on('disconnect', () => {
        watcherService.handleNodeOffline(nodeName, socket);
    });
}

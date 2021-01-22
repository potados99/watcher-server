import {Socket} from "socket.io";
import watcherService from "../../../services/WatcherService";

export default function handleAppConnection(socket: Socket) {
    watcherService.handleAppOnline(socket);

    socket.on('request:update', (nodeName?: string) => {
        watcherService.handleRequestForUpdate(nodeName);
    });

    socket.on('disconnect', () => {
        watcherService.handleAppOffline(socket);
    });
}

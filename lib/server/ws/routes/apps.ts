import {Socket} from "socket.io";
import appConnectionRepository from "../../../repositories/AppConnectionRepository";

export default function handleAppConnection(socket: Socket) {

    appConnectionRepository.addConnection(socket.id, socket);

    socket.on('disconnect', () => {
        appConnectionRepository.removeConnection(socket.id);
    });
}

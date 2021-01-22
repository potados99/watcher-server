import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import config from "../../config";
import indexRouter from "./http/routes/root";
import identifyNode from "./ws/middlewares/nodes";
import onNodeConnection from "./ws/routes/nodes";
import onAppConnection from "./ws/routes/apps";
import onError from "./ws/routes/error";

export default function startServer() {
    const app = express();
    const httpServer = new http.Server(app);
    const io = new Server(httpServer, config.socket);

    const nodes = io.of('/node');
    const apps = io.of('/app');

    nodes.use(identifyNode);
    nodes.on('connection', onNodeConnection);
    apps.on('connection', onAppConnection)
    io.on('error', onError);

    app.get('/', indexRouter);

    httpServer.listen(8080, () => {
        console.log('Listening on 8080!');
    });
}

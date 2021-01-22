import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import config from "../../config";
import identifyNode from "./ws/middlewares/identifyNode";
import handleNodeConnection from "./ws/routes/nodes";
import handleAppConnection from "./ws/routes/apps";
import handleError from "./ws/routes/error";
import indexRouter from "./http/routes/index";
import watchersRouter from "./http/routes/watchers";

export default function startServer() {
    const app = express();
    const httpServer = new http.Server(app);
    const io = new Server(httpServer, config.socket);

    // HTTP
    app.use('/', indexRouter);
    app.use('/watchers', watchersRouter);

    // WS
    const nodes = io.of('/node');
    const apps = io.of('/app');

    io.on('error', handleError);
    nodes.use(identifyNode);
    nodes.on('connection', handleNodeConnection);
    apps.on('connection', handleAppConnection)

    httpServer.listen(8080, () => {
        console.log('Listening on 8080!');
    });
}

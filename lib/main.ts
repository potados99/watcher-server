import express from "express";
import http from "http";
import config from "../config";
import indexRouter from "./server/http/routes";
import watchersRouter from "./server/http/routes/watchers";
import handleError from "./server/ws/routes/error";
import identifyNode from "./server/ws/middlewares/identifyNode";
import handleNodeConnection from "./server/ws/routes/nodes";
import handleAppConnection from "./server/ws/routes/apps";
import watcherNodeRepository from "./repositories/WatcherNodeRepository";
import {Server} from "socket.io";
import appConnectionRepository from "./repositories/AppConnectionRepository";

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

    watcherNodeRepository.onNodeChanged((node) => {
        appConnectionRepository.emitAll('update:node', {
            node: node
        });
    });

    watcherNodeRepository.onPropChanged((nodeName, prop) => {
       appConnectionRepository.emitAll('update:node:prop', {
           nodeName: nodeName,
           prop: prop
       });
    });

    httpServer.listen(8080, () => {
        console.log('Listening on 8080!');
    });
}

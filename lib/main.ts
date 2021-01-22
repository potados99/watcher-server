import http from "http";
import config from "../config";
import express from "express";
import {Server} from "socket.io";
import handleError from "./server/ws/routes/error";
import identifyNode from "./server/ws/middlewares/identifyNode";
import indexRouter from "./server/http/routes";
import watchersRouter from "./server/http/routes/watchers";
import handleNodeConnection from "./server/ws/routes/nodes";
import handleAppConnection from "./server/ws/routes/apps";

export default function startServer() {
    const app = express();
    const httpServer = new http.Server(app);
    const io = new Server(httpServer, config.socket);

    app.use('/', indexRouter);
    app.use('/watchers', watchersRouter);

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

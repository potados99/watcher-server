import http from "http";
import config from "../config";
import express from "express";
import {Server} from "socket.io";
import handleError from "./server/ws/routes/error";
import identifyNode from "./server/ws/middlewares/identifyNode";
import indexRouter from "./server/http/routes";
import watchersRouter from "./server/http/routes/watchers";
import handleAppConnection from "./server/ws/routes/apps";
import handleNodeConnection from "./server/ws/routes/nodes";

export default function startServer() {
    const app = express();
    const httpServer = new http.Server(app);
    const io = new Server(httpServer, config.socket);

    app.use('/', indexRouter);
    app.use('/watchers', watchersRouter);

    io.on('error', handleError);
    io.of('/app').on('connection', handleAppConnection);
    io.of('/node').on('connection', handleNodeConnection).use(identifyNode);

    httpServer.listen(8080, () => {
        console.log('Listening on 8080!');
    });
}

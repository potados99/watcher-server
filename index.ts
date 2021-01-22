import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = new http.Server(app);
const io = new Server(httpServer, {
    pingTimeout: 2000,
    pingInterval: 5000
});

const nodes = io.of('/node');
const apps = io.of('/app');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

nodes.use((socket, next) => {
    // @ts-ignore
    const {nodeId, nodeName} = socket.handshake.query;

    if (!nodeId || !nodeName) {
        next(new Error('No id or name!'));
    } else {
        next();
        // @ts-ignore
        socket.nodeInfo = {
            id: nodeId,
            name: nodeName
        };
    }
});

nodes.on('connection', (socket) => {
    console.log(`Node attached: ${JSON.stringify(socket.nodeInfo)}`);

    socket.on('usb:connected', (msg: any) => {
       console.log(`USB connected: ${msg}`);
    });

    socket.on('battery', (msg: any) => {
        console.log(`Battery: ${JSON.stringify(msg)}`);
    });

    socket.on('disconnect', () => {
        console.log('Node detached.');
    });
});

io.on('error', (err) => {
    console.log(`Error: ${err}`);
})

httpServer.listen(8080, () => {
   console.log('Listening on 8080!');
});

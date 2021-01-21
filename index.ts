import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = new http.Server(app);
const io = new Server(httpServer, {
    allowEIO3: false
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
   console.log('New socket connection!');

   socket.on('usb-connection', (msg: any) => {
       console.log(`USB connected: ${msg}`);
   });

   socket.on('chat message', (msg: any) => {
       console.log(`New chat: ${msg}`);
       io.emit('chat message', msg);
   });

   socket.on('disconnect', () => {
      console.log('Disconnected!');
   });
});

httpServer.listen(8080, () => {
   console.log('Listening on 8080!');
});

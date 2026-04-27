import http from 'node:http';
import { Server } from 'socket.io'
import express from 'express'
import path from 'node:path'


async function main(){
    const app = express()
    app.use(express.static(path.resolve('./public')))

    const serve = http.createServer(app)

    const io = new Server({}) //socket io server.


    io.attach(serve); //attched the socket server with our server.

    io.on('connection', (socket) => {
        console.log(`A new socket is registered with ${socket.id}`);

        socket.on('user-message', (data) => {
            console.log(` received a message and the message is ${data}`);
            io.emit('server:message', {
                senderId: socket.id,
                message: data
            });
        })

        socket.on('typing', () => {
            socket.broadcast.emit('typing');
        })

        socket.on('stop typing', () => {
            socket.broadcast.emit('stop typing');
        })
    })
    serve.listen(9000, () => {
        console.log(`Server is running on port 9000`);
        
    })
}


main()
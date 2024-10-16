import { createServer } from 'http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT || '3000', 10);

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);
    const io = new SocketIOServer(httpServer);

    // Handle incoming socket connections
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    // API to emit data through Socket.io
    server.post('/api/data', express.json(), (req, res) => {
        const data = req.body;
        io.emit('newData', data);
        res.status(200).json({ message: 'Data sent successfully', data });
    });

    // Default request handling
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // Start the server
    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Server is running on http://localhost:${port}`);
    });
});

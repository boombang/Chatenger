let	http = require("http");
let socketio = require("socket.io");

let sockets = {
    IO: null,	
	mongoStore: null,
	namespaces: {},
    userSockets: [],
    
    init(app, db) {
        let server = http.createServer(app),
        io = socketio(server),
        currentRoom = '';
    
        io.on('connection', socket => {
            console.log('user connected');

            socket.on('disconnect', () => console.log('user disconnected'));

            socket.on('chat message', msg => {
                if(currentRoom) {
                    io.to(currentRoom).emit('chat message', msg);
                }
            });

            socket.on('join room', room => {
                currentRoom = room;
                socket.join(room);
            });

            socket.on('left room', room => {
                currentRoom = '';
                socket.leave(room);
            })
        });
    
        return server;
    }
}

module.exports = sockets;
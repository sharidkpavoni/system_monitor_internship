const io = require('./socket.io');
const socket  = io('http://localhost:3001');

socket.on('connection',() => {
    setInterval(() => {
        socket.emit('test',`TEST`);
    }, 100);
})


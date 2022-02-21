const io = require('socket.io')(3000, {
	cors: {
		origin: true, // true means to use any frontend.
	},
})


const users = {}

//every time user loads this website, it will call this function and will give every user their own socket.
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name //all sockets create a unique id, assigning it to a name will identify the user.
    socket.broadcast.emit('user-connected', name)
  })
  //socket.on actually catches whatever the socket.emit sends down.
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  //broadcast.emit will send the message to every other user connected except for the person who sent it.
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
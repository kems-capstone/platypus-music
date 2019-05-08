module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    const incrementCount = data => {
      io.sockets.emit('addClick', data);
      console.log(data);
    };

    const updateRoom = roomProps => {
      io.sockets.emit('updateRoom', roomProps);
    };

    socket.on('addClick', incrementCount);
    socket.on('updateRoom', updateRoom);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

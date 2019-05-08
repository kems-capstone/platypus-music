module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    const incrementCount = data => {
      io.sockets.emit('addClick', data);
      console.log(data);
    };
    socket.on('addClick', incrementCount);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

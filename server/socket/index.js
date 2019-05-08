module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );


    const updateRoom = roomProps => {
      console.log('update room serverside', io.sockets)
      io.emit('updateRoom', roomProps);
    };


    socket.on('updateRoom', updateRoom);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

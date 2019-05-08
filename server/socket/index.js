module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    const updateRoom = roomProps => {
      socket.broadcast.emit('updateRoom', roomProps);
    };

    socket.on('addedSong', updateRoom);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

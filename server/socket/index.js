module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    const updateRoom = roomProps => {
      socket.broadcast.emit('updateRoom', roomProps);
    };

    const updateVotes = (updatedSong) => {
      socket.broadcast.emit('voteUpdated', updatedSong)
    }

    socket.on('addedSong', updateRoom);

    socket.on('songVoted', updateVotes)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

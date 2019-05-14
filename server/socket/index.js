module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
    let room;
    socket.on('joinSocketRoom', function(roomName) {
      room = roomName;
      socket.join(roomName);
    });

    const addSongToPlaylist = songList => {
      socket.broadcast.to(room).emit('songAdded', songList);
    };
    const removeSongFromPlaylist = songList => {
      socket.broadcast.to(room).emit('songEnded', songList);
    };

    const updateVotes = updatedSong => {
      socket.broadcast.to(room).emit('voteUpdated', updatedSong);
    };
    const updatePlaylist = roomPlaylist => {
      io.to(room).emit('getRoomGotPlaylist', roomPlaylist);
    };

    socket.on('addedSong', addSongToPlaylist);
    socket.on('endedSong', removeSongFromPlaylist);
    socket.on('songVoted', updateVotes);
    socket.on('getRoomGotPlaylist', updatePlaylist);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

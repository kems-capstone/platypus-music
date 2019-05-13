



module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    const addSongToPlaylist = songList => {

      io.emit('songAdded', songList);
    };
    const removeSongFromPlaylist = songList => {
      socket.broadcast.emit('songEnded', songList);
    };

    const updateVotes = (updatedSong) => {
      socket.broadcast.emit('voteUpdated', updatedSong)
    }
    const updatePlaylist = (roomPlaylist) => {


      socket.broadcast.emit('getRoomGotPlaylist', roomPlaylist)
    }

    socket.on('addedSong', addSongToPlaylist);
    socket.on('endedSong', removeSongFromPlaylist)
    socket.on('songVoted', updateVotes)
    socket.on('getRoomGotPlaylist', updatePlaylist)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

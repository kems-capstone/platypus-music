



module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    const addSongToPlaylist = songList => {
      console.log('*****songList function on server fired: ', songList);
      console.log('*****socket id on server in remove song from playlist: ', socket.id);
      io.emit('songAdded', songList);
    };
    const removeSongFromPlaylist = songList => {
      console.log('*****songList function on server fired: ', songList);
      console.log('*****socket id on server in remove song from playlist: ', socket.id);

      socket.broadcast.emit('songEnded', songList);
    };

    const updateVotes = (updatedSong) => {
      socket.broadcast.emit('voteUpdated', updatedSong)
    }






    socket.on('addedSong', addSongToPlaylist);
    socket.on('endedSong', removeSongFromPlaylist)
    socket.on('songVoted', updateVotes)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

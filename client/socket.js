import io from 'socket.io-client'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.emit('joinSocketRoom', window.location.pathname)

export default socket

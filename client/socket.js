import io from 'socket.io-client'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})
console.log(' 0101209237210947',window.location.pathname)
socket.emit('joinSocketRoom', window.location.pathname)


export default socket

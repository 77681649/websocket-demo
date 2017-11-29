const createServer = require('../socket.io.server/app.js')

let server = createServer({
  cwd: __dirname
})

server.on('connection', function (socket) {
  let count = 0

  let timer = setInterval(
    function () {
      socket.volatile.emit('bieber tweet', ++count);
      console.log('send message', count);
    },
    1000
  )

  socket.on('disconnect', function () {
    clearInterval(timer)
  })
})
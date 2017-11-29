const createServer = require('../socket.io.server/app.js')

let server = createServer({
  cwd: __dirname
})

server.on('connection', function (socket) {
  socket.emit('hello', new Date(), function (message) {
    console.log('ack ' + message)
  })
})
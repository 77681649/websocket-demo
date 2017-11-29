const createServer = require('../socket.io.server/app.js')

let server = createServer({
  cwd: __dirname
})

server.on('connection', function (socket) {
  console.log('client connected.')

  socket.send('hello')

  socket.on('message', function (message) {
    console.log('from client : ', message)
  })

  socket.on('disconnect', function () {
    console.log('client disconnected.')
  })
})
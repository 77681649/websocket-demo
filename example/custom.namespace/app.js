const createServer = require('../socket.io.server/app.js')

let server = createServer({
  cwd: __dirname
})

let newsNsp = server.of('/news')
let chatNsp = server.of('/chat')

newsNsp.on('connection', function (socket) {
  console.log('[news] client connected.')

  socket.on('hello', function () {
    console.log('[news] has message.')
  })
})

chatNsp.on('connection', function (socket) {
  console.log('[chat] client connected.')

  socket.on('hello', function () {
    console.log('[chat] has message.')
  })
})
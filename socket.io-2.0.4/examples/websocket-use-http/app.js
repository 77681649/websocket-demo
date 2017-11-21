const http = require('http')
const fs = require('fs')

const PORT = process.env.NODE_PORT || 3000
const ENV = process.env.ENV || 'debug'

const server = http.createServer(onConnection)
const socketIO = require('../../lib/index')(server)

function onConnection(req, res) {
  res.end('ok')
}

function onListen() {
  console.log(`server started. port : ${PORT}`)
}

socketIO.on('connection', function (socket) {
  socket.emit('heartbeat')
})

server.listen(PORT, onListen)

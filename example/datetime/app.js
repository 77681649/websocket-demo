const http = require('http')
const fs = require('fs')
const io = require('socket.io')

function createHttpServer(options) {
  function onRequest(req, res) {
    console.log(req.url)

    if (/(\.js|\.map)$/.test(req.url)) {
      try {
        res.end(fs.readFileSync('public' + req.url))
      } catch (ex) {
        res.statusCode = 404
        res.end('Not Found')
      }
    } else if (req.url == '/') {
      res.end(fs.readFileSync('public/index.html'))
    }
    else {
      res.statusCode = 500
      res.end('Server Error')
    }
  }

  function onListen() {
    console.log('server starting.')
  }

  let server = http.createServer(onRequest)
  let webSocketServer = io(server)
  let sockets = {}
  let id = 0

  setInterval(function () {
    let socketIds = Object.keys(sockets)
    let socket

    if (socketIds.length > 0) {
      webSocketServer.emit('date', (new Date()).toString())
    }
  }, 1000)


  webSocketServer.on('connection', function (socket) {
    function onSocketDisconnect(id) {
      console.log(`client ${id} disconnected.`)

      delete sockets[id]
    }

    sockets[++id] = socket

    console.log(`client ${id} connectioned.`)

    socket.on('disconnect', onSocketDisconnect.bind(this, id))
  });

  server.listen(3000, onListen)
}

createHttpServer()
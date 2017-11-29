const http = require('http')
const fs = require('fs')
const io = require('socket.io')
const path = require('path')

module.exports = function createHttpServer(options) {
  function onRequest(req, res) {
    console.log(req.url)

    if (/(\.js|\.map)$/.test(req.url)) {
      try {
        res.end(fs.readFileSync(path.join(__dirname, req.url)))
      } catch (ex) {
        res.statusCode = 404
        res.end('Not Found')
      }
    } else if (req.url == '/') {
      res.end(fs.readFileSync(options.cwd + '/index.html'))
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

  server.listen(3000, onListen)

  return webSocketServer
}
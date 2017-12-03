const createServer = require('../socket.io.server/app.js')
const redis = require('socket.io-redis')

let server = createServer({
  cwd: __dirname
})

server.adapter(redis({ host: 'localhost', port: 6379 }))

server.on('connection',function(){
  console.log('connected.')

  server.on('time', function (date) {
    console.log('time')
    console.log(date)
  })
})
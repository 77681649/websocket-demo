const createServer = require('../socket.io.server/app.js')

let io = createServer({
  cwd: __dirname
})

let hasMaster = false
let masterSocket = null

io
  .to('roomA')
  .on('connection', function (socket) {
    socket.join('roomA')

    // "roomA"房间中的socket都会收到消息
    io.emit('message', 'Welcome to roomA.')

    if (!hasMaster) {
      hasMaster = true
      masterSocket = socket

      setInterval(function () {
        masterSocket && masterSocket.broadcast.emit('message', '请使用文明语言!')
      }, 5000)

      // 将广播消息到 "user" 房间
      masterSocket.emit('message', 'The client is admin.')
      masterSocket.to('user')
    } else {
      socket.join('user') // 关联"uesr"房间 , 将接收到广播到"user"的消息
      socket.emit('message', 'The client is user.')
    }
    
    socket.on('disconnect', function () { 
      if (socket == masterSocket) {
        console.log('disconnect')

        hasMaster = false
        masterSocket = null
      }
    })
  })
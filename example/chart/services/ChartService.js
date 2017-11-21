const SocketIO = require('socket.io')
const debug = require('debug')('chatServer')

const EVENT_USER_ENTER = 'user enter'
const EVENT_USER_LEAVE = 'user leave'
const EVENT_CHART_MESSAGE = 'chat message'

class ChatService {
  constructor(httpServer) {
    let io = this._io = SocketIO(httpServer)

    this.init()

    return io
  }

  get io() {
    return this._os
  }

  static start(httpServer) {
    return new ChatService(httpServer)
  }

  init() {
    let io = this._io

    io.on('connection', this.onWebSocketConnection.bind(this))
  }

  onWebSocketConnection(socket) {
    const that = this
    const onChatMessage = this.onChatMessage.bind(this, socket)
    const onWebSocketDisconnect = this.onWebSocketDisconnect.bind(this, socket)
    let nickname = null

    console.log('[WebSocket] a user connceted.')

    !(function () {
      socket.on(EVENT_USER_ENTER, function (_nickname) {
        let resp = {
          errcode: 0,
          data: { nickname: _nickname }
        }

        nickname = _nickname

        socket.emit(EVENT_USER_ENTER, resp)
        socket.broadcast.emit(EVENT_USER_ENTER, resp)
      })

      socket.on(EVENT_CHART_MESSAGE, onChatMessage)
      socket.on('disconnect', function () {
        onWebSocketDisconnect(nickname)
      })
    })()
  }

  onChatMessage(socket, data) {
    const resp = {
      errcode: 0,
      data: data
    }

    socket.emit(EVENT_CHART_MESSAGE, resp)
    socket.broadcast.emit(EVENT_CHART_MESSAGE, resp)
  }

  onWebSocketDisconnect(socket, nickname) {
    console.log('[WebSocket] a user disconnect.')

    let resp = { errcode: 0, data: { nickname } }

    socket.broadcast.emit(EVENT_USER_LEAVE, resp)
  }
}

module.exports = ChatService
const emitter = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
emitter.redis.on('error', onError);

function onError(err) {
  console.log(err);
}

function onError(err) {
  console.log(err);
}


setInterval(function () {
  console.log('emit')
  emitter.emit('time', new Date);
}, 5000);
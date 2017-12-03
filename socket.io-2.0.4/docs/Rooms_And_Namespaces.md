# Namespaces 命名空间

Socket.IO allows you to “namespace” your sockets, which essentially means assigning different endpoints or paths.

_Socet.IO 允许将多个socket划分到不同的"命名空间",实际上这意味将多个sockets分配到不同的端点或路径上._

This is a useful feature to minimize the number of resources (TCP connections) and at the same time separate concerns within your application by introducing separation between communication channels.

_"命名空间"是一个有用的特性 :_

_1. 尽可能的减少资源(这里的资源指TCP 连接)数量_

_2. 通过隔离的通信渠道分离应用中的关注点_



## Default namespace 默认命名空间
We call the default namespace / and it’s the one Socket.IO clients connect to by default, and the one the server listens to by default.

_我们将"/"叫做"默认命名空间".Socket.IO客户端默认会连接到它,并且服务器默认也会监听它._

This namespace is identified by io.sockets or simply io:

_通过"io.sockets"或简写的"io"标识出默认空间_

```javascript
let io = require('socket.io')(80)

// the following two will emit to all the sockets connected to "/"
io.sockets.emit("hi", "everyone");

// short form
io.emit("hi", "everyone"); 
```

Each namespace emits a connection event that receives each Socket instance as a parameter

_每个命名空间都会触发一个将每个Socket实例作为参数接收的"connection"事件_

```javascript
let io = require('socket.io')(80)

io.on('connection', function(socket){
  socket.on('disconnect', function(){ });
});
```


## Custom namespaces 自定义命名空间
To set up a custom namespace, you can call the of function on the server-side:

_在服务端,你能通过调用"of"函数建立一个自定义命名空间:_

```javascript
var io = require('socket-io')(80);
var nsp = io.of('/my-namespace');

nsp.on('connection', function(socket){
  console.log('someone connected');
});

nsp.emit('hi', 'everyone!');
```

On the client side, you tell Socket.IO client to connect to that namespace:

_在客户端,你可以通过Socket.IO client连接到自定义的命名空间_

```javascript
var socket = io('/my-namespace');
```

Important note: The namespace is an implementation detail of the Socket.IO protocol, and is not related to the actual URL of the underlying transport, which defaults to /socket.io/….

_**重要提示:**_

_命名空间是Socket.IO协议的实现细节,它与底层传输的真实URL(默认情况下,"/socket.io/.." , 可以通过io.path()或初始化时配置)无关._



# Rooms
Within each namespace, you can also define arbitrary channels that sockets can join and leave.

_在每个命名空间中,你还可以定义socket可以随意进出的频道(即房间)._


## Joining and leaving
You can call join to subscribe the socket to a given channel:

_你能通过调用"socket.join()"来订阅一个指定的频道:_

_你能调用"join"方法_

```javascript
io.on('connection', function(socket){
  socket.join('some room');
});
```

And then simply use to or in (they are the same) when broadcasting or emitting:

_然后,当广播或namespace.emit时简单地使用"to"或"in"实现将事件发送到指定频道:_

```javascript

// to/in 功能一样 , 都是新增一个房间
io.to('some room').emit('some event');
io.in('some room').emit('some event');

socket.in('some room').broadcast.emit('some event');

```

To leave a channel you call leave in the same fashion as join.

_要离开一个频道,你可以通过与"join"一样的方式调用"leavel"._


## Default room 默认房间
Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id. For your convenience, each socket automatically joins a room identified by this id.

_Sokcet.IO中的每一个Socket都通过一个随即的,不预测的,唯一标志符"socket#id"来标识的.为方便使用,每个Socket都会自动加入一个由socket#id来标识的房间.(即默认房间)_

This makes it easy to broadcast messages to other sockets:

_默认房间使向其他socket广播消息变得容易._

```javascript

io.on('connection', function(socket){
  socket.on('say to someone', function(id, msg){
    socket.broadcast.to(id).emit('my message', msg);
  });
});

```


## Disconnection 断开连接
Upon disconnection, sockets leave all the channels they were part of automatically, and no specially teardown is needed on your part.

_断开连接时,sockets会自动离开所有取到,无需人工干预.


## Sending messages from the outside-world 从外部世界发送消息
In some cases, you might want to emit events to sockets in Socket.IO namespaces / rooms from outside the context of your Socket.IO processes.

_某些情况下,你可能从Sokcet.IO进程上下文之外,向Socket.IO的命名空间"/"发送事件._

There’s several ways to tackle this problem, like implementing your own channel to send messages into the process.

_有集中方法解决这个问题,比如实现自己的频道向进程发送消息._

To facilitate this use case, we created two modules:

_为了方便实现以上情况,我们创建两个模块:_

* socket.io-redis
* socket.io-emitter

By implementing the Redis Adapter:

_实现Redis适配器:_

```javascript

var io = require('socket.io')(3000);
var redis = require('socket.io-redis');

io.adapter(redis({ host: 'localhost', port: 6379 }));

```

you can then emit messages from any other process to any channel

_然后通过"emit" , 能将消息发送从任何进程发送到任何渠道中 :_

```javascript

var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
setInterval(function(){
  io.emit('time', new Date);
}, 5000);

```
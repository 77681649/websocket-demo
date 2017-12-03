
## Table of Contents

  - [Class: Server](#server)
    - [new Server(httpServer[, options])](#new-serverhttpserver-options)
    - [new Server(port[, options])](#new-serverport-options)
    - [new Server(options)](#new-serveroptions)
    - [server.sockets](#serversockets)
    - [server.engine.generateId](#serverenginegenerateid)
    - [server.serveClient([value])](#serverserveclientvalue)
    - [server.path([value])](#serverpathvalue)
    - [server.adapter([value])](#serveradaptervalue)
    - [server.origins([value])](#serveroriginsvalue)
    - [server.origins(fn)](#serveroriginsfn)
    - [server.attach(httpServer[, options])](#serverattachhttpserver-options)
    - [server.attach(port[, options])](#serverattachport-options)
    - [server.listen(httpServer[, options])](#serverlistenhttpserver-options)
    - [server.listen(port[, options])](#serverlistenport-options)
    - [server.bind(engine)](#serverbindengine)
    - [server.onconnection(socket)](#serveronconnectionsocket)
    - [server.of(nsp)](#serverofnsp)
    - [server.close([callback])](#serverclosecallback)
  - [Class: Namespace](#namespace)
    - [namespace.name](#namespacename)
    - [namespace.connected](#namespaceconnected)
    - [namespace.adapter](#namespaceadapter)
    - [namespace.to(room)](#namespacetoroom)
    - [namespace.in(room)](#namespaceinroom)
    - [namespace.emit(eventName[, ...args])](#namespaceemiteventname-args)
    - [namespace.clients(callback)](#namespaceclientscallback)
    - [namespace.use(fn)](#namespaceusefn)
    - [Event: 'connect'](#event-connect)
    - [Event: 'connection'](#event-connect)
    - [Flag: 'volatile'](#flag-volatile)
    - [Flag: 'local'](#flag-local)
  - [Class: Socket](#socket)
    - [socket.id](#socketid)
    - [socket.rooms](#socketrooms)
    - [socket.client](#socketclient)
    - [socket.conn](#socketconn)
    - [socket.request](#socketrequest)
    - [socket.handshake](#sockethandshake)
    - [socket.use(fn)](#socketusefn)
    - [socket.send([...args][, ack])](#socketsendargs-ack)
    - [socket.emit(eventName[, ...args][, ack])](#socketemiteventname-args-ack)
    - [socket.on(eventName, callback)](#socketoneventname-callback)
    - [socket.once(eventName, listener)](#socketonceeventname-listener)
    - [socket.removeListener(eventName, listener)](#socketremovelistenereventname-listener)
    - [socket.removeAllListeners([eventName])](#socketremovealllistenerseventname)
    - [socket.eventNames()](#socketeventnames)
    - [socket.join(room[, callback])](#socketjoinroom-callback)
    - [socket.join(rooms[, callback])](#socketjoinrooms-callback)
    - [socket.leave(room[, callback])](#socketleaveroom-callback)
    - [socket.to(room)](#sockettoroom)
    - [socket.in(room)](#socketinroom)
    - [socket.compress(value)](#socketcompressvalue)
    - [socket.disconnect(close)](#socketdisconnectclose)
    - [Flag: 'broadcast'](#flag-broadcast)
    - [Flag: 'volatile'](#flag-volatile-1)
    - [Event: 'disconnect'](#event-disconnect)
    - [Event: 'error'](#event-error)
    - [Event: 'disconnecting'](#event-disconnecting)
  - [Class: Client](#client)
    - [client.conn](#clientconn)
    - [client.request](#clientrequest)


### Server

Exposed by `require('socket.io')`.

#### new Server(httpServer[, options])

  - `httpServer` _(http.Server)_ the server to bind to. 
  - `httpServer` _(http.Server)_ _绑定的服务器._
  - `options` _(Object)_
    - `path` _(String)_: name of the path to capture (`/socket.io`)
    - `path` _(String)_: 捕捉的path (`/socket.io`)
    - `serveClient` _(Boolean)_: whether to serve the client files (`true`)
    - `serveClient` _(Boolean)_: 是否提供客户端文件 (`true`)
    - `adapter` _(Adapter)_: the adapter to use. Defaults to an instance of the `Adapter` that ships with socket.io which is memory based. See [socket.io-adapter](https://github.com/socketio/socket.io-adapter)
    - `origins` _(String)_: the allowed origins (`*`)
    - `parser` _(Parser)_: the parser to use. Defaults to an instance of the `Parser` that ships with socket.io. See [socket.io-parser](https://github.com/socketio/socket.io-parser).

Works with and without `new`:

```js
const io = require('socket.io')();
// or
const Server = require('socket.io');
const io = new Server();
```

The same options passed to socket.io are always passed to the `engine.io` `Server` that gets created. See engine.io [options](https://github.com/socketio/engine.io#methods-1) as reference.

_传给socket.io的参数,会原封不动的传递给它创建的"engine.io"服务._

Among those options:
_其中的一些属性:_
  - `pingTimeout` _(Number)_: how many ms without a pong packet to consider the connection closed (`60000`)
  - `pingTimeout` _(Number)_: 多少毫秒没有收到"ping"数据报时,考虑关闭连接 (`60000`)
  - `pingInterval` _(Number)_: how many ms before sending a new ping packet (`25000`).
  - `pingInterval` _(Number)_: 隔多少毫秒之后发送新的"ping"包 (`25000`).

Those two parameters will impact the delay before a client knows the server is not available anymore. For example, if the underlying TCP connection is not closed properly due to a network issue, a client may have to wait up to `pingTimeout + pingInterval` ms before getting a `disconnect` event.

-这两个参数将影响一个客户端知道服务器不再可用之前的延时时间.例如,如果TCP连接在网络异常时断开,一个客户端可能必须等待"pingTimeout+pingInterval"毫秒之后,才会触发"disconnect"事件

  - `transports` _(Array<String>)_: transports to allow connections to (`['polling', 'websocket']`).

**Note:** The order is important. By default, a long-polling connection is established first, and then upgraded to WebSocket if possible. Using `['websocket']` means there will be no fallback if a WebSocket connection cannot be opened.

_**注意**:顺序很重要.默认情况下,首先建立一个长连接,然后尝试升级到websocket.如果使用["websocket"]的话,如果WebSokcet不可用,将不会有后备方案._

```js
const server = require('http').createServer();

const io = require('socket.io')(server, {
  path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3000);
```

#### new Server(port[, options])

  - `port` _(Number)_ a port to listen to (a new `http.Server` will be created)
  - `options` _(Object)_

See [above](#new-serverhttpserver-options) for available options.

```js
const server = require('http').createServer();

const io = require('socket.io')(3000, {
  path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```

#### new Server(options)

  - `options` _(Object)_

See [above](#new-serverhttpserver-options) for available options.

```js
const io = require('socket.io')({
  path: '/test',
  serveClient: false,
});

// either
const server = require('http').createServer();

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3000);

// or
io.attach(3000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```

#### server.sockets

  * _(Namespace)_

The default (`/`) namespace.

#### server.serveClient([value])

  - `value` _(Boolean)_
  - **Returns** `Server|Boolean`

If `value` is `true` the attached server (see `Server#attach`) will serve the client files. Defaults to `true`. This method has no effect after `attach` is called. If no arguments are supplied this method returns the current value.

_如果value=true,那么将向服务器追加提供client文件的处理器.默认为ture.这个方法在调用"attach"之后将失效效果.如果没有提供参数,该方法将返回当前值._

```js
// pass a server and the `serveClient` option
const io = require('socket.io')(http, { serveClient: false });

// or pass no server and then you can call the method
const io = require('socket.io')();
io.serveClient(false);
io.attach(http);
```

#### server.path([value])

  - `value` _(String)_
  - **Returns** `Server|String`

Sets the path `value` under which `engine.io` and the static files will be served. Defaults to `/socket.io`. If no arguments are supplied this method returns the current value.

设置"engine.io"和(客户端)静态文件的访问路径.默认值为"/socket/io".如果没有提供参数,该方法将返回当前值.

```js
const io = require('socket.io')();
io.path('/myownpath');

// client-side
const socket = io({
  path: '/myownpath'
});
```

#### server.adapter([value])

  - `value` _(Adapter)_
  - **Returns** `Server|Adapter`

Sets the adapter `value`. Defaults to an instance of the `Adapter` that ships with socket.io which is memory based. See [socket.io-adapter](https://github.com/socketio/socket.io-adapter). If no arguments are supplied this method returns the current value.

_设置适配器的值.默认情况下,是一个基于内容的socket.io Adapater的实例.如果没有提供参数,那么调用该方法将返回当前值._

```js
const io = require('socket.io')(3000);
const redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
```

#### server.origins([value])

  - `value` _(String)_
  - **Returns** `Server|String`

Sets the allowed origins `value`. Defaults to any origins being allowed. If no arguments are supplied this method returns the current value.

_设置允许访问的来源的值.默认情况下,允许所有来源访问.如果没有提供参数,那么调用该方法将返回当前值._

```js
io.origins(['foo.example.com:443']);
```

#### server.origins(fn)

  - `fn` _(Function)_
  - **Returns** `Server`

Provides a function taking two arguments `origin:String` and `callback(error, success)`, where `success` is a boolean value indicating whether origin is allowed or not.

_提供一个接收两个参数`origin:String` 和 `callback(error, success)` ,其中`success`是一个布尔值,用来表示origin是否允许访问._

__Potential drawbacks__: 潜在缺陷
* in some situations, when it is not possible to determine `origin` it may have value of `*`

_* 某些情况下,当不可能确定"origin"时,它可能具有"*"的值_

* As this function will be executed for every request, it is advised to make this function work as fast as possible

_* 由于每个请求都会调用该函数,所有建议使函数尽可能的高效._

* If `socket.io` is used together with `Express`, the CORS headers will be affected only for `socket.io` requests. For Express you can use [cors](https://github.com/expressjs/cors).

_* 如果`socket.io`是与`Express`一起工作,CROS头只会受到`socket.io`请求的影响._

```js
io.origins((origin, callback) => {
  if (origin !== 'https://foo.example.com') {
    return callback('origin not allowed', false);
  }
  callback(null, true);
});
```

#### server.attach(httpServer[, options])

  - `httpServer` _(http.Server)_ the server to attach to
  - `options` _(Object)_

Attaches the `Server` to an engine.io instance on `httpServer` with the supplied `options` (optionally).

_通过提供的`options`,在`httpServer`基础之上,建立`Server`与engie.io实例上的连接._

#### server.attach(port[, options])

  - `port` _(Number)_ the port to listen on
  - `options` _(Object)_

Attaches the `Server` to an engine.io instance on a new http.Server with the supplied `options` (optionally).

_通过提供的`options`,在创建的新的http.Server基础之上,建立`Server`与engie.io实例上的连接._
__

#### server.listen(httpServer[, options])

Synonym of [server.attach(httpServer[, options])](#serverattachhttpserver-options).

#### server.listen(port[, options])

Synonym of [server.attach(port[, options])](#serverattachport-options).

#### server.bind(engine)

  - `engine` _(engine.Server)_
  - **Returns** `Server`

Advanced use only. Binds the server to a specific engine.io `Server` (or compatible API) instance.

_仅限高级用法.将`Server`绑定到特定的engie.io实例(或实现兼容接口的实例)._

#### server.onconnection(socket)

  - `socket` _(engine.Socket)_
  - **Returns** `Server`

Advanced use only. Creates a new `socket.io` client from the incoming engine.io (or compatible API) `Socket`.

_仅限高级用法.创建一个新的来自engine.io的`socket.io`客户端(或实现兼容接口的实例)._

#### server.of(nsp)

  - `nsp` _(String)_
  - **Returns** `Namespace`

Initializes and retrieves the given `Namespace` by its pathname identifier `nsp`. If the namespace was already initialized it returns it immediately.

_通过路径标志符`nsp`创建并返回一个给定的`Namespace`.如果命名空间已经实例化过,那么立即返回对应的实例_

```js
const adminNamespace = io.of('/admin');
```

#### server.close([callback])

  - `callback` _(Function)_

Closes the socket.io server. The `callback` argument is optional and will be called when all connections are closed.

_关闭socket.io服务器.`callback`参数是可选的,当所有连接关闭之后被调用_

```js
const Server = require('socket.io');
const PORT   = 3030;
const server = require('http').Server();

const io = Server(PORT);

io.close(); // Close current server

server.listen(PORT); // PORT is free to use

io = Server(server);
```

#### server.engine.generateId

Overwrites the default method to generate your custom socket id.

The function is called with a node request object (`http.IncomingMessage`) as first parameter.

_覆盖默认方法来生成自定义的socket#id._

_调用这个函数会接收到一个节点请求对象作为第一个参数._

```js
io.engine.generateId = (req) => {
  return "custom:id:" + custom_id++; // custom id must be unique
}
```

### Namespace 命名空间

Represents a pool of sockets connected under a given scope identified
by a pathname (eg: `/chat`).

_表示在通过pathname标识的指定范围内的socket的连接池.(比如 : `/chat`)._

A client always connects to `/` (the main namespace), then potentially connect to other namespaces (while using the same underlying connection).

_客户端总是先连接到命名空间`/`(主命名空间),然后才可能连接到其他的命名空间(使用同一底层TCP连接)._

#### namespace.name 命名空间的名称

  * _(String)_

The namespace identifier property.

_命名空间的标识属性._

#### namespace.connected

  * _(Object<Socket>)_

The hash of `Socket` objects that are connected to this namespace, indexed by `id`.

_连接到这个命名空间的已连接上的`Socket`对象字典,通过socket的`id`进行索引._

#### namespace.adapter 

  * _(Adapter)_

The `Adapter` used for the namespace. Useful when using the `Adapter` based on [Redis](https://github.com/socketio/socket.io-redis), as it exposes methods to manage sockets and rooms accross your cluster.

_用于命名空间的适配器.当使用基于Redis的`Adapter`时很有用,因为它暴露方法去管理访问集群的socket和room._

**Note:** the adapter of the main namespace can be accessed with `io.of('/').adapter`.

_**提示** 主命名空间的adapter能使用`io.of('/').adapter`访问_

#### namespace.to(room)

  - `room` _(String)_
  - **Returns** `Namespace` for chaining

Sets a modifier for a subsequent event emission that the event will only be _broadcasted_ to clients that have joined the given `room`.

_为随后的发射的事件设置一个修饰器,使得该事件仅广播给加入了给定`room`的客户端._

To emit to multiple rooms, you can call `to` several times.

_多次调用`to`可以将事件发送到多个room._

```js
const io = require('socket.io')();
const adminNamespace = io.of('/admin');

adminNamespace.to('level1').emit('an event', { some: 'data' });
```

#### namespace.in(room)

Synonym of [namespace.to(room)](#namespacetoroom).

#### namespace.emit(eventName[, ...args])

  - `eventName` _(String)_
  - `args`

Emits an event to all connected clients. The following two are equivalent:

_向所有连接上的客户端发送事件.以下两个是等价的:_

```js
const io = require('socket.io')();
io.emit('an event sent to all connected clients'); // main namespace

const chat = io.of('/chat');
chat.emit('an event sent to all connected clients in chat namespace');
```

**Note:** acknowledgements are not supported when emitting from namespace.

_**注意** 从命名空间发送的消息不支持"确认"机制._

#### namespace.clients(callback)

  - `callback` _(Function)_

Gets a list of client IDs connected to this namespace (across all nodes if applicable).

_获得由连接到该命名空间的客户端组成的列表()._

```js
const io = require('socket.io')();
io.of('/chat').clients((error, clients) => {
  if (error) throw error;
  console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
});
```

An example to get all clients in namespace's room:

```js
io.of('/chat').in('general').clients((error, clients) => {
  if (error) throw error;
  console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
});
```

As with broadcasting, the default is all clients from the default namespace ('/'):

```js
io.clients((error, clients) => {
  if (error) throw error;
  console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
});
```

#### namespace.use(fn)

  - `fn` _(Function)_

Registers a middleware, which is a function that gets executed for every incoming `Socket`, and receives as parameters the socket and a function to optionally defer execution to the next registered middleware.

_注册一个中间件,中间件是一个当有`Socket`接进来时都会得到执行的函数,它接收socket和一个可以可控的延迟执行下一个注册中间件的函数作为参数._

Errors passed to middleware callbacks are sent as special `error` packets to clients.

_传递给中间件回调函数的错误,将会作为特殊的`error`数据报发送给客户端._

```js
io.use((socket, next) => {
  if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));
});
```

#### Event: 'connect'

  - `socket` _(Socket)_ socket connection with client

Fired upon a connection from client.

```js
io.on('connect', (socket) => {
  // ...
});

io.of('/admin').on('connect', (socket) => {
  // ...
});
```

#### Event: 'connection'

Synonym of [Event: 'connect'](#event-connect).

#### Flag: 'volatile'

Sets a modifier for a subsequent event emission that the event data may be lost if the clients are not ready to receive messages (because of network slowness or other issues, or because they’re connected through long polling and is in the middle of a request-response cycle).

_为随后发送的事件设置一个修饰符,即如果客户端没有准备好接收数据(可能是因为网络慢或其他原因,或是因为他们一直处于长轮询的一个request-response循环的中),允许丢失事件数据._

```js
io.volatile.emit('an event', { some: 'data' }); // the clients may or may not receive it
```

#### Flag: 'local'

Sets a modifier for a subsequent event emission that the event data will only be _broadcast_ to the current node (when the [Redis adapter](https://github.com/socketio/socket.io-redis) is used).

_为随后发送的事件设置一个修饰符,事件数据只会发送广播到当前节点(当使用redis adapter时)_

```js
io.local.emit('an event', { some: 'data' });
```

### Socket

A `Socket` is the fundamental class for interacting with browser clients. A `Socket` belongs to a certain `Namespace` (by default `/`) and uses an underlying `Client` to communicate.

It should be noted the `Socket` doesn't relate directly to the actual underlying TCP/IP `socket` and it is only the name of the class.

Within each `Namespace`, you can also define arbitrary channels (called `room`) that the `Socket` can join and leave. That provides a convenient way to broadcast to a group of `Socket`s (see `Socket#to` below).

The `Socket` class inherits from [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter). The `Socket` class overrides the `emit` method, and does not modify any other `EventEmitter` method. All methods documented here which also appear as `EventEmitter` methods (apart from `emit`) are implemented by `EventEmitter`, and documentation for `EventEmitter` applies.

#### socket.id

  * _(String)_

A unique identifier for the session, that comes from the underlying `Client`.

#### socket.rooms

  * _(Object)_

A hash of strings identifying the rooms this client is in, indexed by room name.

```js
io.on('connection', (socket) => {
  socket.join('room 237', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237' ]
  });
});
```

#### socket.client

  * _(Client)_

A reference to the underlying `Client` object.

#### socket.conn

  * _(engine.Socket)_

A reference to the underlying `Client` transport connection (engine.io `Socket` object). This allows access to the IO transport layer, which still (mostly) abstracts the actual TCP/IP socket.

#### socket.request

  * _(Request)_

A getter proxy that returns the reference to the `request` that originated the underlying engine.io `Client`. Useful for accessing request headers such as `Cookie` or `User-Agent`.

#### socket.handshake

  * _(Object)_

The handshake details:

```js
{
  headers: /* the headers sent as part of the handshake */,
  time: /* the date of creation (as string) */,
  address: /* the ip of the client */,
  xdomain: /* whether the connection is cross-domain */,
  secure: /* whether the connection is secure */,
  issued: /* the date of creation (as unix timestamp) */,
  url: /* the request URL string */,
  query: /* the query object */
}
```

Usage:

```js
io.use((socket, next) => {
  let handshake = socket.handshake;
  // ...
});

io.on('connection', (socket) => {
  let handshake = socket.handshake;
  // ...
});
```

#### socket.use(fn)

  - `fn` _(Function)_

Registers a middleware, which is a function that gets executed for every incoming `Packet` and receives as parameter the packet and a function to optionally defer execution to the next registered middleware.

Errors passed to middleware callbacks are sent as special `error` packets to clients.

```js
io.on('connection', (socket) => {
  socket.use((packet, next) => {
    if (packet.doge === true) return next();
    next(new Error('Not a doge error'));
  });
});
```

#### socket.send([...args][, ack])

  - `args`
  - `ack` _(Function)_
  - **Returns** `Socket`

Sends a `message` event. See [socket.emit(eventName[, ...args][, ack])](#socketemiteventname-args-ack).

#### socket.emit(eventName[, ...args][, ack])

*(overrides `EventEmitter.emit`)*
  - `eventName` _(String)_
  - `args`
  - `ack` _(Function)_
  - **Returns** `Socket`

Emits an event to the socket identified by the string name. Any other parameters can be included. All serializable datastructures are supported, including `Buffer`.

```js
socket.emit('hello', 'world');
socket.emit('with-binary', 1, '2', { 3: '4', 5: new Buffer(6) });
```

The `ack` argument is optional and will be called with the client's answer.

```js
io.on('connection', (socket) => {
  socket.emit('an event', { some: 'data' });

  socket.emit('ferret', 'tobi', (data) => {
    console.log(data); // data will be 'woot'
  });

  // the client code
  // client.on('ferret', (name, fn) => {
  //   fn('woot');
  // });

});
```

#### socket.on(eventName, callback)

*(inherited from `EventEmitter`)*
  - `eventName` _(String)_
  - `callback` _(Function)_
  - **Returns** `Socket`

Register a new handler for the given event.

```js
socket.on('news', (data) => {
  console.log(data);
});
// with several arguments
socket.on('news', (arg1, arg2, arg3) => {
  // ...
});
// or with acknowledgement
socket.on('news', (data, callback) => {
  callback(0);
});
```

#### socket.once(eventName, listener)
#### socket.removeListener(eventName, listener)
#### socket.removeAllListeners([eventName])
#### socket.eventNames()

Inherited from `EventEmitter` (along with other methods not mentioned here). See Node.js documentation for the `events` module.

#### socket.join(room[, callback])

  - `room` _(String)_
  - `callback` _(Function)_
  - **Returns** `Socket` for chaining

Adds the client to the `room`, and fires optionally a callback with `err` signature (if any).

```js
io.on('connection', (socket) => {
  socket.join('room 237', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237' ]
    io.to('room 237').emit('a new user has joined the room'); // broadcast to everyone in the room
  });
});
```

The mechanics of joining rooms are handled by the `Adapter` that has been configured (see `Server#adapter` above), defaulting to [socket.io-adapter](https://github.com/socketio/socket.io-adapter).

For your convenience, each socket automatically joins a room identified by its id (see `Socket#id`). This makes it easy to broadcast messages to other sockets:

```js
io.on('connection', (socket) => {
  socket.on('say to someone', (id, msg) => {
    // send a private message to the socket with the given id
    socket.to(id).emit('my message', msg);
  });
});
```

#### socket.join(rooms[, callback])

  - `rooms` _(Array)_
  - `callback` _(Function)_
  - **Returns** `Socket` for chaining

Adds the client to the list of room, and fires optionally a callback with `err` signature (if any).

#### socket.leave(room[, callback])

  - `room` _(String)_
  - `callback` _(Function)_
  - **Returns** `Socket` for chaining

Removes the client from `room`, and fires optionally a callback with `err` signature (if any).

**Rooms are left automatically upon disconnection**.

#### socket.to(room)

  - `room` _(String)_
  - **Returns** `Socket` for chaining

Sets a modifier for a subsequent event emission that the event will only be _broadcasted_ to clients that have joined the given `room` (the socket itself being excluded).

To emit to multiple rooms, you can call `to` several times.

```js
io.on('connection', (socket) => {
  // to one room
  socket.to('others').emit('an event', { some: 'data' });
  // to multiple rooms
  socket.to('room1').to('room2').emit('hello');
  // a private message to another socket
  socket.to(/* another socket id */).emit('hey');
});
```

**Note:** acknowledgements are not supported when broadcasting.

#### socket.in(room)

Synonym of [socket.to(room)](#sockettoroom).

#### socket.compress(value)

  - `value` _(Boolean)_ whether to following packet will be compressed
  - **Returns** `Socket` for chaining

Sets a modifier for a subsequent event emission that the event data will only be _compressed_ if the value is `true`. Defaults to `true` when you don't call the method.

```js
io.on('connection', (socket) => {
  socket.compress(false).emit('uncompressed', "that's rough");
});
```

#### socket.disconnect(close)

  - `close` _(Boolean)_ whether to close the underlying connection
  - **Returns** `Socket`

Disconnects this client. If value of close is `true`, closes the underlying connection. Otherwise, it just disconnects the namespace.

```js
io.on('connection', (socket) => {
  setTimeout(() => socket.disconnect(true), 5000);
});
```

#### Flag: 'broadcast'

Sets a modifier for a subsequent event emission that the event data will only be _broadcast_ to every sockets but the sender.

```js
io.on('connection', (socket) => {
  socket.broadcast.emit('an event', { some: 'data' }); // everyone gets it but the sender
});
```

#### Flag: 'volatile'

Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to receive messages (because of network slowness or other issues, or because they’re connected through long polling and is in the middle of a request-response cycle).

```js
io.on('connection', (socket) => {
  socket.volatile.emit('an event', { some: 'data' }); // the client may or may not receive it
});
```

#### Event: 'disconnect'

  - `reason` _(String)_ the reason of the disconnection (either client or server-side)

Fired upon disconnection.

```js
io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    // ...
  });
});
```

#### Event: 'error'

  - `error` _(Object)_ error object

Fired when an error occurs.

```js
io.on('connection', (socket) => {
  socket.on('error', (error) => {
    // ...
  });
});
```

#### Event: 'disconnecting'

  - `reason` _(String)_ the reason of the disconnection (either client or server-side)

Fired when the client is going to be disconnected (but hasn't left its `rooms` yet).

```js
io.on('connection', (socket) => {
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    // ...
  });
});
```

These are reserved events (along with `connect`, `newListener` and `removeListener`) which cannot be used as event names.

### Client

The `Client` class represents an incoming transport (engine.io) connection. A `Client` can be associated with many multiplexed `Socket`s that belong to different `Namespace`s.

#### client.conn

  * _(engine.Socket)_

A reference to the underlying `engine.io` `Socket` connection.

#### client.request

  * _(Request)_

A getter proxy that returns the reference to the `request` that originated the engine.io connection. Useful for accessing request headers such as `Cookie` or `User-Agent`.

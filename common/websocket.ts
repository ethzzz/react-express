import { Socket } from "socket.io";
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '#/socket'
import { Server } from "socket.io";
import { createServer } from "http";
import { createTokenCheck } from "@/config/jwtConfig";
import { Server as WebSocketServer } from 'ws'
import { getLogger } from "log4js";

const log = getLogger("common/websocket");

export const initWebsocket = (app:any) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket:any, next:Function) => {
    const token = socket.handshake.query.token;

    if (!token) {
      return next(new Error("Token missing"));
    }

    createTokenCheck.checkToken(token, (err:Error, decoded:any) => {
      if (err) {
        return next(new Error("Token invalid"));
      }

      socket.user = decoded; // 将用户信息附加到 socket 对象上
      next();
    });
  });

  io.on("connection", (socket:any) => {
    log.info("a user connected");
    socket.on("message", (message:any) => {
      log.info(`Received message from ${socket.user.username}: ${message}`);
      socket.send(`Server received:${message}`);
    });

    socket.on("disconnect", (socket:any) => {
      log.info("a user disconnected");
    });
  });
};

// 初始化socket服务2
export const initWebsocket2 = (callback:Function) => {
  const httpServer = createServer()
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer,{
    cors: {
      origin: "*",
      credentials:true
    },
  });

  (global as any).ms.websocketIO = io

  // 主空间
  io.on("connection",(socket:Socket)=>{
    log.info('New User is Connected')
    socket.on("disconnect", (socket:any) => {
      log.info("a user disconnected");
    })
  })

  // 独立命名空间
  io.of("/chat").use((socket:any, next:Function) => {
    let token = socket.handshake.query.token as unknown as string
    let checkToken = token!.split("Bearer ")[1]
    if(!checkToken){
      return next(new Error("not authorized"))
    }
    createTokenCheck.checkToken(checkToken, (err:Error|any, decoded:any) => {
      if (err) {
        err = new Error("not authorized")
        err.data = "Token invalid"
        return next(err);
      }
      log.info(decoded)
      socket.user = decoded; // 将用户信息附加到 socket 对象上
      next();
    });
  })

  const groupList : any  = {}

  io.of("/chat").on("connection", (socket) => {
    
    // log.info(socket)
    /* if(!token){
      return socket.disconnect(1008, "Token missing")
    } */
    log.info("a user connected");
    socket.on('join',({name,room}:{name:string,room:string})=>{
      log.info('emit join', { name, room })
      socket.join(room)
      if(groupList[room]){
        groupList[room].push({name,room,id:socket.id})
      }else{
        groupList[room] = [{name,room,id:socket.id}]
      }
      socket.emit('join',{text: `您进入了房间`})
      socket.emit('groupList',groupList)
      socket.broadcast.to(room).emit('join', { text: `${name}进入了房间` })
      socket.broadcast.emit('groupList',groupList)
    })
    
    socket.on("message", ({text,room, user}:any) => {
      log.info(`Received message`,text,room, user);
      // io.of("/chat").emit("message",{
      //   id: socket.id,
      //   user: socket.user.data.username,
      //   message: message
      // });
      socket.broadcast.to(room).emit('message', {
        text,
        user,
        self: false
      })
      socket.emit('message',{
        text,
        user,
        self:true
      })  
    })

    socket.on('disconnect', () => {
      Object.keys(groupList).forEach(key => {
          let leval = groupList[key].find((item:any) => item.id === socket.id)
          if (leval) {
              socket.broadcast.to(leval.room).emit('message', { user: '管理员', text: `${leval.name}离开了房间` })
          }
          groupList[key] = groupList[key].filter((item:any) => item.id !== socket.id)
      })
      socket.broadcast.emit('groupList', groupList)
    })

  })


  // io.sockets.on("connection", (socket, req) => {
  //   log.info("a user connected");
  //   log.info(socket.rooms);
  //   io.on('disconnect', (socket) => {
  //     log.info('a user disconnected');
  //   })
  // })



  // io.engine.on("connection", (socket, req) => {
  //   log.info("a user connected");
  //   log.info(socket.rooms);
  //   io.engine.on('disconnect', (socket) => {
  //     log.info('a user disconnected');
  //   })
  // });


  httpServer.listen(3001, () => {
      log.info("websocketServer is running on port 3001");
      callback(null)
  });
};

export const initWebsocket3 = (app:any) => {
  app = createServer(app);

  const WS_PORT = 3001;
  const wsServer = new WebSocketServer({ port: WS_PORT });

  wsServer.on("connection", (ws:any, req:any) => {
    const token = req.url.split("?token=")[1];

    if (!token) {
      ws.close(1008, "Token missing");
      return;
    }

    createTokenCheck.checkToken(token, (err:Error, decoded:any) => {
      if (err) {
        ws.close(1008, "Token invalid");
        return;
      }

      ws.user = decoded;

      ws.on("message", (message:any) => {
        log.info(`Received message from ${ws.user.username}: ${message}`);
        ws.send(`Server received: ${message}`);
      });

      ws.on("close", () => {
        log.info(`Connection closed by ${ws.user.username}`);
      });
    });
  });

  log.info(`WebSocket server is listening on port ${WS_PORT}`);
};

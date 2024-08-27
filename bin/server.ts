#!/usr/bin/env node
/**
 * Module dependencies.
 */
// import { ms } from '~/framework'
import '../utils/globalMethods'
import * as ms from '../framework/ms'
import { AsyncResultCallback } from 'async';

ms.async.waterfall([
  (cb:AsyncResultCallback<any>)=>{
    ms.db.init_db(cb)
  },
  (cb:AsyncResultCallback<any>)=>{
    require('../app');
    cb()
  }
],(err:any)=>{
  if(err){
    ms.log.error(err)
  }
})

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      console.log(error);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

/* function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
 */
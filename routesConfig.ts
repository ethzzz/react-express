export const routes = [
    { method: 'post', url: '/system/login', module: 'modules/system', action: 'login', use_session: 0 },
    { method: 'post', url: '/system/getCaptcha', module: 'modules/system', action: 'getCaptcha', use_session: 0 },
    { method: 'post', url: '/system/verifyToken', module: 'modules/system', action: 'verifyToken', use_session: 0 },
    { method: 'post', url: '/system/register', module: 'modules/system', action: 'register', use_session: 0 },

    { method: 'get', url: '/user/key/:key', module: 'modules/users', action: 'getKey', use_session: 0 },
    { method: 'post', url: '/user/key', module: 'modules/users', action: 'setKey', use_session: 0 },
    { method: 'post', url: '/user/getUserInfo', module: 'modules/users', action: 'getUserInfo', use_session: 0 },

    { method: 'get', url: '/stream/getFile', module: 'modules/stream', action: 'getFile', use_session: 0 },
    { method: 'post', url: '/stream/getFileStream/:name', module: 'modules/stream', action: 'getFileStream', use_session: 0 },

    { method: 'get', url: '/redis/key/:key', module: 'modules/redis', action: 'getKey', use_session: 0 },

    // { method: 'get', url: '/socket.io', module: 'modules/socket', action: 'socket', use_session: 0 },
    { method: 'post', url: '/socket/create', module: 'modules/socket', action: 'create', use_session: 0 },

    // upload
    { method: 'post', url: '/upload/uploadFile', module: 'modules/upload', action: 'uploadFile', use_session: 0 },

    // rabbitmq
    { method: 'post', url: '/rabbitmq/send', module: 'modules/rabbitmq', action: 'send', use_session: 0 },
]
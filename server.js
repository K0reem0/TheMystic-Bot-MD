import express from 'express';
import {createServer} from 'http';
import path from 'path';
import {Socket} from 'socket.io';
import {toBuffer} from 'qrcode';
import fetch from 'node-fetch';

function connect(conn, PORT) {
  const app = global.app = express();
  console.log(app);
  const server = global.server = createServer(app);
  let _qr = 'El código QR es invalido, posiblemente ya se escaneo el código QR.';

  conn.ev.on('connection.update', function appQR({qr}) {
    if (qr) _qr = qr;
  });

  app.use(async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.end(await toBuffer(_qr));
  });

  server.listen(PORT, () => {
    console.log('[ ℹ️ ] La aplicación está escuchando el puerto', PORT, '(ignorar si ya escaneo el código QR)');
    if (opts['keepalive']) keepAlive();
  });
}

function pipeEmit(event, event2, prefix = '') {
  const old = event.emit;
  event.emit = function(event, ...args) {
    old.emit(event, ...args);
    event2.emit(prefix + event, ...args);
  };
  return {
    unpipeEmit() {
      event.emit = old;
    }};
}

function keepAlive() {
  const url = process.env.HEROKU_URL; // أضف هذا المتغير في Heroku (مثلاً: https://your-app-name.herokuapp.com)
  if (!url || !/^https?:\/\//.test(url)) return;

  setInterval(() => {
    fetch(url)
      .then(res => console.log('🔁 KeepAlive ping enviado a', url))
      .catch(err => console.error('❌ Fallo en KeepAlive:', err));
  }, 5 * 60 * 1000); // كل 5 دقائق
}

export default connect;

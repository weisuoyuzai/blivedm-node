const EventEmitter = require('events').EventEmitter;
const websocket = require('websocket');
const fetch = require('node-fetch');
const decode = require('./dataDecode.js');
const Packet = require('./Packet.js');
const lodash = require('lodash');
var { client: WebSocketClient } = websocket;
class BlivedmClient extends EventEmitter {
  timer = null;
  constructor(roomid = 0) {
    super();
    this.roomid = roomid || 0;
    this.wsclient = new WebSocketClient();
    this.packet = new Packet();
    this.init();
  }
  async init() {
    const res = await fetch(
      'https://api.live.bilibili.com/room/v1/Room/room_init?id=' + this.roomid
    );
    const json = await res.json();
    if (json.code == 0) {
    } else {
      this.emit('getRoomInfoError', json.message);
    }
    this.wsclient.connect('wss://broadcastlv.chat.bilibili.com:2245/sub');
    this.wsclient.on('connectFailed', function (error) {
      console.log('Connect Error: ' + error.toString());
    });
    this.wsclient.on('connect', (connection) => {
      console.log('connected');
      connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString());
      });
      connection.on('close', function () {
        clearInterval(this.timer);
        console.log('echo-protocol Connection Closed');
      });
      connection.on('message', (message) => {
        if (message.type == 'binary') {
          let data = message.binaryData;
          let str = data.toString('utf-8', 16);
          const op = data.readInt32BE(8);
          if (op == 5) {
            let res = decode(data);
            res.forEach((item) => {
              // console.log(item.info);
              // console.log(`${item.info[2][1]}:${item.info[1]}`);
              this.emit(item.cmd, item);
            });
          }
        }
      });

      connection.send(this.packet.auth(this.roomid));

      //半分鐘心跳包
      this.timer = setInterval(() => {
        connection.send(this.packet.heartBeat());
      }, 30000);
    });
  }
}

module.exports = BlivedmClient;

export default BlivedmClient;

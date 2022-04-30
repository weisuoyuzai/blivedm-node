const EventEmitter = require('events').EventEmitter;
// const websocket = require('websocket');
const fetch = require('node-fetch');
const decode = require('./dataDecode.js');
const Packet = require('./Packet.js');
const lodash = require('lodash');
// var { client: WebSocketClient } = websocket;
const WebSocketClient = require('ws');
class BlivedmClient extends EventEmitter {
  timer = null;
  constructor(roomid = 0) {
    super();
    this.roomid = roomid || 0;
    this.wsclient = null;
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
    this.wsclient = new WebSocketClient(
      'wss://broadcastlv.chat.bilibili.com:2245/sub'
    );
    this.wsclient.on('open', () => {
      console.log('connected');

      this.wsclient.send(this.packet.auth(this.roomid));

      //半分鐘心跳包
      this.timer = setInterval(() => {
        this.wsclient.send(this.packet.heartBeat());
      }, 30000);
    });

    this.wsclient.on('message', (message) => {
      this.emit('message', message);
      let data = message;
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
    });
  }
  stop() {
    this.wsclient.terminate();
  }
}

module.exports = BlivedmClient;

class Packet {
  makePacket(data, operation) {
    const body = JSON.stringify(data);

    const header = Buffer.alloc(16);
    header.writeInt32BE(String(body.length + 16), 0);
    header.writeInt16BE(String(16), 4);
    header.writeInt16BE(String(1), 6);
    header.writeInt32BE(String(operation), 8);
    header.writeInt16BE(String(1), 12);
    return header + body;
    //   return Buffer.concat([header, Buffer.from(body)]);
  }

  heartBeat() {
    return this.makePacket({}, 2);
  }

  auth(roomid) {
    const json = {
      uid: 0,
      roomid: roomid || 22449,
      protover: 2,
      platform: 'web',
      clientver: '1.14.3',
      type: 2
    };
    return this.makePacket(json, 7);
  }
}

module.exports = Packet;

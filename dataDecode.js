const pako = require('pako');

function decode(data) {
  const textDecoder = new TextDecoder('utf-8');
  const ver = data.readInt16BE(6);
  const body = data.slice(16);
  let str = '{}';
  if (ver == 2) {
    str = textDecoder.decode(pako.inflate(body));
  } else {
    str = body.toString('utf-8');
  }
  // return JSON.parse(json);
  const group = str.split(/[\x00-\x1f]+/);
  const res = [];
  group.forEach((item) => {
    try {
      res.push(JSON.parse(item));
    } catch (e) {}
  });
  return res;
}

module.exports = decode;

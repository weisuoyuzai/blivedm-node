const BlivedmClient = require('./BlivedmClient.js');

const blivedmClient = new BlivedmClient(5050);
global.blivedmClient = blivedmClient;
blivedmClient.on('getRoomInfoError', (err) => {
  console.log(err);
});

blivedmClient.on('DANMU_MSG', (data) => {
  console.log(`${data.info[2][1]}:${data.info[1]}`);
});

# blivedm-node
```javascript
const BlivedmClient = require('blivedm-node/BlivedmClient');

const client = new BlivedmClient(房間號);
client.on('DANMU_MSG', (msg) => {
  console.log(`${msg.info[2][1]}:${msg.info[1]}`);
});

```

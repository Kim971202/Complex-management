/**
 * 작성자: 사원 김동현
 * 작성일: 2022년09월06일
 * 수정일: 2022년09월07일
 * 파일설명: Redis의 key & value 속성을 이용하여 사용자의 servicekey를 인증하는 스크립트 이다.
 */
const redis = require("redis");
const redisInfo = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
};

const client = redis.createClient(redisInfo);
client.on("error", (err) => {
  console.error(err);
});

client.on("ready", () => {
  console.log("redis is ready to start");
});
let result = "";

async function checkServiceKey(serviceKey) {
  await client.get(serviceKey, (err, value) => {
    result = value;
    console.log("value: " + value);
    if (!value) {
      console.log("Invalid ServiceKey has given");
    } else {
      console.log("Valid ServiceKey has given");
    }
    // checkServiceKeyResult();
  });
}

function checkServiceKeyResult() {
  console.log("result: " + result);
  if (!result) {
    return false;
  } else {
    return true;
  }
}

//TODO: Set ServiceKey

module.exports = {
  checkServiceKey,
  checkServiceKeyResult,
};

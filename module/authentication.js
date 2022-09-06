/**
 * 작성자: 사원 김동현
 * 작성일: 2022년09월06일
 * 수정일: 2022년09월06일
 * 파일설명: Redis의 key & value 속성을 이용하여 사용자의 servicekey를 인증하는 스크립트 이다.
 */

const redis = require("redis");
const redisInfo = {
  host: "127.0.0.1",
  port: 6379,
  db: 0,
};

const client = redis.createClient(redisInfo);
client.on("error", (err) => {
  console.error(err);
});

client.on("ready", () => {
  console.log("redis is ready");
});

function checkServiceKey(serviceKey) {
  let isKeyValid = false;

  client.get(serviceKey, (error, result) => {
    console.log(result);
    serviceKey = result;
  });
  if (result == "") {
    throw new Error("Invalid ServiceKey has accessed");
  }
}

checkServiceKey("wrongServiceKey");

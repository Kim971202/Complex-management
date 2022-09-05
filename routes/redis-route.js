var express = require("express");
var router = express.Router();

let value = "";
const redis = require("redis");
const redisInfo = {
  host: "127.0.0.1",
  port: 6379,
  db: 0,
};

const redisScan = require("node-redis-scan");
const client = redis.createClient(redisInfo);
const scanner = new redisScan(client);
client.on("error", (err) => {
  console.error(err);
});

client.on("ready", () => {
  console.log("redis is ready");
});

scanner.scan("*", (err, matchingKeys) => {
  if (err) throw err;
  console.log(matchingKeys);
});

let a = ["one_key", "myKey", "two_key", "three_key"];
router.get("/", (req, res, next) => {
  try {
    for (i = 0; i < a.length; ++i) {
      client.get(a[i], (err, result) => {
        console.log("result: " + result); // v_two
        value = result;
      });
    }

    let jsonResult = {
      value,
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

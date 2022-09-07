var express = require("express");
var router = express.Router();
let { checkServiceKey } = require("../module/authentication");

// router.get("/", (req, res, next) => {
//   serviceKey = "d";
//   checkServiceKey(serviceKey);
//   console.log("From redis route");
//   return res.json({ resultCode: "01", resultMsg: "에러" });
// });

module.exports = router;

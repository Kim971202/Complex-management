console.log("app.js called");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const noticeRoute = require("./routes/notice-route");
const mngFeeRoute = require("./routes/mngfee-route");
const deliveryRoute = require("./routes/delivery-route");
const parkingRoute = require("./routes/parking-route");
const elivatorRoute = require("./routes/elivator-route");
const locationRoute = require("./routes/location-route");
const evchargingRoute = require("./routes/evcharging-route");
const cctvRoute = require("./routes/cctv-route");
const complaintRoute = require("./routes/complaint-route");
const voteRoute = require("./routes/vote-route");
const keyContactRoute = require("./routes/keycontact-route");
const visitorRoute = require("./routes/visitor-route");
const logRoute = require("./routes/log-route");
const contractRoute = require("./routes/contract-route");
const homeInfoRoute = require("./routes/homeInfo-route");
const emsRoute = require("./routes/ems-route");
const etcRoute = require("./routes/etc-route");
const redisRouter = require("./routes/redis-route");

const app = express();
const port = 3000; // 서버 포트번호

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/notice", noticeRoute);
app.use("/mngfee", mngFeeRoute);
app.use("/delivery", deliveryRoute);
app.use("/parking", parkingRoute);
app.use("/elivator", elivatorRoute);
app.use("/location", locationRoute);
app.use("/evcharging", evchargingRoute);
app.use("/cctv", cctvRoute);
app.use("/complaint", complaintRoute);
app.use("/vote", voteRoute);
app.use("/keycontact", keyContactRoute);
app.use("/visitor", visitorRoute);
app.use("/log", logRoute);
app.use("/contract", contractRoute);
app.use("/homeInfo", homeInfoRoute);
app.use("/ems", emsRoute);
app.use("/etc", etcRoute);
app.use("/redis", redisRouter);

app.use(
  "/public/images/parkingImages",
  express.static("public/images/parkingImages")
);

app.listen(port, () => {
  console.log(`서버가 실행됩니다. http://localhost:${port}`);
});

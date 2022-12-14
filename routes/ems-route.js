var express = require("express");
var router = express.Router();
const pool = require("../database/pool");
let {
  viewPeriodDate,
  addDays,
  isDate,
  strDateFormat,
  getDateOfMonthByFlag,
} = require("../module/date-function");

//목표값 설정
router.post("/postEnergyUseTargetSet", async (req, res, next) => {
  console.log(JSON.stringify(req.body));
  // console.log(req.body);

  let {
    serviceKey = "", //   서비스 인증키
    dongCode = "", //     동코드
    hoCode = "", //       호코드
    energyType = "", //   전기(elec)/수도(water)/가스(gas)/온수(hotWater)/난방(heating)
    targetUsage = "", //  목표사용량
  } = req.body;

  console.log(serviceKey, dongCode, hoCode, energyType, targetUsage);
  //http://localhost:3000/ems/postEnergyUseTargetSet  {"serviceKey":"11111111","dongCode":"101","hoCode":"101","energyType":"elec", "targetUsage": "400"}

  let resultCode = "00";
  if (serviceKey === "") resultCode = "10"; // INVALID_REQUEST_PARAMETER_ERROR

  if (dongCode === "") resultCode = "10";

  if (hoCode === "") resultCode = "10";

  if (energyType === "") resultCode = "10";

  if (targetUsage === "") targetUsage = "10";

  console.log("resulCode=> " + resultCode);

  if (resultCode === "00") {
    try {
      let sql =
        "delete from t_energy_target where energy_type = ? and dong_code = ? and ho_code = ? ";
      console.log("sql=>" + sql);
      let data = await pool.query(sql, [energyType, dongCode, hoCode]);
      console.log("data[0]=>" + data[0]);

      sql =
        "insert into t_energy_target(energy_type, dong_code, ho_code, target_value) values (?, ?, ?, ?) ";
      console.log("sql_i=>" + sql);
      data = await pool.query(sql, [energyType, dongCode, hoCode, targetUsage]);
      console.log("data[0]=>" + data[0]);

      let jsonResult = {
        resultCode,
        resultMsg: "NORMAL_SERVICE",
      };

      return res.json(jsonResult);
    } catch (err) {
      console.log("test===============" + err);
      return res.status(500).json(err);
    }
  }
});

//현재 월 에너지사용량 조회
router.get("/getNowEnergyUse", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
  } = req.query;

  console.log(serviceKey, dongCode, hoCode);
  //http://localhost:3000/ems/getNowEnergyUse?serviceKey=22222&dongCode=101&hoCode=101

  let resultCode = "00";
  if (serviceKey === "") resultCode = "10"; // INVALID_REQUEST_PARAMETER_ERROR

  if (dongCode === "") resultCode = "10";

  if (hoCode === "") resultCode = "10";

  console.log("resulCode=> " + resultCode);
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }

  try {
    const sql = "CALL spNowEnergyUse (?, ?) ";

    console.log("sql=>" + sql);
    const data = await pool.query(sql, [dongCode, hoCode]);
    let resultList = data[0];
    console.log(resultList[1]);
    let nowMonthUsage = "";
    console.log("resultList.length: " + resultList.length);
    if (resultList > 0) {
      nowMonthUsage = resultList[0].items.nowMonthUsage;
    }
    // Formatter 사용
    console.log("nowMonthUsage: " + resultList[0][0].nowMonthUsage);
    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      data: {
        dongCode,
        hoCode,
        items: resultList[1],
      },
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//월간 에너지사용량 조회
router.get("/getMonthEnergyUse", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
    energyType = "0000", //      에너지종류
    reqYear = "0000", //         요청년도
    reqMonth = "0000", //        요청월
  } = req.query;

  console.log(serviceKey, dongCode, hoCode, energyType, reqYear, reqMonth);
  //http://localhost:3000/ems/getMonthEnergyUse?serviceKey=22222&dongCode=101&hoCode=101&energyType=elec&reqYear=2022&reqMonth=07

  let resultCode = "00";
  if (serviceKey === "") resultCode = "10"; // INVALID_REQUEST_PARAMETER_ERROR

  if (dongCode === "") resultCode = "10";

  if (hoCode === "") resultCode = "10";

  if (energyType === "") resultCode = "10";

  // energyType이 6개 항목 이외에 것이 들어올경우 예외 처리
  if (
    energyType !== "gas" &&
    energyType !== "water" &&
    energyType !== "elec" &&
    energyType !== "hotWater" &&
    energyType !== "heating" &&
    energyType !== "aircon"
  ) {
    resultCode = "10";
  }
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }
  try {
    const sql = "call spMonthEnergyUseCall (?, ?, ?, ?, ?);";

    console.log("sql=>" + sql);

    const data = await pool.query(sql, [
      energyType,
      reqYear,
      reqMonth,
      dongCode,
      hoCode,
    ]);
    let resultList = data[0];

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      data: resultList[0][0],
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//선택월의 일별 에너지사용량 조회
router.get("/getDayEnergyUseGraph", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
    energyType = "0000", //      에너지종류
    reqYear = "0000", //         요청년도
    reqMonth = "0000", //        요청월
  } = req.query;

  console.log(serviceKey, dongCode, hoCode, energyType, reqYear, reqMonth);
  //http://localhost:3000/ems/getDayEnergyUseGraph?serviceKey=22222&dongCode=101&hoCode=101&energyType=elec&reqYear=2022&reqMonth=07

  let resultCode = "00";

  if (serviceKey === "") resultCode = "10"; // INVALID_REQUEST_PARAMETER_ERROR

  if (dongCode === "") resultCode = "10";

  if (hoCode === "") resultCode = "10";

  if (energyType === "") resultCode = "10";

  if (reqYear === "") resultCode = "10";

  if (reqMonth === "") resultCode = "10";

  // energyType이 6개 항목 이외에 것이 들어올경우 예외 처리
  if (
    energyType !== "gas" &&
    energyType !== "water" &&
    energyType !== "elec" &&
    energyType !== "hotWater" &&
    energyType !== "heating" &&
    energyType !== "aircon"
  ) {
    resultCode = "10";
  }
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }

  try {
    const sql = "CALL spDayEnergyUseByMonth (?, ?, ?, ?, ?)";

    console.log("sql=>" + sql);

    const data = await pool.query(sql, [
      energyType,
      reqYear,
      reqMonth,
      dongCode,
      hoCode,
    ]);
    let resultList = data[0];

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      data: {
        dongCode,
        hoCode,
        energyType,
        reqYear,
        reqMonth,
        items: resultList[0],
      },
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//연간 에너지사용량 조회
router.get("/getYearEnergyUse", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
    energyType = "0000", //      에너지종류
    reqYear = "0000", //         요청년도
  } = req.query;

  console.log(serviceKey, dongCode, hoCode, energyType, reqYear);
  //http://localhost:3000/ems/getYearEnergyUse?serviceKey=22222&dongCode=101&hoCode=101&energyType=elec&reqYear=2022

  let resultCode = "00";
  if (serviceKey === "") resultCode = "10"; // INVALID_REQUEST_PARAMETER_ERROR

  if (dongCode === "") resultCode = "10";

  if (hoCode === "") resultCode = "10";

  if (energyType === "") resultCode = "10";

  // energyType이 6개 항목 이외에 것이 들어올경우 예외 처리
  if (
    energyType !== "gas" &&
    energyType !== "water" &&
    energyType !== "elec" &&
    energyType !== "hotWater" &&
    energyType !== "heating" &&
    energyType !== "aircon"
  ) {
    resultCode = "10";
  }
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }

  console.log("resulCode=> " + resultCode);
  try {
    const sql = "CALL spYearEnergyUse (?, ?, ?, ?);";

    console.log("sql=>" + sql);

    const data = await pool.query(sql, [energyType, reqYear, dongCode, hoCode]);
    let resultList = data[0];
    console.log(resultList);
    console.log(resultList[0][0].reqYear);

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      data: resultList[0][0],
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//선택년도의 월별 에너지사용량 조회
router.get("/getMonthEnergyUseGraph", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
    energyType = "0000", //      에너지종류
    reqYear = "0000", //         요청년도
    reqMonth = "0000", //        요청월
  } = req.query;

  console.log(serviceKey, dongCode, hoCode, energyType, reqYear, reqMonth);
  //http://localhost:3000/ems/getMonthEnergyUseGraph?serviceKey=22222&dongCode=101&hoCode=101&energyType=elec&reqYear=2022&reqMonth=06

  let resultCode = "00";
  if (serviceKey === "") resultCode = "10"; // INVALID_REQUEST_PARAMETER_ERROR

  if (dongCode === "") resultCode = "10";

  if (hoCode === "") resultCode = "10";

  if (energyType === "") resultCode = "10";

  if (reqYear === "") resultCode = "10";

  if (reqMonth === "") resultCode = "10";

  console.log("resulCode=> " + resultCode);
  // energyType이 6개 항목 이외에 것이 들어올경우 예외 처리
  if (
    energyType !== "gas" &&
    energyType !== "water" &&
    energyType !== "elec" &&
    energyType !== "hotWater" &&
    energyType !== "heating" &&
    energyType !== "aircon"
  ) {
    resultCode = "10";
  }
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }

  try {
    const sql = "CALL spMonthEnergyUseByYear (?, ?, ?, ?)";

    console.log("sql=>" + sql);

    const data = await pool.query(sql, [energyType, reqYear, dongCode, hoCode]);
    let resultList = data[0];

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      data: {
        dongCode,
        hoCode,
        energyType,
        reqYear,
        items: resultList[0],
      },
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

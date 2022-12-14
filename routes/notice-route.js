var express = require("express");
var router = express.Router();
const pool = require("../database/pool");

//공지사항 목록조회
router.get("/getNoticeList", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    numOfRows = 10, //           페이지 당 결과수
    pageNo = 1, //               페이지 번호
    doubleDataFlag = "Y", //     2배수 데이터 사용여부
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
    notiType = "ALL", //           공지타입 : 전체데이터(ALL), 전체공지(1), 세대 개별공지(2)
  } = req.query;

  console.log(
    serviceKey,
    numOfRows,
    pageNo,
    dongCode,
    hoCode,
    doubleDataFlag,
    notiType
  );
  //http://localhost:3000/notice/getNoticeList?serviceKey=22222&numOfRows=5&pageNo=2&dongCode=101&hoCode=101&doubleDataFlag=Y&notiType=ALL

  let resultCode = "00";

  if (serviceKey === "") resultCode = "10";
  if (numOfRows === "") resultCode = "10";
  if (pageNo === "") resultCode = "10";
  if (dongCode === "") resultCode = "10";
  if (hoCode === "") resultCode = "10";
  if (notiType === "") resultCode = "10";

  console.log("resulCode=> " + resultCode);
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }

  try {
    let sRow = (pageNo - 1) * numOfRows;
    //console.log("sRow = %d", sRow);
    //ex: 2page start = (2-1) * 10

    let size = numOfRows * (doubleDataFlag === "Y" ? 2 : 1);
    //console.log("size= %d", size);

    let notiType_ = "%";
    if (notiType === "1") notiType_ = "전체";
    else if (notiType === "2") notiType_ = "개별";
    console.log("notiType_=> " + notiType_);

    const sql3 = `UPDATE t_notice a 
                  INNER JOIN t_notice_send b 
                  ON a.idx = b.idx
                  SET a.new_flag = IF (DATE_ADD(a.start_date, INTERVAL 3 DAY)  >=now(), 'Y', 'N')
                  WHERE a.idx = b.idx;`;
    const data3 = await pool.query(sql3);
    console.log("data3: " + data3);

    const tSQL =
      " and b.dong_code ='" + dongCode + "' and b.ho_code = '" + hoCode + "' ";

    const sql = `select a.idx, a.noti_type as notiType, a.noti_title as notiTitle, DATE_FORMAT(a.start_date, '%Y%m%d') as startDate, a.new_flag as newFlag
                 from t_notice a
                 inner join  t_notice_send b 
                 where  a.idx = b.idx and a.start_date <= now() and end_date >= now() and a.noti_type LIKE ?  ${tSQL}
                 limit ?, ?`;
    console.log("sql=>" + sql);

    const data = await pool.query(sql, [notiType_, Number(sRow), Number(size)]);
    let resultList = data[0];

    const sql2 = `select count(a.idx) as cnt
                 from t_notice a
                 inner join  t_notice_send b 
                 where a.idx = b.idx and a.start_date <= now() and end_date >= now() and a.noti_type LIKE ?  ${tSQL};`;
    //const sql2 = "select count(*) as cnt from t_notice where noti_type = ?";
    const data2 = await pool.query(sql2, [notiType_]);
    let resultCnt = data2[0];

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      numOfRows,
      pageNo,
      totalCount: resultCnt[0].cnt + "",
      doubleDataFlag,
      data: {
        //dataType,
        dongCode,
        hoCode,
        notiType,
        items: resultList,
      },
    };
    console.log(resultList);

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//공지사항 상세보기
router.get("/getNoticeDetail", async (req, res, next) => {
  let {
    serviceKey = "111111111", // 서비스 인증키
    //dataType = "JSON", //      요청자료 형식
    dongCode = "0000", //        동코드
    hoCode = "0000", //          호코드
    idx = 0, //                  idx
  } = req.query;

  console.log(serviceKey, dongCode, hoCode, idx);
  //http://localhost:3000/notice/getNoticeDetail?serviceKey=22222&dongCode=101&hoCode=101&idx=1376231

  let resultCode = "00";

  if (serviceKey === "") resultCode = "10";
  if (dongCode === "") resultCode = "10";
  if (hoCode === "") resultCode = "10";
  if (idx === "") resultCode = "10";

  try {
    const idxCheckSQL = `SELECT * FROM t_notice WHERE idx = ?`;
    const idxCheckData = await pool.query(idxCheckSQL, [idx]);
    console.log(idxCheckData[0][0].idx);
  } catch (error) {
    resultCode = "10";
    console.log(error);
  }

  console.log("resulCode=> " + resultCode);
  if (resultCode !== "00") {
    return res.json({ resultCode: "01", resultMsg: "에러" });
  }

  try {
    const tSQL =
      " and b.dong_code ='" + dongCode + "' and b.ho_code = '" + hoCode + "' ";

    const sql = `select a.idx, a.noti_type as notiType, a.noti_owner as notiOwner,a.file_path as filePath, a.file_name as fileName, a.noti_title as notiTitle, DATE_FORMAT(a.start_date, '%Y%m%d') as startDate, noti_content as notiContent 
                 from t_notice a
                 inner join  t_notice_send b 
                 where a.idx = ?  ${tSQL}`;
    //const sql = "select idx, noti_type as notiType, noti_title as notiTitle, start_date as startDate, noti_content as notiContent from t_notice where idx = ?";
    const data = await pool.query(sql, [idx]);

    let resultList = "";
    let notiTitle = "";
    let startDate = "";
    let notiContent = "";
    let notiOwner = "";
    let notiType = "";
    let filePath = "";
    let fileName = "";

    resultList = data[0];
    if (resultList.length > 0) {
      notiTitle = resultList[0].notiTitle;
      startDate = resultList[0].startDate;
      notiContent = resultList[0].notiContent;
      notiOwner = resultList[0].notiOwner;
      notiType = resultList[0].notiType;
      filePath = resultList[0].filePath;
      fileName = resultList[0].fileName;
    }
    console.log("notiOwner: " + notiOwner);
    console.log("notiType: " + notiType);
    //console.log(resultList[0].notiTitle);

    let jsonResult = {
      resultCode: "00",
      resultMsg: "NORMAL_SERVICE",
      data: {
        idx,
        notiType,
        notiTitle,
        startDate,
        notiOwner,
        notiContent,
        fileName,
        filePath,
      },
    };

    return res.json(jsonResult);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

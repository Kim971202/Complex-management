<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>인덱스</th>
          <th>공지사항-타입</th>
          <th>공지사항-제목</th>
          <th>공지사항-시작일</th>
          <th>공지시항-신규여부</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="i" v-for="(notice, i) in clearedList">
          <td>{{ noticeList.data.items[i].idx }}</td>
          <td>{{ noticeList.data.items[i].notiType }}</td>
          <td>{{ noticeList.data.items[i].notiTitle }}</td>
          <td>{{ noticeList.data.items[i].startDate }}</td>
          <td>{{ noticeList.data.items[i].newFlag }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      clearedList: [],
    };
  },
  created() {
    this.getNoticeList();
  },
  methods: {
    async getNoticeList() {
      this.noticeList = await this.api(
        "notice/getNoticeList?serviceKey=22222&numOfRows=5&pageNo=2&dongCode=101&hoCode=101&doubleDataFlag=Y&notiType=ALL",
        "get"
      );
      console.log(JSON.parse(JSON.stringify(this.noticeList.data.items)));
      //console.log(this.noticeList);
      this.clearedList = JSON.parse(JSON.stringify(this.noticeList.data.items));
    },
    async api(url, method, data) {
      return (
        await axios({
          method: method,
          url: url,
          datta: data,
        }).catch((e) => {
          console.log(e);
        })
      ).data;
    },
  },
};
</script>
<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>

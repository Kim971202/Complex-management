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
                <tr :key="i" v-for="(notice, i) in noticeList">
                    <td>{{noticeList.data.items[0].idx}}</td>
                    <td>{{noticeList.data.items[0].notiType}}</td>
                    <td>{{noticeList.data.items[0].notiTitle}}</td>
                    <td>{{noticeList.data.items[0].startDate}}</td>
                    <td>{{noticeList.data.items[0].newFlag}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            noticeList:[]
        }
    },
    created() {
        this.getNoticeList();
    },
    methods: {
        async getNoticeList(){
            this.noticeList = await this.api('notice/getNoticeList?serviceKey=22222&numOfRows=5&pageNo=2&dongCode=101&hoCode=101&doubleDataFlag=Y&notiType=ALL','get');
            console.log(this.noticeList);
        },
        async api(url, method, data) {
            return (await axios({
                method: method,
                url: url,
                datta: data
            }).catch(e => {
                console.log(e)
            })).data;
        }
    }
}
</script>
<style scoped>
    table{
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }
    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }
</style>

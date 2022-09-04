<template>
    <h1 class="page-title">{{title}}</h1>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: 'This is page title'
        }
    }
}
</script>
<style scoped>
.page-title {
    padding-left: 7px;
    border-left: 3px solid rgb(22, 154, 171);
    text-align: left;
}
</style>
<template>
<div>
    <button type="button" @click="callChildFunction">PARENT CLICJK</button>
    <ChildComponent ref="child"/>
</div>
</template>
<script>
import PageTitle from '../components/PageTitle.vue';
import ChildComponent from './ChildComponent.vue';
export default {
    name: '',
    components: { PageTitle, ChildComponent },
    data() {
        return {
            title: 'From parent Component',
            likes: 23,
            commentIds: [1,2,3,4,5,6,7,8,9],
            authors: {name: 'KIM', company: 'DAESUNG'}
        }
    },
    setup() {},
    created() {},
    mounted() {},
    unmounted() {},
    methods: {
        callChildFunction() {
            this.$refs.child.childFunction();
        }
    }
}
</script>
<style>

</style>

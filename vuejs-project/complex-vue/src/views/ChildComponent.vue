<template>
    <div>
        <button type="button" @click="childFunction"  ref="childBtn">CLICK</button>
    </div>
    </template>
    <script>
import { booleanLiteral } from '@babel/types';
    export default {
        name: '',
        props: {
            likes:{
                type: Number,
                default: 0
            },
            isOk: {
                type: Boolean,
                default: false
            },
            commentIds: {
                type: Array
            },
            authors: {
                type: Object
            }
        },
        data() {
            return {
                sampleData: ''
            }
        },
        setup() {},
        created() {},
        mounted() {
            console.log(this.commentIds);
        },
        unmounted() {},
        methods: {
            childFunction(){
                alert('Event FROM PARENT COMPONRNT')
            }
        }
    }
    </script>
    <style>

    </style>

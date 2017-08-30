<template>
    <layout>
        <layout-item region="west" width="100">111</layout-item>
        <layout-item region="center" ref="center"  >
            <transition>
            <SmartTable v-if="showTable"  border :columns="columns1" :data="data1" :width="tableWidth" :height="tableHeight" ></SmartTable>
            </transition>
        </layout-item>
    </layout>
</template>
<script>
    import Layout from "../src/components/layout-test/layout";
    import LayoutItem from "../src/components/layout-test/layout-item";
    import SmartTable from "../src/components/smart-table/table";
    import { getStyle } from '../src/utils/assist';
    export default {
        components: {
            SmartTable,
            LayoutItem,
            Layout
        },
        mounted(){
            this.$nextTick(()=>{
                setTimeout(()=>{
                    this.tableWidth=parseInt(getStyle(this.$refs["center"].$el,'width'));
                    this.tableHeight=parseInt(getStyle(this.$refs["center"].$el,'height'));
                    this.$nextTick(()=>{
                        this.showTable=true;
                    });
                },1);

            })

        },
        data () {
            return {
                tableWidth:'',tableHeight:'',showTable:false,
                columns1: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    }
                ],
                data1: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
            }
        }
    }
</script>

<template>
    <list  ref="ccc" :url="url" :columns="columns" :data="data" :searchFields="searchFields"  :buttons="buttons" @on-selection-change="onSelectChange" :height="height">

    </list>
</template>
<script>

    import list from "../../src/components/smart-table";
    import { getStyle } from '../../src/utils/assist';

    export default {
        components: {
            list
            },
        methods:{
            onSelectChange:function(datas){
                if(datas.length==1){
                    this.buttons[1].disabled=false;
                    this.buttons[2].disabled=false;
                }else if(datas.length>1){
                    this.buttons[1].disabled=true;
                    this.buttons[2].disabled=false;
                }else{
                    this.buttons[1].disabled=true;
                    this.buttons[2].disabled=true;
                }
            },
            edit:function () {
                alert(1);
            }
        },
        data: function () {
            var vm=this;
            return {
                height:'',
                data:[],
                url: '/demo/page',
                searchFields:[
                    {field:'module',op:"like_",title:'业务模块'},
                    {field:'operator',op:"like_",title:'操作'}
                ],
                buttons:[
                    {
                        type: 'info', icon: 'plus', text: '创建',disabled:false, click: function (button,self) {
//                            button.text= button.text+'1';
                            console.log(this);
                        }
                    },
                    {type: 'primary', icon: 'ios-compose-outline',disabled:true, text: '编辑', click: this.edit,
                      use:function(checked){
                        return checked.length==1;
                      }
                    },
                    {type: 'error', icon: 'close', text: '删除',disabled:true,click: 'cancel', use:function(checked){
                        return checked.length>0;
                    }}
                ],
                columns: [
                    {key: 'module', width: 100, align: 'left',  title: '业务模块'},
                    {key: 'operator', width: 100, align: 'left',  title: '操作'},
                    {key: 'operator_url', width1: 200, align: 'left', title: '请求URL'},
                    {key: 'operator_method', width: 100, align: 'left',  title: '操作方法'},
                    {key: 'operator_user_name', width: 100, align: 'left',  title: '操作人'},
                    {key: 'operator_time', width: 150, align: 'center',  title: '操作时间'},
                    {key: 'operator_ip', width: 100, align: 'left',title: '操作IP'}
                ]
            };
        },
        mounted(){
            this.height=parseInt(getStyle(this.$el.parentElement, 'height'));
        }
    };
</script>

<template>
  <smart-table v-cloak ref="table"  :url="api.page" :data="data" :buttons="buttons" :height="height"   :columns="columns"   :search-fields="searchFields">
  </smart-table>
</template>
<script>

  import TableList from './table_list';

  export default {
      mixins:[TableList],
      created:function(){
          this.buttons=this.getButtons(['del']);

      },
      data:function(){
          return {
              api:{
                  page:'/sys/log/page',
                  del:'/sys/log/del'
              },
              height:300,
              data:[],
              searchFields:[
                  {field:'module',op:'like_',title:'业务模块'},
                  {field:'operator',op:'like_',title:'操作'}
              ],
              buttons:[],
              columns: [
                  {key:'module',width:100,align:'left',halign:'center',title:'业务模块'},
                  {key:'operator',width:100,align:'center',halign:'center',title:'操作'},
                  {key:'operator_url',width1:200,align:'left',halign:'center',title:'请求URL'},
                  {key:'operator_method',width:100,align:'left',halign:'center',title:'操作方法'},
                  {key:'operator_user_name',width:100,align:'left',halign:'center',title:'操作人'},
                  {key:'operator_time',width:140,align:'center',halign:'center',title:'操作时间'},
                  {key:'operator_ip',width:100,align:'left',halign:'center',title:'操作IP'}
              ]
          };
      }
  };
</script>
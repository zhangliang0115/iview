<template>
  <dev v-cloak>
        <smart-table   ref="table" :url="api.page"  :data="data" :buttons="buttons" :height="height"    :columns="columns"   :search-fields="searchFields" @on-load-success="loadSuccess">
        </smart-table>
        <Modal v-model="editForm" :title="'模块管理-'+op.text" @on-ok="save" :loading="loading" :width="654">
          <i-form    ref="entity" :model="entity" :rules="rules"  :label-width="80" class="smart-page-edit-column-2">
            <Row>
              <i-col span="12">
                <Form-item label="模块编号" prop="module_no">
                  <Input-number :min="1000" :max="9999"   v-model="entity.module_no"></Input-number>
                </Form-item>
              </i-col>
              <i-col span="12">
                <Form-item label="模块名称" prop="name">
                  <i-input type="text" v-model="entity.name"></i-input>
                </Form-item>
              </i-col>
            </Row>
            <Row>
              <Form-item label="模块URL" prop="url">
                <i-input type="text" v-model="entity.url"></i-input>
              </Form-item>
            </Row>
            <Row>
              <Form-item label="备注" prop="remark">
                <i-input type="textarea"  v-model="entity.remark"></i-input>
              </Form-item>
            </Row>
          </i-form>
        </Modal>
  </dev>

</template>
<script>

  import TableList from './table_list';
  import Layout from "../../src/components/layout-test/layout";
  import LayoutItem from "../../src/components/layout-test/layout-item";

  export default {
      components: {
          LayoutItem,
          Layout
      },
      mixins:[TableList],
      created:function(){
          this.buttons=this.getButtons();
      },
      methods:{
          loadSuccess:function(){
              if(this.data.length>0){
                  this.entityDefault.module_no=Number(this.data[0].module_no)+1;
              }
          },
          filterEntity(entity){
             var fields=["id",'name','module_no','url','remark'];
             var data={};
             for(var i in fields){
                var field=fields[i];
                if(entity.hasOwnProperty(field)){
                    data[field]=entity[field]==null?'':entity[field];
                }
             }
             return data;
          }
      },
      data:function(){
          return {
              api:{
                  page:'/sys/module/page',
                  del:'/sys/module/del',
                  save:'/sys/module/save'
              },
              editForm:false,
              entityDefault:{
                  module_no:1000
              },
              data: [],
              searchFields:[
                  {field:'module_no',op:"like_",title:'模块编号'},
                  {field:'name',op:"like_",title:'模块名称'}
              ],
              rules:{
                  module_no: [
                      { required: true, type: 'number',message: '请填模块编号', trigger: 'blur' },
                      { type: 'number',min:1000, max: 9999, message: '模块编号不能大于9999不能小于1000', trigger: 'blur' }
                  ],
                  name: [
                      { required: true, message: '请填模块名称', trigger: 'blur' },
                      { type: 'string', max: 8, message: '模块名称长度不能大于8', trigger: 'blur' }
                  ]
              },
              buttons:[],
              columns: [
                  {
                      title: '模块编号', width: 100,align:'center',
                      key: 'module_no', fastSearch: true
                  },
                  {
                      title: '模块名称', width: 100,
                      key: 'name', fastSearch: true
                  },
                  {
                      title: '模块URL', width: 200,
                      key: 'url', fastSearch: true
                  },
                  {
                      title: '备注',fastSearch: true,
                      key: 'remark'
                  },
                  {
                      title: '操作', key: 'action', width: 150, align: 'center', render: (h, params) => {
                      return h('div', this.getActions(h, params));
                  }
                  }
              ]
          };
      }
  };
</script>
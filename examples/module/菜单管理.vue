<template>
    <Layout>
      <layout-item region="west" width="300" style="padding-left: 80px"  @contextmenu="handleRight">
        <Tree ref="tree"
              :remoting="remoting"
              textField="name"
              :data="treeData"
              :showRight="true"
              @on-select="onSelect"
              @on-add-child="onAddChild"
              @on-add-root="onAddRoot"
              @on-del-node="onDelNode"
              ></Tree>
      </layout-item>
      <layout-item region="center" >
        <i-form   ref="entity" :model="entity" :rules="rules"  :label-width="80" class="smart-page-edit-column-2">
          <Row>
            <i-col span="12">
              <Form-item label="父级菜单" >
                <i-input type="text" v-model="show.parentName" disabled ></i-input>
              </Form-item>
            </i-col>
            <i-col span="12">
              <Form-item label="菜单名称" prop="name">
                <i-input type="text" v-model="entity.name"></i-input>
              </Form-item>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <Form-item label="是否启用" prop="is_use">
                <Radio-group v-model="entity.is_use" >
                  <Radio label="1">
                    <span>是</span>
                  </Radio>
                  <Radio label="0">
                    <span>否</span>
                  </Radio>
                </Radio-group>
              </Form-item>
            </i-col>
            <i-col span="12">
              <Form-item label="排序编号" prop="sort">
                <Input-number  :min="1" v-model="entity.sort"></Input-number>
              </Form-item>
            </i-col>
          </Row>
          <Row>
            <i-col span="12">
              <Form-item label="模块编号" >
                <i-input type="text" v-model="entity.module_no" disabled ></i-input>
              </Form-item>
            </i-col>
              <i-col span="12">
                <Button type="ghost" style="margin-left: 5px;" @click="showModule=true">选择</Button>
            </i-col>
          </Row>
          <Form-item label="参数" prop="param">
              <i-input type="text" v-model="entity.param"></i-input>
          </Form-item>
          <Form-item label="备注">
            <i-input type="textarea" v-model="entity.remark"></i-input>
          </Form-item>
          <Form-item>
            <i-button type="primary" :loading="loading" @click="save">提交</i-button>
          </Form-item>
          </i-form>
        <Modal v-model="showModule" title="模块选择"  :width="654" >
          <smart-table :rowNumber="false" :checkbox="false"  ref="table" :url="api.module.page"  :data="data" :buttons="buttons" height="300"    :columns="columns"   :search-fields="searchFields" >
          </smart-table>
        </Modal>
      </layout-item>
    </Layout>
</template>
<script>
  export default {
      created:function(){
          this.load();
      },
      methods:{
          load(){
              var vm=this;
              vm.remoting=true;
              this.ajax({
                  url:this.api.menus,
                  success:function(data){
                      for(let i in data){
                          data[i].expand=true;
                          if(!!this.cur && data[i].id==this.cur){
                              data[i].selected=true;
                          }
                      }
                     vm.remoting=false;
                      vm.treeData=data;
                  }
              });
          },
          onAddChild(data){
              this.initForm();
              this.cur='';
              this.show.parentName=data.name;
              this.entity.pid=data.id;
          },
          onAddRoot(){
              this.cur='';
              this.initForm();
          },
          onDelNode(data){
              var vm=this;
              this.ajax({
                  url: this.api.del,
                  data: this.$.param({ids:[data.id]},true),
                  success:function(rs){
                      if(rs.isOk){
                          vm.$Notice.success({
                              title: '提示',
                              desc: rs.msg||'删除成功'
                          });
                          vm.load();
                      }
                  }
              });
          },
          save:function () {
              this.$refs['entity'].validate((valid) => {
                  if (valid) {
                      this.loading=true;
                      var vm=this;
                      this.ajax({
                          method: 'post',//方法
                          url: this.api.save,//地址
                          data: this.toParam({entity:this.entity}),
                          success:function (rs) {
                              vm.loading=false;
                              if(rs.isOk){
                                  vm.$Modal.remove();
                                  vm.$Notice.success({
                                      title: '提示',
                                      desc: rs.msg||'操作成功'
                                  });
                                  vm.load();
                               //   vm.initForm();
                              }else{
                                  vm.$Notice.error({
                                      title: '错误',
                                      desc:rs.msg||''
                                  });
                              }
                          },
                          error:function () {
                              this.loading=false;
                          }
                      });
                  } else {
                      this.loading=false;
                      this.$Notice.error({
                          title: '错误',
                          desc:'表单验证失败!'
                      });
                  }
              });
          },
          initForm(){
              this.$refs['entity'].resetFields();
              this.show.parentName='顶级菜单';
              this.entity={
                  id:'',
                  name:'',
                  is_use:1,
                  sort:1,
                  param:'',
                  remark:'',
                  module_no:''
              };
          },
          onSelect:function(dom){
             this.initForm();
              var data=dom.data;
              this.cur=data.id;
              this.entity={
                  id:data.id,
                  name:data.name,
                  is_use:data.is_use,
                  sort:data.sort,
                  param:data.param||'',
                  remark:data.remark||'',
                  module_no:data.module_no||''
              };
              if(dom.$parent.$options.name=='TreeNode'){
                  this.show.parentName=dom.$parent.data.name;
              }else{
                  this.show.parentName='顶级菜单';
              }

              this.showEdit=true;
          }
      },
      data:function(){
          return {
              cur:'',
              remoting:true,
              api:{
                  menus:'/sys/menu/treeMenu',
                  save:'/sys/menu/save',
                  del:'/sys/menu/del',
                  module:{
                      page:'/sys/module/page'
                  }
              },
              data:[],
              searchFields:[
                  {field:'module_no',op:"like_",title:'模块编号'},
                  {field:'name',op:"like_",title:'模块名称'}
              ],
              showModule:true,
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
                      title: '操作', key: 'action', width: 150, align: 'center', render: (h, params) => {
                      return h('div', this.getActions(h, params));
                  }
                  }
              ],
              treeData:[],
              height:300,
              showEdit:false,
              showTree:false,
              loading:false,
              show:{parentName:'顶级菜单'},
              entity:{is_use:1,sort:1},
              rules:{
                  name: [
                      { required: true, message: '请填写菜单名称', trigger: 'blur' },
                      { type: 'string', max: 8, message: '模块名称长度不能大于8', trigger: 'blur' }
                  ],
                  sort: [
                      { required: true,type: 'number', message: '请填写排序编号', trigger: 'blur' },
                      { type: 'number',min:1, max: 9999, message: '排序编号不能大于9999不能小于1', trigger: 'blur' }
                  ]
              }
          };
      }
  };
</script>
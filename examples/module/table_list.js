export default {
    mounted(){
        this.$nextTick(function () {
            setTimeout(()=>{
                this.height=this.$el.parentNode.clientHeight;
                //页面布局加载完成触发layout-resize
                this.bus.$emit('layout-resize');
            },10);
        })
    },
    created(){
    },
    data:function(){
        var vm=this;
        return {
            api:{
                page:'page',
                del:'del',
                save:'save'
            },
            tableWidth:'',tableHeight:'',
            showTable:false,
            loading:true,
            height:'',
            op:{},
            data:[],
            entity:{},
            editForm:true,
            // url:'page',
            buttons:[],
            entityDefault:{},
            toolbar:{
                add:{type:'info',icon:'plus',text:'创建',click:function (button) {
                    vm.entity=vm.$.extend({},vm.entityDefault);
                    vm.op=button;
                    vm.editForm=true;
                }},
                edit: {type:'primary',icon:'ios-compose-outline',text:'编辑',disabled:true,
                    use:function(checked){
                        return checked.length==1;
                    },
                    click:function(table,button){
                        var selection = table.getSelection();
                        if(selection.length==1){
                            vm.edit(selection[0]);
                            vm.op=button;
                        }else{
                            vm.$Notice.info({
                                title: '提示',
                                desc: '请选择一条数据'
                            });
                        }
                    }},
                del:{type:'error',icon:'close',text:'删除',disabled:true,
                    use:function(checked){
                        return checked.length>0;
                    },
                    click:function(table){
                        var checked = table.getChecked();
                        vm.del(checked);
                    }}
            }
        };
    },
    methods: {
        resetLoading:function () {
            this.hideLoading();
            var vm=this;
            setTimeout(function () {
                vm.showLoading();
            },20);
        },
        hideLoading:function () {
            this.loading=false;
        },
        showLoading:function(){
            this.loading=true;
        },
        getButtons:function (config,options) {
            var vm=this;
            var opts={};var btns=[];
            if(!config){
                config=['add','edit','del'];
            }
            if(!options){
                options={};
            }

            this.$.each(config,function(i,j){
                opts[j]=vm.toolbar[j]||{};
            });
            this.$.extend(true,opts,options);
            this.$.each(config,function(i,j){
                btns.push(opts[j]);
            });
            return btns;

        },
        getActions:function(h,params,config,options){
            var vm=this;
            var opts={};var btns=[];
            if(!config){
                config=['edit','del'];
            }
            if(!options){
                options={};
            }
            var buttons={
                edit:{
                    text:'编辑',
                    props: {
                        type: 'primary',
                        size: 'small',
                        icon:'ios-compose-outline'
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                            this.op={text:'编辑'};
                            var row=this.$.extend({},params.row);
                            delete row._index;
                            delete row._rowKey;
                            this.edit(row);
                        }
                    }
                },
                del:{
                    text:'删除',
                    props: {
                        type: 'error',
                        size: 'small',
                        icon:'close'
                    },
                    on: {
                        click: () => {
                            this.del([params.row.id]);
                        }
                    }
                },
            };
            vm.$.each(config,function(i,j){
                opts[j]=buttons[j]||{};
            });
            vm.$.extend(true,opts,options);
            vm.$.each(config,function(i,j){
                btns.push( h('Button',opts[j] , opts[j].text));
            });

            return btns;
        },
        save:function(){
            this.$refs['entity'].validate((valid) => {
                if (valid) {
                    var vm=this;
                    this.ajax({
                        method: 'post',//方法
                        url: this.api.save,//地址
                        data: this.toParam({entity:this.entity}),
                        success:function (rs) {
                            if(rs.isOk){
                                vm.$Modal.remove();
                                vm.$Notice.success({
                                    title: '提示',
                                    desc: rs.msg||vm.op.text+'成功'
                                });
                                vm.$refs['table'].load();
                                vm.cancel();
                            }else{
                                vm.resetLoading();
                                vm.$Notice.error({
                                    title: '错误',
                                    desc:rs.msg||''
                                });
                            }
                        }
                    });
                } else {
                    this.resetLoading();
                    this.$Notice.error({
                        title: '错误',
                        desc:'表单验证失败!'
                    });
                }
            });
        },
        filterEntity(entity){
            return entity;
        },
        edit:function (selection) {
            this.$refs['entity'].resetFields();
            this.entity=this.filterEntity(selection);
            this.editForm=true;
        },
        cancel:function () {
            this.editForm=false;
        },
        del:function(checked){
            var vm=this;
            if(checked.length==0){
                vm.$Notice.info({
                    title: '提示',
                    desc: '请选择要删除的数据'
                });
                return;
            }
            vm.$Modal.confirm({
                title:'确认删除',
                content:'确认删除选中的数据？',
                onOk:function(){
                    vm.$.post(vm.api.del,vm.$.param({ids:checked},true),function(rs){
                        vm.$Modal.remove();
                        if(rs.isOk){
                            vm.$Notice.success({
                                title: '提示',
                                desc: '删除成功'
                            });
                            vm.$refs['table'].load();
                        }else{
                            vm.$Notice.error({
                                title: '错误',
                                desc:rs.msg||'删除失败'
                            });
                        }
                    });
                }
            });
        },
        renderIs:function(h,params){
            var value=params.row[params.column.key];
            if(value==1){
                return h('span','是');
            }else{
                return h('span',{
                    style:{
                        color:'red'
                    }
                },'否');
            }

        },
        param(){
            return this.toParam;
        }
    }
};

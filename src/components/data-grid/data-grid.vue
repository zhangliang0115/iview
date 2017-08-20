<template>
    <list   :class="wrapClasses" :size="size" ref="dataGrid" :height="height" :url="url" :border="border" :columns="columns"
             :pagination="pagination" :queryParams="queryParams"
             @on-selection-change="onSelectionChange"
             @on-load-success="onLoadSuccess"
    >
        <div slot="header" v-if="(!!searchFields && searchFields.length>0) || (buttons && buttons.length>0)">
            <i-form class="search-form" inline>
                <Form-item>
                    <i-button v-for="(button, index) in buttons" :key="button.textta" :icon="button.icon" :type="button.type" :disabled="!!button.disabled" @click="buttonEvent(button,$event)">{{button.text}}</i-button>
                </Form-item>
                <Form-item>
                    <i-input v-model="dataValue" @on-enter="handleSubmit('table')" style="width:250px;">
                        <Select v-model="dataKey" slot="prepend" style="width: 80px">
                            <Option v-for="field in searchFields" :key="field.key" :value="field.key">{{field.title}}</Option>
                        </Select>
                        <Button slot="append" icon="ios-search" @click="handleSubmit('table')"></Button>
                    </i-input>
                </Form-item>
            </i-form>
        </div>
    </list>
</template>
<script>
    import list from '../table';
    import ICol from '../grid/col';
    import { getParameterNames } from '../../utils/assist';
    const prefixCls = 'ivu-datagrid';

    export default {
        name: 'DataGrid',
        components: {
            list,
            ICol

        },
        props: {
            columns: {
                type: Array,
                default () {
                    return [];
                }
            }
            , url: {
                type: String
            }
            , size: {
                type: String,
                default: 'small'
            },
            border: {
                type: Boolean,
                default: true
            }
            , pagination: {
                type: Boolean,
                default: true
            }
            , queryParams: {
                type: Object,
                default(){
                    return {};
                }
            }
            , height: {
                type: [Number, String],
                default: document.documentElement.clientHeight
            }
            , buttons: {
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data :function() {
            return {
                modal1: false,
                queryParams: {},
                dataValue: '',
                dataKey: '',
                buttonSpan:12,
                searchSpan:12
            };
        },
        computed: {
            wrapClasses:function () {
                return [`${prefixCls}-wrapper`];
            },
            searchFields:function () {
                var fields=[];
                if(!!this.columns && this.columns.length>0){
                    for(var i in this.columns){
                        var column=this.columns[i];
                        if(column.fastSearch){
                            fields.push(column);
                        }
                    }
                    if(fields.length>0){
                        this.dataKey=fields[0].key;
                    }
                }
                if((!!this.buttons &&this.buttons.length>0) && fields.length>0){
                    this.buttonSpan=12;
                }else if(fields.length>0){
                    this.buttonSpan=0;
                }else{
                    this.buttonSpan=24;
                }
                return fields;
            }
        },
        methods: {
            onSelectionChange:function(selection){
                this.$emit('on-selection-change', selection);
            },
            onLoadSuccess:function(data){
                this.$emit('on-load-success', data);
            },
            rows:function(){
                return this.$refs['dataGrid'].data;
            },
            buttonEvent: function (button,e) {
                var objs={
                    button:button,
                    datagrid:this.$refs['dataGrid'],
                    event:e
                };
                var click=button.click;
                var fun={};
                if (typeof click == 'function') {
                    fun=click;
                } else if (typeof click == 'string') {
                    fun=this.$parent[click];
                }
                if(typeof fun == 'function'){
                    var params=getParameterNames(fun);
                    var ps=[];
                    if(!!params && params.length>0){
                        if(params.length==1 && params[0].length==1){
                            ps.push(objs.datagrid);
                            ps.push(objs.button)
                            ps.push(objs.event);
                        }else{
                            for(var i in params){
                                ps.push(objs[params[i].toLowerCase()]);
                            }
                        }
                        fun.apply(this.$parent,ps);
                    }else{
                        fun.apply(this.$parent);
                    }
                }

            },
            handleSubmit(){
                var keyName='like_' +this.dataKey;
                for(var i in this.searchFields){
                    delete this.queryParams['like_'+this.searchFields[i]];
                }
                this.queryParams[keyName]=this.dataValue;
                this.$refs['dataGrid'].load();
            }
        }
    };
</script>

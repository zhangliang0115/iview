<template>
    <div :class="prefixCls">
        <Tree-node
            v-for="item in data"
            :key="item.nodeKey"
            :data="item"
            :textField="textField"
            visible
            :multiple="multiple"
            :showRight="showRight"
            :show-checkbox="showCheckbox">
        </Tree-node>
        <div :class="[prefixCls + '-empty']" v-if="!data.length">{{ localeEmptyText }}</div>
    </div>
</template>
<script>
    import TreeNode from './node.vue';
    import { findComponentsDownward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import Locale from '../../mixins/locale';
    import $ from 'jquery';

    const prefixCls = 'ivu-tree';

    let key = 1;

    export default {
        name: 'Tree',
        mixins: [ Emitter, Locale ],
        components: { TreeNode },
        props: {
            data: {
                type: Array,
                default () {
                    return [];
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: false
            },
            emptyText: {
                type: String
            }
            , remoting: {
                type: Boolean,
                default:false
            }
            , url: {
                type: String
            }
            ,textField: {
                type: String,
                default: 'title'
            },showRight:{
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                loaded:false,
                prefixCls: prefixCls
            };
        },
        created(){
            this.load();
        },
        computed: {
            localeEmptyText () {
                if(this.remoting){
                    return 'Loading...';
                }else
                if(!!this.url && !this.loaded){
                    return 'Loading...';
                }else
                if (this.emptyText === undefined) {
                    return this.t('i.tree.emptyText');
                } else {
                    return this.emptyText;
                }
            }
        },
        methods: {
            load:function () {
                if(this.url){
                    var vm = this;
                    vm.loaded=false;
                    this.ajax({
                        url:vm.url,
                        success:function(data){
                            vm.data=data;
                            vm.loaded=true;
                            vm.$emit('on-load-success', vm.data);
                        }
                    });
                }
            },
            getSelectedNodes () {
                const nodes = findComponentsDownward(this, 'TreeNode');
                return nodes.filter(node => node.data.selected).map(node => node.data);
            },
            getCheckedNodes () {
                const nodes = findComponentsDownward(this, 'TreeNode');
                return nodes.filter(node => node.data.checked).map(node => node.data);
            },
            updateData (isInit = true) {
                // init checked status
                function reverseChecked(data) {
                    if (!data.nodeKey) data.nodeKey = key++;
                    if (data.children) {
                        let checkedLength = 0;
                        data.children.forEach(node => {
                            if (node.children) node = reverseChecked(node);
                            if (node.checked) checkedLength++;
                        });
                        if (isInit) {
                            if (checkedLength >= data.children.length) data.checked = true;
                        } else {
                            data.checked = checkedLength >= data.children.length;
                        }
                        return data;
                    } else {
                        return data;
                    }
                }
                
                function forwardChecked(data) {
                    if (data.children) {
                        data.children.forEach(node => {
                            if (data.checked) node.checked = true;
                            if (node.children) node = forwardChecked(node);
                        });
                        return data;
                    } else {
                        return data;
                    }
                }
                this.data.map(node => reverseChecked(node)).map(node => forwardChecked(node));
                this.broadcast('TreeNode', 'indeterminate');
            }
        },
        mounted () {
            this.updateData();
            this.$on('selected', ori => {
                const nodes = findComponentsDownward(this, 'TreeNode');
                nodes.forEach(node => {
                    this.$set(node.data, 'selected', false);
                });
                this.$set(ori, 'selected', true);
            });
            this.$on('on-selected', (data) => {
                this.$emit('on-select-change', this.getSelectedNodes());
                this.$emit('on-select', data);
            });
            this.$on('checked', () => {
                this.updateData(false);
            });
            this.$on('on-checked', () => {
                this.$emit('on-check-change', this.getCheckedNodes());
            });
            this.$on('toggle-expand', (payload) => {
                this.$emit('on-toggle-expand', payload);
            });
            this.$on('del-node', (data) => {
                this.$emit('on-del-node', data);
            });
            this.$on('add-child', (data) => {
                this.$emit('on-add-child', data);
            });
            this.$on('add-root', () => {
                this.$emit('on-add-root');
            });
        },
        watch: {
            data () {
                return;
                this.$nextTick(() => {
                    this.updateData();
                    this.broadcast('TreeNode', 'indeterminate');
                });
            }
        }
    };
</script>
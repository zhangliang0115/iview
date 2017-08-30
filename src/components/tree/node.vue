<style>
    .tree-contextmenu{width:100%}
    .tree-contextmenu .ivu-btn{text-align: left}
    .ivu-tree .ivu-poptip-body{padding:0;}
</style>
<template>
    <collapse-transition>
        <ul :class="classes" v-show="visible">
            <li>
                <span :class="arrowClasses" @click="handleExpand">
                    <Icon type="arrow-right-b"></Icon>
                </span>
                <Checkbox
                        v-if="showCheckbox"
                        :value="data.checked"
                        :indeterminate="indeterminate"
                        :disabled="data.disabled || data.disableCheckbox"
                        @click.native.prevent="handleCheck"></Checkbox>
                <Poptip v-show="showRight" trigger="right"   placement="right"   >
                            <Button-group vertical slot="content" class="tree-contextmenu">
                                <Button type="ghost" @click="addRoot">
                                    <Icon type="plus-circled" color="#2d8cf0" size="14"/>
                                    添加根节点
                                </Button>
                                <Button type="ghost" @click="addChild">
                                    <Icon type="plus-circled" color="#2d8cf0" size="14"/>
                                    添加子节点
                                </Button>
                                <Button type="ghost" @click="del" >
                                    <Icon type="close-circled" color="red" size="14"/>
                                    删除
                                </Button>
                            </Button-group>
                <span :class="titleClasses" v-html="data[textField]" @click="handleSelect"></span>
                </Poptip>
                <span v-show="!showRight" :class="titleClasses" v-html="data[textField]" @click="handleSelect"></span>
                    <Tree-node
                        v-for="item in data.children"
                        :key="item.nodeKey"
                        :data="item"
                        :visible="data.expand"
                        :textField="textField"
                        :multiple="multiple"
                        :showRight="showRight"
                        :show-checkbox="showCheckbox">
                </Tree-node>
            </li>
        </ul>
    </collapse-transition>
</template>
<script>
    import Checkbox from '../checkbox/checkbox.vue';
    import Icon from '../icon/icon.vue';
    import CollapseTransition from '../base/collapse-transition';
    import Emitter from '../../mixins/emitter';
    import { findComponentsDownward } from '../../utils/assist';

    const prefixCls = 'ivu-tree';

    export default {
        name: 'TreeNode',
        mixins: [ Emitter ],
        components: { Checkbox, Icon, CollapseTransition },
        props: {
            data: {
                type: Object,
                default () {
                    return {};
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
            visible: {
                type: Boolean,
                default: false
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
                prefixCls: prefixCls,
                indeterminate: false,
                visible:false
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}-children`
                ];
            },
            selectedCls () {
                return [
                    {
                        [`${prefixCls}-node-selected`]: this.data.selected
                    }
                ];
            },
            arrowClasses () {
                return [
                    `${prefixCls}-arrow`,
                    {
                        [`${prefixCls}-arrow-disabled`]: this.data.disabled,
                        [`${prefixCls}-arrow-open`]: this.data.expand,
                        [`${prefixCls}-arrow-hidden`]: !(this.data.children && this.data.children.length)
                    }
                ];
            },
            titleClasses () {
                return [
                    `${prefixCls}-title`,
                    {
                        [`${prefixCls}-title-selected`]: this.data.selected
                    }
                ];
            },
            titleLiClasses () {
                return [
                    `${prefixCls}-title`,
                    {
                        [`${prefixCls}-title-selected`]: this.data.selected&&!this.data.children
                    }
                ];
            }
        },
        methods: {
            del(){
                this.dispatch('Tree', 'del-node',this.data);
            },
            addRoot(){
                this.dispatch('Tree', 'add-root',this.data);
            },
            addChild(){
                this.dispatch('Tree', 'add-child',this.data);
            },
            handleExpand () {
                if (this.data.disabled) return;
                this.$set(this.data, 'expand', !this.data.expand);
                this.dispatch('Tree', 'toggle-expand', this.data);
            },
            handleSelect () {
//                this.handleExpand();//自动单击展开/关闭
                if (this.data.disabled) return;
                if (this.data.selected) {
                    this.data.selected = false;
                } else if (this.multiple) {
                    this.$set(this.data, 'selected', !this.data.selected);
                } else {
                    this.dispatch('Tree', 'selected', this.data);
                }
                this.dispatch('Tree', 'on-selected',this);
            },
            handleCheck () {
                if (this.disabled) return;
                const checked = !this.data.checked;
                if (!checked || this.indeterminate) {
                    findComponentsDownward(this, 'TreeNode').forEach(node => node.data.checked = false);
                } else {
                    findComponentsDownward(this, 'TreeNode').forEach(node => node.data.checked = true);
                }
                this.data.checked = checked;
                this.dispatch('Tree', 'checked');
                this.dispatch('Tree', 'on-checked');
            },
            setIndeterminate () {
                this.indeterminate = this.data.checked ? false : findComponentsDownward(this, 'TreeNode').some(node => node.data.checked);
            }
        },
        created () {
            // created node.vue first, mounted tree.vue second
            if (!this.data.checked) this.$set(this.data, 'checked', false);
        },
        mounted () {
            this.$on('indeterminate', () => {
                this.broadcast('TreeNode', 'indeterminate');
                this.setIndeterminate();
            });
        }
    };
</script>
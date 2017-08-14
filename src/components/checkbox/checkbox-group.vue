<template>
    <div :class="classes">
        <slot>
            <Checkbox :label="r[idField||'id']" v-for="r in data">
                <Icon v-if="r.icon" :type="r.icon"></Icon>
                <span>{{r[textField||'name']}}</span>
            </Checkbox>
        </slot>
    </div>
</template>
<script>
    import { findComponentsDownward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import $ from 'jquery';
    const prefixCls = 'ivu-checkbox-group';


    export default {
        name: 'CheckboxGroup',
        mixins: [ Emitter ],
        props: {
            value: {
                type: Array,
                default () {
                    return [];
                }
            }
            ,url:{
                type:String
            }
            ,idField:{
                type:String
            }
            ,textField:{
                type:String
            }
        },
        created(){
            if(this.$slots.default===undefined){
                this.load();
            }
        },
        data () {
            return {
                currentValue: this.value,
                data:[],
                childrens: []
            };
        },
        computed: {
            classes () {
                return `${prefixCls}`;
            }
        },
        mounted () {
            this.updateModel(true);
        },
        methods: {
            load:function () {
                if(this.url){
                    var vm = this;
                    $.ajax({
                        url:vm.url,
                        success:function(rs){
                            if(rs.data){
                                vm.data=rs.data;
                                vm.$emit('on-load-success', vm.data);
                            }
                        }
                    });
                }
            },
            updateModel (update) {
                const value = this.value;
                this.childrens = findComponentsDownward(this, 'Checkbox');

                if (this.childrens) {
                    this.childrens.forEach(child => {
                        child.model = value;

                        if (update) {
                            child.currentValue = value.indexOf(child.label) >= 0;
                            child.group = true;
                        }
                    });
                }
            },
            change (data) {
                this.currentValue = data;
                this.$emit('input', data);
                this.$emit('on-change', data);
                this.dispatch('FormItem', 'on-form-change', data);
            }
        },
        watch: {
            value () {
                this.updateModel(true);
            }
        }
    };
</script>

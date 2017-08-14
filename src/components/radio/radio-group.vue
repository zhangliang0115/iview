<template>
    <div :class="classes">
        <slot>
            <Radio :label="r[idField||'id']" v-for="r in data">
                <Icon v-if="r.icon" :type="r.icon"></Icon>
                <span>{{r[textField||'name']}}</span>
            </Radio>
        </slot>
    </div>
</template>
<script>
    import { oneOf, findComponentsDownward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import $ from 'jquery';

    const prefixCls = 'ivu-radio-group';

    export default {
        name: 'RadioGroup',
        mixins: [ Emitter ],
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            type: {
                validator (value) {
                    return oneOf(value, ['button']);
                }
            },
            vertical: {
                type: Boolean,
                default: false
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
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-${this.type}`]: !!this.type,
                        [`${prefixCls}-vertical`]: this.vertical
                    }
                ];
            }
        },
        mounted () {
            this.updateValue();
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
            updateValue () {
                const value = this.value;
                this.childrens = findComponentsDownward(this, 'Radio');
                if (this.childrens) {
                    this.childrens.forEach(child => {
                        child.currentValue = value == child.label;
                        child.group = true;
                    });
                }
            },
            change (data) {
                this.currentValue = data.value;
                this.updateValue();
                this.$emit('input', data.value);
                this.$emit('on-change', data.value);
                this.dispatch('FormItem', 'on-form-change', data.value);
            }
        },
        watch: {
            value () {
                this.updateValue();
            }
        }
    };
</script>

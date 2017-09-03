<style scoped>
    .ivu-layout {
        position: relative;
        overflow: hidden;
        margin: 0;
        padding: 0;
        z-index: 0;
    }

</style>
<template>
    <div :class="classes" :style="styles" ><slot></slot></div>
</template>
<script>

    import { getStyle,findComponentsDownward } from '../../utils/assist';
    import { on } from '../../utils/dom';

    const prefixCls = 'ivu-layout';

    export default {
        name: 'Layout',
        created: function () {

        },
        props: {
            full: {
                type: Boolean,
                default: true
            },
            border: {
                type: Boolean,
                default: false
            },id:{
                type:String
            }
        },
        data(){
            return {
                width:'',
                height:'',
                container:{
                    north:{height:0},west:{width:0},center:{},south:{height:0},east:{width:0}
                }
            }
        },
        mounted(){
            this.handleResize();
            on(window, 'resize', this.handleResize);

        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`
                ];
            },
            styles(){
                return {
                    height:`${this.height}px`
                }
            }
        },
        methods: {
            handleResize(){
                this.$nextTick(() => {
                    this.width=parseInt(getStyle(this.$el, 'width'));
                    if (this.full) {
                        this.height=parseInt(getStyle(this.$parent.$el, 'height'))||document.documentElement.clientHeight;
                    }
                    findComponentsDownward(this, 'Layout').forEach(node => node.handleResize());
                });
            }
        }
    };
</script>

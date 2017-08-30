<template>
    <div class="ivu-layout" :style="wrapStyle" ><slot></slot></div>
</template>
<script>
    export default {
        name: 'Layout',
        created: function () {
            this.$nextTick(function () {//DOM更新了
                this.calcWidth();
            })
        },
        props: {
            full: {
                type: Boolean,
                default: true
            },
            border: {
                type: Boolean,
                default: false
            },
            width:{
                type:Number
            },
            height:{
                type:Number
            }
        },
        data () {
            return {
                real_width: '',
                real_height:"",
                top_height:0,
                left_width:0,
            };
        },
        computed: {
            wrapStyle () {
                var style={
                    width:this.real_width+"px",
                    height:this.real_height+"px"
                };
                if(this.border){
                    style.border="1px #dddee1 solid";
                }
                return style;
            }
        },
        methods: {
            calcWidth: function () {
                this.$nextTick(function () {
                    this.real_width = this.width||(this.$el.parentNode.tagName=='BODY'?document.documentElement.clientWidth:this.$el.parentNode.clientWidth);
                    this.real_height = this.height||(this.$el.parentNode.tagName=='BODY'?document.documentElement.clientHeight:this.$el.parentNode.clientHeight);
                    if(this.border) {
                        this.real_width=this.real_width-2;
                        this.real_height= this.real_height-2;
                    }

                })
            }
        }
    };
</script>

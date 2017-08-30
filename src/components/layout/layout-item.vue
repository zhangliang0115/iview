<style scoped>
    .ivu-layout-left .ivu-menu-vertical.ivu-menu-light:after{
        content:none;
    }
    .ivu-layout-top{
        /*position: fixed;*/
        background-color: #2b83f9;
        background-image: linear-gradient(143deg,#2945cb 20%,#2b83f9 81%,#3a9dff);
        top:0;
        left:0;
        width: 100%;
        z-index: 2;
        color: #fff;
        font-size:14px;
    }
    .ivu-layout-left{
        float: left;
        display: inline-block;
        z-index: 1;
        /*position: fixed;*/
        left:0;
        border-right: 1px #A1A1A1 solid;
        overflow-y: overlay;
    }
    .ivu-layout-center{
        float: left;
        /*position: fixed;*/
    }
</style>
<template>
    <div :class="wrapClass" :style="wrapStyle" ><slot></slot></div>
</template>
<script>
    export default {
        name: 'LayoutItem',
        props: {
            position: {
                type: String
            },
            height: {
                type: Number
            },
            width: {
                type: Number
            }
        },
        computed: {
            wrapStyle: function () {
                if(this.position=="top"){
                    this.layout.top_height=this.height||50;
                    return {
                        height: this.layout.top_height + "px",
                        "line-height":this.layout.top_height+"px"
                    }
                }else if(this.position=="left"){
                    this.layout.left_width=this.width||200;
                    return {
                        width: this.layout.left_width + "px",
                        height:this.layout.real_height-this.layout.top_height+"px",
                        top:this.layout.top_height+"px"
                    }
                }else if(this.position=="center"){
                    return {
                        width:this.layout.real_width-this.layout.left_width+"px",
                        height:this.layout.real_height-this.layout.top_height+"px",
                        top:this.layout.top_height+"px",
                        left:this.layout.left_width+"px"
                    }
                }

            },
            wrapClass: function () {
                return "ivu-layout-" + this.position
            },
            layout: function () {
                var parent = this.$parent;
                while (parent.$options.name !== 'Layout') {
                    parent = parent.$parent;
                }
                return parent;
            }
        },
        methods: {
            calcWidth: function () {
                this.real_width = this.width||document.documentElement.clientWidth;
                this.real_height = this.height||document.documentElement.clientHeight
                if(this.border) {
                    this.real_width=this.real_width-2;
                    this.real_height= this.real_height-2;
                }

            }
        }
    };
</script>

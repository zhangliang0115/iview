<style scoped>
    .ivu-layout-panel {
        position: absolute;
        overflow: hidden;
    }
    .ivu-layout-panel-east,.ivu-layout-panel-west {
        z-index: 2;
    }
    .ivu-layout-panel-north,.ivu-layout-panel-south {
        z-index: 3;
    }
    .ivu-layout-panel-west{border-right: solid 1px #D4D4D4}
    /*.ivu-layout-panel-south{background: rgb(169, 250, 205);}*/
</style>
<template>
    <div :class="classes" :style="styles" ><slot></slot></div>
</template>
<script>
    import { oneOf } from '../../utils/assist';

    const prefixCls = 'ivu-layout-panel';

    export default {
        name: 'LayoutItem',
        props: {
            region: {
                validator (value) {
                    return oneOf(value, ['north', 'south', 'east', 'west', 'center']);
                }
            },
            height: {
                type: Number
            },
            width: {
                type: Number
            }
        },
        data(){
            return {
                container:{
                    width:'',
                    height:''
                }
            }
        },
        watch:{
            height(){
                switch (this.region){
                    case 'north':
                        this.layout.container.north.height=this.height;
                        break;
                    case 'south':
                        this.layout.container.south.height=this.height;
                        break;
                }
            },
            width(){
                switch (this.region){
                    case 'west':
                        this.layout.container.west.width=this.width;
                        break;
                    case 'east':
                        this.layout.container.east.width=this.width;
                        break;
                    case 'center':
                        break;
                }
            }
        },
        mounted(){
            this.$nextTick(()=>{
                switch (this.region){
                    case 'north':
                        this.layout.container.north.height=this.height;
                        break;
                    case 'south':
                        this.layout.container.south.height=this.height;
                        break;
                    case 'west':
                        this.layout.container.west.width=this.width;
                        break;
                    case 'east':
                        this.layout.container.east.width=this.width;
                        break;
                    case 'center':
                        break;
                }
            });


        },
        computed: {
            classes: function () {
                return [
                    `${prefixCls}`,`${prefixCls}-${this.region}`
                ];
            },
            styles: function () {
                if(this.region=='north'){
                    return {
                        width:`${this.layout.width}px`,
                        left:0,top:0,height:`${this.height}px`
                    }
                }if(this.region=='south'){
                    return {
                        width:`${this.layout.width}px`,
                        left:0,
                        top:(this.layout.height-this.height)+'px',
                        height:`${this.height}px`
                    }
                }if(this.region=='west'){
                    return {
                        width:`${this.width}px`,
                        left:0,
                        top:(this.layout.container.north.height)+'px',
                        height:(this.layout.height-this.layout.container.north.height-this.layout.container.south.height)+'px'
                    }
                }if(this.region=='east'){
                    return {
                        width:`${this.width}px`,
                        left:(this.layout.width-this.width)+'px',
                        top:(this.layout.container.north.height)+'px',
                        height:(this.layout.height-this.layout.container.north.height-this.layout.container.south.height)+'px'
                    }
                }if(this.region=='center'){
                    return {
                        width:(this.layout.width-this.layout.container.west.width-this.layout.container.east.width)+'px',
                        left:(this.layout.container.west.width)+'px',
                        top:(this.layout.container.north.height)+'px',
                        height:(this.layout.height-this.layout.container.north.height-this.layout.container.south.height)+'px'
                    }
                }

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

        }
    };
</script>

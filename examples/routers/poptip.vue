<template>
    <div>
        <Poptip trigger="hover" title="提示标题" content="提示内容">
            <Button>hover 激活</Button>
        </Poptip>
        <Poptip transfer title="提示标题" content="提示内容">
            <Button>click 激活</Button>
        </Poptip>
        <Poptip trigger="right" title="提示标题" content="提示内容" @on-show-before="show">
            <Button>right 激活</Button>
        </Poptip>
        <Poptip trigger="focus" title="提示标题" content="提示内容" >
            <Button>focus 激活</Button>
        </Poptip>
        <Poptip v-model="visible">
            <a>click 激活</a>
            <div slot="title"><i>自定义标题</i></div>
            <div slot="content">
                <a @click="close">关闭提示框</a>
            </div>
        </Poptip>
        <Poptip trigger="focus" title="提示标题" content="提示内容">
            <i-input placeholder="输入框的 focus"></i-input>
        </Poptip>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                visible: false
            }
        },
        methods: {
            show(){
                console.log("show!!!");
            },
            close () {
                this.visible = false;
            }
        }
    }
</script>

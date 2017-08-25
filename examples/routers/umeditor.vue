<template>
    <div class="components-container">
        <div class="info">UE编辑器示例<br>需要使用编辑器时，调用UE公共组件即可。可设置填充内容defaultMsg，配置信息config(宽度和高度等)，可调用组件中获取内容的方法。支持页面内多次调用。</div>
        <button @click="getUEContent()">获取内容</button>
        defaultMsg:<i-input v-model="defaultMsg"/> defaultMsg1:<i-input v-model="defaultMsg1"/>
        <div class="editor-container">
            <UE :value='defaultMsg' :config=config :id='ue1' ref="ue" @input="defaultMsg=arguments[0].content"></UE>
            <UE :value='defaultMsg1' :config=config :id='ue2' ref="ue2" @input="defaultMsg1=arguments[0].content"></UE>
        </div>
    </div>
</template>
<style>
    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }
</style>
<script>
    import UE from '../../src/components/um-editor';
    import Input from "../../src/components/input/input";
    export default {
        components: {
            Input,
            UE},
        data() {
            return {
                defaultMsg1:'cs',
                defaultMsg: '这里是UE测试',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 250
                },
                ue1: "ue1", // 不同编辑器必须不同的id
                ue2: "ue2"
            }
        },
        methods: {
            getUEContent() {
                let content = this.$refs.ue.getUEContent(); // 调用子组件方法
                this.$Notice.info({
                    title: '获取成功，可在控制台查看！',
                    desc: content,
                    type: 'success'
                });

            }
        }
    };
</script>
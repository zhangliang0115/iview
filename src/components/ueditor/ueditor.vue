<template>
    <div :id="id" />
</template>
<script>
    export default {
        name: 'UEditor',
        data () {
            return {
                editor: null
            }
        },
        props: {
            value: {
                type: String
            },
            config: {
                type: Object
            },
            id: {
                type: String
            },
        },
        watch:{
            value:function(value){
                this.$nextTick(function () {
                    this.setCurrentValue(value);
                })
            }
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor(this.id, this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                _this.editor.setContent(_this.value); // 确保UE加载完成后，放入内容。
            });
            this.editor.addListener("contentChange", function () {
                const wordCount = this.editor.getContentLength(true);
                const content = this.editor.getContent();
                const plainTxt = this.editor.getPlainTxt();
                this.$emit('input', { wordCount: wordCount, content: content, plainTxt: plainTxt });
            }.bind(this));
        },
        methods: {
            setCurrentValue (value) {
                if(!!this.editor){
                    if (value === this.editor.getContent()) return;
                    this.editor.setContent(value);
                }
            },
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>
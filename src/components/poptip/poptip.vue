<template>
    <div
        :class="classes"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        v-clickoutside="handleClose">
        <div
            :class="[prefixCls + '-rel']"
            ref="reference"
            @click="handleClick"
            @contextmenu="handleRight($event)"
            @mousedown="handleFocus(false)"
            @mouseup="handleBlur(false)">
            <slot></slot>
        </div>
        <transition name="fade">
            <div
                :class="[prefixCls + '-popper']"
                :style="styles"
                ref="popper"
                v-show="visible"
                @mouseenter="handleMouseenter"
                @mouseleave="handleMouseleave"

                :data-transfer="transfer"
                v-transfer-dom>
                <div :class="[prefixCls + '-content']">
                    <div :class="[prefixCls + '-arrow']"></div>
                    <div :class="[prefixCls + '-inner']" v-if="confirm">
                        <div :class="[prefixCls + '-body']">
                            <i class="ivu-icon ivu-icon-help-circled"></i>
                            <div :class="[prefixCls + '-body-message']"><slot name="title">{{ title }}</slot></div>
                        </div>
                        <div :class="[prefixCls + '-footer']">
                            <i-button type="text" size="small" @click.native="cancel">{{ localeCancelText }}</i-button>
                            <i-button type="primary" size="small" @click.native="ok">{{ localeOkText }}</i-button>
                        </div>
                    </div>
                    <div :class="[prefixCls + '-inner']" v-if="!confirm">
                        <div :class="[prefixCls + '-title']" v-if="showTitle" ref="title"><slot name="title"><div :class="[prefixCls + '-title-inner']">{{ title }}</div></slot></div>
                        <div :class="[prefixCls + '-body']">
                            <div :class="[prefixCls + '-body-content']"><slot name="content"><div :class="[prefixCls + '-body-content-inner']">{{ content }}</div></slot></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Popper from '../base/popper';
    import iButton from '../button/button.vue';
    import clickoutside from '../../directives/clickoutside';
    import TransferDom from '../../directives/transfer-dom';
    import { oneOf } from '../../utils/assist';
    import Locale from '../../mixins/locale';

    const prefixCls = 'ivu-poptip';

    export default {
        name: 'Poptip',
        mixins: [ Popper, Locale ],
        directives: { clickoutside, TransferDom },
        components: { iButton },
        props: {
            trigger: {
                validator (value) {
                    return oneOf(value, ['click', 'focus', 'hover','right']);
                },
                default: 'click'
            },
            placement: {
                validator (value) {
                    return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'top'
            },
            title: {
                type: [String, Number]
            },
            content: {
                type: [String, Number],
                default: ''
            },
            width: {
                type: [String, Number]
            },
            confirm: {
                type: Boolean,
                default: false
            },
            okText: {
                type: String
            },
            cancelText: {
                type: String
            },
            transfer: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                showTitle: true,
                isInput: false
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-confirm`]: this.confirm
                    }
                ];
            },
            styles () {
                let style = {};

                if (this.width) {
                    style.width = `${this.width}px`;
                }
                return style;
            },
            localeOkText () {
                if (this.okText === undefined) {
                    return this.t('i.poptip.okText');
                } else {
                    return this.okText;
                }
            },
            localeCancelText () {
                if (this.cancelText === undefined) {
                    return this.t('i.poptip.cancelText');
                } else {
                    return this.cancelText;
                }
            }
        },
        methods: {
            handleRight(event){
                if (this.trigger === 'right') {
                    event.preventDefault ? event.preventDefault():(event.returnValue = false);
                    this.handleClose();
                    this.visible=true;
                }else{
                    return false;
                }
            },
            handleClick () {
                if (this.confirm) {
                    this.visible = !this.visible;
                    return true;
                }
                if (this.trigger !== 'click') {
                    return false;
                }
                this.visible = !this.visible;
            },
            handleClose () {
                if (this.confirm) {
                    this.visible = false;
                    return true;
                }
                if (this.trigger !== 'click' && this.trigger!=='right') {
                    return false;
                }
                this.visible = false;
            },
            handleFocus (fromInput = true) {
                if (this.trigger !== 'focus' || this.confirm || (this.isInput && !fromInput)) {
                    return false;
                }
                this.visible = true;
            },
            handleBlur (fromInput = true) {
                if (this.trigger !== 'focus' || this.confirm || (this.isInput && !fromInput)) {
                    return false;
                }
                this.visible = false;
            },
            handleMouseenter () {
                if (this.trigger !== 'hover' || this.confirm) {
                    return false;
                }
                if (this.enterTimer) clearTimeout(this.enterTimer);
                this.enterTimer = setTimeout(() => {
                    this.visible = true;
                }, 100);
            },
            handleMouseleave () {
                if (!(this.trigger === 'hover' ||this.trigger === 'right' || this.confirm)) {
                    return false;
                }
                if(this.trigger === 'right'){
                    setTimeout(() => {
                        this.visible = false;
                    }, 100)
                }
                if (this.enterTimer) {
                    clearTimeout(this.enterTimer);
                    this.enterTimer = setTimeout(() => {
                        this.visible = false;
                    }, 100);
                }
            },
            cancel () {
                this.visible = false;
                this.$emit('on-cancel');
            },
            ok () {
                this.visible = false;
                this.$emit('on-ok');
            },
            getInputChildren () {
                const $input = this.$refs.reference.querySelectorAll('input');
                const $textarea = this.$refs.reference.querySelectorAll('textarea');
                let $children = null;

                if ($input.length) {
                    $children = $input[0];
                } else if ($textarea.length) {
                    $children = $textarea[0];
                }

                return $children;
            }
        },
        mounted () {
            if (!this.confirm) {
//                this.showTitle = this.$refs.title.innerHTML != `<div class="${prefixCls}-title-inner"></div>`;
                this.showTitle = (this.$slots.title !== undefined) || this.title;
            }
            // if trigger and children is input or textarea,listen focus & blur event
            if (this.trigger === 'focus') {
                this.$nextTick(() => {
                    const $children = this.getInputChildren();
                    if ($children) {
                        this.isInput = true;
                        $children.addEventListener('focus', this.handleFocus, false);
                        $children.addEventListener('blur', this.handleBlur, false);
                    }
                });
            }
        },
        beforeDestroy () {
            const $children = this.getInputChildren();
            if ($children) {
                $children.removeEventListener('focus', this.handleFocus, false);
                $children.removeEventListener('blur', this.handleBlur, false);
            }
        }
    };
</script>

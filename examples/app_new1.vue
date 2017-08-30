<style scoped>
    .layout{
        /*border: 1px solid #d7dde4;*/
        background: #f5f7f9;
        display:inline-flex;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 5px 15px 5px;
    }
    .layout-content{
        min-height: 200px;
        /*margin: 5px;*/
        /*overflow: hidden;*/
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 0px;
        width: 100%;
        height: 100%;
        /*overflow-y: hidden;*/
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
        overflow-y: auto;
    }
    .layout-header{
        height: 47px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 40px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
        color: white;
        text-align: center;
        line-height: 40px;
        font-size: 20px;
    }
    .hide{display: none}
    .layout-ceiling{
        padding: 15px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
        padding: 15px 0;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout .ivu-row-flex{height: 100%}
</style>
<template>
    <div class="layout" :style="style"  >
        <div class="layout-left layout-menu-left"  :style="styleLeft">
            <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" accordion @on-select="onSelect">
                <div class="layout-logo-left">
                    后台管理系统
                </div>
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate" :size="iconSize"></Icon>
                        <span class="layout-text">会员管理</span>
                    </template>
                    <Menu-item name="member">会员管理</Menu-item>
                    <Menu-item name="member-level">会员等级</Menu-item>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad" :size="iconSize"></Icon>
                        内容管理
                    </template>
                    <Menu-item name="content-cat">内容分类</Menu-item>
                    <Menu-item name="content">内容管理</Menu-item>
                    <Menu-item name="tag">标签管理</Menu-item>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        网站管理
                    </template>
                    <Menu-item name="navigation">导航管理</Menu-item>
                    <Menu-item name="link">友情链接</Menu-item>
                    <Menu-item name="advertising-position">广告位</Menu-item>
                    <Menu-item name="advertising">广告管理</Menu-item>
                    <Menu-item name="template">模板管理</Menu-item>
                    <Menu-item name="static">静态化管理</Menu-item>
                    <Menu-item name="indexes">索引管理</Menu-item>
                    <Menu-item name="seo">SEO设置</Menu-item>
                    <Menu-item name="sitemap">SiteMap管理</Menu-item>
                </Submenu>
                <Submenu name="5">
                    <template slot="title">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        系统管理
                    </template>
                    <Menu-item name="config">系统设置</Menu-item>
                    <Menu-item name="account">账户管理</Menu-item>
                    <Menu-item name="role">角色管理</Menu-item>
                    <Menu-item name="module">模块管理</Menu-item>
                    <Menu-item name="menu">菜单管理</Menu-item>
                    <Menu-item name="power">权限管理</Menu-item>
                    <Menu-item name="log">日志管理</Menu-item>
                    <Menu-item name="storage">存储管理</Menu-item>
                    <Menu-item name="area">地区管理</Menu-item>
                </Submenu>
            </Menu>
        </div>
        <div ref="layout-right" class="layout-right" :style="styleRight">
            <div class="layout-header">
                <div >
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                    <div class="layout-ceiling-main">
                        <Icon type="ios-locked" ></Icon><a href="#">修改密码</a> |
                        <Icon type="log-out"></Icon><a href="#">退出登录</a>
                    </div>
                </div>
            </div>
            <div class="layout-breadcrumb">
                <Breadcrumb>
                    <Breadcrumb-item href="/welcome">首页</Breadcrumb-item>
                    <Breadcrumb-item href="/welcome">系统管理</Breadcrumb-item>
                    <Breadcrumb-item>系统设置</Breadcrumb-item>
                </Breadcrumb>
            </div>
            <div class="layout-content" :style="contentStyle">
                <div class="layout-content-main"> <router-view></router-view></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                leftWith:200,
                spanLeft: 4,
                spanRight: 20,
                menus:[]
            };
        },
        created:function(){

        },
        methods:{
            loadMenu(){

            },
            selectMenu(){

            },
            onSelect:function(name){
                this.$router.push({path:name});
            },
            toggleClick () {
                if (this.leftWith === 200) {
                    this.leftWith = 0;
                } else {
                    this.leftWith = 200;
                }
                this.bus.$emit('layout-right-resize');
            }
        },
        computed:{
            iconSize () {
                return this.spanLeft === 4 ? 14 : 24;
            },
            style:function(){
                return {
                    height:document.documentElement.clientHeight+'px'
                };
            },
            styleLeft(){
                return {
                    width:this.leftWith+"px"
                }
            },
            styleRight(){
                return {
                    width:(document.documentElement.clientWidth-this.leftWith)+"px"
                }
            },
            contentStyle:function () {
                return {
                    height:document.documentElement.clientHeight-73-7+'px'
                };
            }
        }
    }
</script>

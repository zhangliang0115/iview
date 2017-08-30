<style scoped>
    .layout-logo-left{
        /*width: 90%;*/
        height: 47px;
        background: #5b6270;
        border-radius: 3px;
        /*padding: 10px ;*/
        color: white;
        text-align: center;
        line-height: 47px;
        font-size: 20px;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
        padding: 15px 0;
    }
    .layout-breadcrumb{
        padding: 5px 15px 5px;
        background-color: rgba(88, 71, 71, 0.42);
    }
</style>
<template>
    <layout ref="outer" id="outer">
        <layout-item region="west" :width="westWidth" style=" background: #5b6270;overflow-y: auto">
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
        </layout-item>
        <layout-item region="center">
            <layout id="inner" >
                <layout-item region="north" :height="47" >
                    <div >
                        <i-button type="text" @click="toggleClick">
                            <Icon type="navicon" size="32"></Icon>
                        </i-button>
                        <div class="layout-ceiling-main">
                            <Icon type="ios-locked" ></Icon><a href="#">修改密码</a> |
                            <Icon type="log-out"></Icon><a href="#">退出登录</a>
                        </div>
                    </div>
                </layout-item>
                <layout-item region="center" >
                    <layout>
                        <layout-item region="north" :height="31">
                            <div class="layout-breadcrumb">
                                <Breadcrumb>
                                    <Breadcrumb-item href="/welcome">首页</Breadcrumb-item>
                                    <Breadcrumb-item href="/welcome">系统管理</Breadcrumb-item>
                                    <Breadcrumb-item>系统设置</Breadcrumb-item>
                                </Breadcrumb>
                            </div>
                        </layout-item>
                        <layout-item region="center"  >
                            <transition name="fade">

                            <router-view></router-view>
                                <!--<keep-alive>     </keep-alive>-->
                            </transition>
                        </layout-item>
                    </layout>
                </layout-item>
            </layout>
        </layout-item>
    </layout>
</template>
<script>
    import Layout from "../src/components/layout-test/layout";
    import LayoutItem from "../src/components/layout-test/layout-item";

    export default {
        created(){
            this.bus.$emit('layout-resize');
        },
        components: {
            LayoutItem,
            Layout
        },
        data(){
            return {
                westWidth:200,
                menus:[]
            };
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
                if (this.westWidth === 200) {
                    this.westWidth = 0;
                } else {
                    this.westWidth = 200;
                }
               this.$refs.outer.handleResize();
            }
        },
        computed:{
            iconSize () {
                return 16;
            }
        }
    }
</script>

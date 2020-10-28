/*
* 路由对象模块
* */
import Vue from 'vue'
import VueRouter from 'vue-router'

/*引入pages*/
const page1 = ()=>import('../views/screen-page-1');
const page2 = ()=>import('../views/screen-page-2');
const page3 = ()=>import('../views/screen-page-3');

//申明使用插件
Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        {
            path:'/page-1',
            component: page1,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/page-2',
            component: page2,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/page-3',
            component: page3,
            meta: {
                showFooter: false
            }
        },
        {
            path: '/',
            redirect: '/page-1' //系统默认页
        }
    ]
})

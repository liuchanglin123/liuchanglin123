import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/iconfont/iconfont.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import commonComponents from './components/common/' // 通用组件引入
import echarts from 'echarts'
import storage from '@/utils/storage'
import message from '@/utils/message'
import xss from 'xss'
import exportExcel from '@/utils/exportExcel'

Object.defineProperty(Vue.prototype, '$xss', {
    value: xss,
})

Vue.use(commonComponents)
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$api = api
Vue.prototype.$storage = storage
Vue.prototype.$Message = message
Vue.prototype.eventBus = new Vue()
Vue.prototype.downloadExcel = exportExcel

// 防重复点击-自定义指令
Vue.directive('prevent', {
    inserted(el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 1000)
            }
        })
    },
})

// 判断有权限
// const hasPermit = (() => {
//   // 当管理员修改了权限，因为请求是异步的，所以要刷新二次页面，sesstionStorage里的数据才是最新的
//   const menus = storage.sessionStorage.get('menus')

//   if (!menus) return () => true
//   const permissions = menus.filter((item) => item.type === 1).map((item) => item.permissionCode)

//   return (key) => permissions.includes(key)
// })()

// 每次判断按钮权限从session里取拥有的权限code
const hasPermit = (key) => {
    const permissions = storage.sessionStorage.get('btnData')
        // console.log('permissions:', permissions)
    if (!permissions) return true
    return permissions.includes(key)
}

// 按钮权限
Vue.directive('has', {
    inserted(el, binding) {
        // console.log(binding.value, hasPermit(binding.value))
        if (binding.value && !hasPermit(binding.value)) {
            el.remove()
        }
    },
})

new Vue({
    render: (h) => h(App),
    router,
    store,
}).$mount('#app')
// 首页子路由列表

// 首页子页面1
const homeChild1 = () => import('@/views/home/homeChild1/homeChild1')
// 首页子页面2
const homeChild2 = () => import('@/views/home/homeChild2/homeChild2')
// 组件展示
const componentDemo = () => import('@/views/componentDemo/')


export default [
  {
    path: 'homeChild1',
    name: 'homeChild1',
    meta: {
      title: '子页面1',
    },
    component: homeChild1
  },
  {
    path: 'homeChild2',
    name: 'homeChild2',
    meta: {
      title: '子页面2',
    },
    component: homeChild2
  },
  {
    path: 'componentDemo',
    name: 'componentDemo',
    meta: {
      title: '组件demo',
    },
    component: componentDemo
  }
]
const home = () => import('@/views/home/home')
const login = () => import('@/views/login/login')
const news = () => import('@/views/news/news')
const locking = () => import('@/views/locking/locking')
import children from './home/children'



export default [{
    path: '/',
    redirect: {
      path: '/home/homeChild1'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    children,
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/news',
    name: 'news',
    component: news
  },
  {
    path: '/locking',
    name: 'locking',
    component: locking
  },
  // {
  //   path: '/componentDemo',
  //   name: 'componentDemo',
  //   component: componentDemo
  // },
]
import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login' //因为是上一层目录的所以前面两个点 ..
import home from "@/components/home";

Vue.use(VueRouter)

const routes = [ //这是放路由规则对象的
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:login
  },
  {
    path:'/home',
    component: home
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
//    - to:将要访问的路径，
// -    from:从哪个路径跳转而来的,
//     - next:放行的函数,调用这个函数就是允许你访问
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next() //而如果没有被return出去说明访问的是有权限的页面
  //从sessionStorage中获取到保存的token值
  const tokenStr=window.sessionStorage.getItem('token')
  //没有token值则强制跳转到登录页
  if(!tokenStr) return next('/login')
  next()
})
export default router

<template>
  <el-container class="home-container">
<!--头部区域-->
    <el-header height="150px">
      <div>
        <img src="../assets/icon.webp" alt="">
        <span>电商后台管理</span>
      </div>
      <el-button type="info" round @click="logout">退出</el-button>
    </el-header>
<!--    页面主体区-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
<!--        侧边栏菜单区域-->
        <div class="toggle-button" @click="toggleCollapse">|||</div> <!--实现折叠和展开的按钮-->
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active='activePath'
        >
<!--          一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
<!--            一级菜单的模板区-->
            <template slot="title">
<!--              i是图标，span是文本-->
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item :index="'/'+subitem.path+''" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)">
              <i class="el-icon-menu"></i>
              <span>{{ subitem.authName }}</span></el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
<!--      右侧内容主体-->
      <el-main>
        <router-view></router-view> <!--放一个路由占位符-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menuList:[] ,   //左侧菜单数据
      isCollapse:false, //是否折叠，默认不折叠
      activePath:'', //当前激活的地址
  }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods:{
    logout(){
      window.sessionStorage.clear() //清除token
      this.$router.push('/login')//重定向到登录页面
      this.$message.warning('您已退出登录')
    },
    async getMenuList(){ //获取所有的左侧菜单
      const {data:res}=await this.$http.get('menus')//通过解构赋值获取data的值，添加异步来等待到获取数据
      if(res.meta.status!==200) return this.$message.error(res.meta.msg())//获取不到就报错
      this.menuList=res.data//获取的到就放到data中
      console.log(this.menuList)
    },
    toggleCollapse(){ //点击按钮，切换菜单的折叠与展开
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){ //保存链接的激活状态
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }

  .el-button{
    float:right;
    transform: translate(-50px,10px);
  }
}
.el-aside{
  background-color: #545c64;
  .el-menu{
    border-right: 0;
  }
}
.el-main{
  background-color: #eaedf1;

}
.home-container{
  height: 100%;
}
img{
  height: 100px;
  padding: 10px;//为了更好看一些，加了一个padding使图片和登录的框有一定距离
  border-radius: 50%; //将外层的div也变圆
  box-shadow: 0 0 10px #ddd; //添加阴影
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;//增大竖线之间的间距
  cursor: pointer;//鼠标放上去的时候鼠标变成小手
}
</style>
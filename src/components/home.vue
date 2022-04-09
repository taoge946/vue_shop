<template>
  <el-container class="home-container">
<!--头部区域-->
    <el-header height="200px">
      <div>
        <img src="../assets/icon.webp" alt="">
        <span>啊涛的个人博客</span>
      </div>
      <el-button type="info" round @click="logout">退出</el-button>
    </el-header>
<!--    页面主体区-->
    <el-container>
<!--      侧边栏-->
      <el-aside width="200px">
<!--        侧边栏菜单区域-->
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
<!--          一级菜单-->
          <el-submenu index="1">
<!--            一级菜单的模板区-->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>前端笔记</span>
            </template>
<!--            二级菜单-->
            <el-menu-item index="1-1-1">Vue学习笔记</el-menu-item>
            <el-menu-item index="1-2-1">js笔记</el-menu-item>
            <el-menu-item index="1-3-1">vue项目笔记</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
<!--      右侧内容主体-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods:{
    logout(){
      window.sessionStorage.clear() //清除token
      this.$router.push('/login')//重定向到登录页面
      this.$message.warning('您已退出登录')
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  //sbackground-color: #2b4b6b;
  align-items: center;
   img{
    height: 100px;
    padding: 10px;//为了更好看一些，加了一个padding使图片和登录的框有一定距离
    border-radius: 50%; //将外层的div也变圆
    box-shadow: 0 0 10px #ddd; //添加阴影
    position: relative;
    left: 50%;
    bottom: 50%;
    transform: translate(-50%,20%);
  }
  span{
    position: absolute;
    right:10%;
    top: 150px;
  }
  .el-button{
    float:right;
    transform: translate(-50px,10px);
  }
}
.el-aside{
  background-color: #545c64;
}
.el-main{
  background-color: aqua;
}
.home-container{
  height: 100%;
}
</style>
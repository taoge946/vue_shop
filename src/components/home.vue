<template>
<div>
  Home组件
  <el-button type="info" round @click="logout">退出</el-button>
</div>
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

</style>
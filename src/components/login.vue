<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box"><!--头像盒子-->
        <img src="../assets/logo.png" alt="">
      </div>
<!--      登录表单区域-->
      <el-form ref="loginFormRef" label-width="0" class="login_form" :rules="loginFromRules" :model="loginForm">
<!--        用户名区域-->
        <el-form-item prop="username">
          <el-input prefix-icon='el-icon-user-solid' v-model="loginForm.username" ></el-input>
        </el-form-item>
<!--密码区域-->
        <el-form-item prop="password">
          <el-input  type="password" prefix-icon='el-icon-lock' v-model="loginForm.password"></el-input>
        </el-form-item>
<!--       按钮区域 -->
        <el-form-item  class="btns">
          <el-button @click="login" type="primary" round>登录</el-button>
          <el-button @click="resetLoginForm" type="info" round>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default { //export default是复用组件时用到的，将它export出来才能在其他地方import
  data(){
    return{
      //这是登录表单的数据绑定对象
      loginForm:{
        username:'admin',
        password:'123456',
      },
      //这是表单的验证规则
      loginFromRules:{
          username:[  //验证用户名是否合法
            { required: true, message: '请输入用户名', trigger: 'blur' },//require是是否为必填项，message是提示消息，tigger是触发的时机，当前设定失去焦点时触发
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }//长度在3到10个字符之间
          ],
          password:[
            { required: true, message: '请输入用户密码', trigger: 'blur' },//require是是否为必填项，message是提示消息，tigger是触发的时机，当前设定失去焦点时触发
            { min: 6, max: 15, message: '长度在 6 到 10 个字符', trigger: 'blur' }//长度在3到10个字符之间
          ],//验证密码是否合法
      }
    }
  },
  methods:{
    resetLoginForm(){//点击重置按钮，重置登录表单，在这个方法中this是组件的实例对象
      this.$refs.loginFormRef.resetFields() //$ref就是这个组件的属性名称为ref值为loginFormRef的对象即表单对象，执行重置方法
    },
    login(){
      this.$refs.loginFormRef.validate( async valid=>{//valid是回调函数输入的参数，因为这里只有一个形参，所以把小括号去掉了
        if(!valid) return ;//当符合上面的定义的rules时valid是true否则就是false,为false时不发送请求
        const {data:res} =await this.$http.post('login',this.loginForm) //如果格式错误的话就直接return，格式正确才能执行到这。
        //配置好axios后就可以根据接口文档来发起请求了，接口文档要求post请求，路径login，需要发送username和password
        if(res.meta.status !==200) return this.$message.error('登录失败:'+res.meta.msg)
        this.$message.success('登录成功！')
        window.sessionStorage.setItem('token',res.data.token) //将token保存到sessionStorage中
        this.$router.push('/home')//将页面跳转为/home
      })
    }
  }
}
</script>

<style lang="less" scoped>/*scoped是vue的指令，用来控制组件的生效区间，加上scoped，样式只在当前组件内生效，从而防止组件之间的样式冲突*/
//加上lang="less"就可以使用less相关语法，如语法嵌套等，不过需要去ui中添加less-loader和less开发依赖
.login_container{
  //background-color:#2b4b6b;
  background-image: url("../assets/background.png");
  background-repeat: no-repeat;
  background-size: 100%;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  /*这一行的指令是向左上各移动自身宽高的50%，因为上面设置的left是50%意味着盒子的最左边距离边界50%，再向左移动自身的50%就可以在正中间了*/
.avatar_box{ /*less的语法嵌套*/
  height: 130px;
  width: 130px;
  padding: 10px;//为了更好看一些，加了一个padding使图片和登录的框有一定距离
  border-radius: 50%; //将外层的div也变圆
  box-shadow: 0 0 10px #ddd; //添加阴影
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #dddddd;
  img{
    width: 100%;
    height: 100%; /*图像的长宽直接等于父盒子的长宽*/
    border-radius: 50%;//使图片变成一个圆角的图片
    background-color: #eee;
  }
}
}
.btns{
  display: flex; //弹性模型
  justify-content: flex-end;//尾部对其
}
.login_form{
  position:absolute;
  bottom: 0;
  width:100%;
  padding:0 30px;//padding上下0左右30
  box-sizing: border-box;
}
</style>
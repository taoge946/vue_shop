<template>
  <div>
<!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>
<!--    卡片视图区-->
    <el-card >
<!--      搜索与添加区域-->

      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

<!--      用户列表区-->
      <el-table :data="userList" border stripe> <!--data绑定数据源-->
        <el-table-column type="index"></el-table-column> <!--这是索引列-->
        <el-table-column label="姓名" prop="username"></el-table-column><!--label是列名，prop是使用数据源中键值为这个的数据做填充-->
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
<!--            {{scope.row}}&lt;!&ndash;通过作用域插槽接收scope，解出来row这个属性，就代表这一行对应的数据，然后就可以根据数据解出来状态具体的值&ndash;&gt;-->
            <el-switch
                v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
<!--            分别是修改，删除，分配角色按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="RemoveUserById(scope.row.id)"></el-button>

            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false" >
              <el-button type="danger" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
<!--    size-change 函数 是绑定每页显示多少数据的函数，可以在这里面拿到最新的pagesize
        current-change 函数 是当前页码发生变化时触发的函数
        current-page 数值 是当前展示的第几页的数据，可以通多data中的queryInfo中的pagenum来获取
        page-sizes 数组 就是提供每页显示多少条的切换
        page-size 数值 动态绑定到pagesize上
        layout是用来指定页面上展示哪些组件
          total 数值 在页面上展示一共多少条
  -->
    </el-card>
<!--    添加用户的对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
        >
      <!--内容主体区-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
               label-width="70px" >
        <el-form-item label="用户名" prop="username"> <!--prop为指向的校验规则-->
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部的按钮区-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改用户的对话框-->
    <el-dialog
        title="修改用户"
        :visible.sync="editDialogvisible"
        width="50%"
        >
      <el-form :model="editForm" :rules="editFormRules" ref="addFormRef"
               label-width="70px" >
        <el-form-item label="用户名" > <!--prop为指向的校验规则-->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogvisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
<!--    分配角色的对话框-->
    <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
        >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <!--下拉组件,v-model绑定的是最后选择的值(这里面就是最后选中的item.id的值),key是绑定的id，label是显示的值，value是最后传过去的值-->
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data(){
    //验证手机号的自定义规则,三个参数分别为规则对象，待校验的value值以及回调函数,使用正则表达式进行验证
    var checkMobile=(rule,value,callback)=>{
      //验证手机号的正则表达式：
      const regMobile=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if(regMobile.test(value)){
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return{
      //获取用户列表的参数对象
      queryInfo:{
        query:'', //搜索关键字
        pagenum:1, //当前页数
        pagesize:1 //初始当前每页显示多少条数据
      },
      userList:[],
      total:0,
      addDialogVisible:false,//控制添加用户对话框的显示与隐藏，当点击添加按钮时将其变为true，输入完成时变为false
      editDialogvisible:false,//控制修改对话框的显示与隐藏
      setRoleDialogVisible:false,//控制分配权限的对话框的显示与否
      userInfo:'',//需要被分配角色的用户信息
      rolesList:[],//所有角色的数据列表
      selectRoleId:'',//选中的角色id值
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      } ,//添加的用户的数据对象
      editForm:{ //编辑时查询到的用户信息对象

      },
      addFormRules:{//添加表单的验证规则对象
        username:[
          {
            required:true, //验证规则：验证是否为空
            message:'请输入用户名',//如果不满足则发送的提示信息
            trigger:'blur' //在失去焦点时验证
          },{
          min:3,max:10, //验证规则，验证输入长度
            message:'用户名的长度在3到10个长度之间',
            trigger: 'blur'//触发验证的时机
    }
        ],
        password:[
          {
            required:true, //验证规则：验证是否为空
            message:'请输入密码',//如果不满足则发送的提示信息
            trigger:'blur' //在失去焦点时验证
          },{
            min:6,max:15, //验证规则，验证输入长度
            message:'密码的长度在6到15个长度之间',
            trigger: 'blur'//触发验证的时机
          }
        ],
        email:[{
          required:true, //验证规则：验证是否为空
          message:'请输入用户邮箱',//如果不满足则发送的提示信息
          trigger:'blur' //在失去焦点时验证
        },
          {type:'email',
          message: '请输入正确的邮箱格式',
          trigger: ['blur','change']}
        ],
        mobile: [{
          required:true, //验证规则：验证是否为空
          message:'请输入用户手机',//如果不满足则发送的提示信息
          trigger:'blur' //在失去焦点时验证
        },
          {
            validator:checkMobile,
            trigger: ['blur','change']
          }]
      },
      editFormRules:{
        email:[{
          required:true, //验证规则：验证是否为空
          message:'请输入用户邮箱',//如果不满足则发送的提示信息
          trigger:'blur' //在失去焦点时验证
        },
          {type:'email',
            message: '请输入正确的邮箱格式',
            trigger: ['blur','change']}
        ],
        mobile: [{
          required:true, //验证规则：验证是否为空
          message:'请输入用户手机',//如果不满足则发送的提示信息
          trigger:'blur' //在失去焦点时验证
        },
          {
            validator:checkMobile,
            trigger: ['blur','change']
          }]
      }

    }
  },
  created() {
  this.getUserList()
  },
  methods:{
    async getUserList(){//ajax请求会返回一个promise对象，为了简化数据的处理，使用async和await进行简化,使用await就会直接获取一个数据对象，直接对这个数据对象进行解构赋值就可以找到想要的值
      const {data:res}=await this.$http.get('users',{params:this.queryInfo}) //get要携带参数必须是这样的形式，this.queryInfo就是携带的参数对象。
      console.log(`res:`)
      console.log(res)
      if(res.meta.status!==200) return this.$message.error('获取用户列表失败')
      this.userList=res.data.users
      this.total=res.data.total
    },
    //监听pagesize改变的函数
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize;
      this.getUserList()
},
    //监听页码值发生改变的函数，能够拿到最新的页码值
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getUserList()
    },
    //监听switch状态的改变
    async userStateChange(userInfo){
      console.log(userInfo)
      const {data:res}=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status!==200){
        userInfo.mg_state=!userInfo.mg_state //修改失败的话就是并没有成功的将数据库中对应的数据完成修改，所以前端页面上应该也给他改回去
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('状态更新成功')
    },
    //监听添加用户对话框关闭事件
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮添加新用户
    addUser(){
      this.$refs.addFormRef.validate( async valid=>{
        if(!valid) return //如果验证不通过直接就跳出去了
        //下面的就是通过的情况
        const {data:res}=await this.$http.post('users',this.addForm)
        if(res.meta.status!==201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible=false//添加成功后将对话框隐藏
        this.getUserList() //刷新列表
      })
    },
    //展示编辑用户的对话框
    async showEditDialog(id){
      const {data:res}=await this.$http.get('users/'+id)
      if(res.meta.status!==200){
        return this.$message.error('查询用户信息失败')
      }
      this.editForm=res.data
      this.editDialogvisible=true
    },
    //修改用户信息并提交
    editUserInfo(){
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return
        const {data:res}=await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile})
        if(res.meta.status!==200){
          return this.$message.error('更新用户信息失败')
        }
        this.editDialogvisible=false
        this.getUserList()
        this.$message.success('更新数据成功！')
      })

    },
    // 根据id删除对应的用户信息
    async RemoveUserById(id){
      //不应该直接删除，应该先弹框询问是否进行删除
      const confirmResult=await this.$confirm('此操作将永久删除该权限 , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)//如果箭头函数只有一行的话，花括号可以去掉，return也得省略掉
      //console.log(confirmResult)//如果确认删除则返回的是字符串confirm，没加catch之前会报错，加了之后就会捕获错误，报的cancel
      if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res}=await this.$http.delete('users/'+id)
      if(res.meta.status!==200){
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    async setRole(userInfo){ //展示分配角色的对话框
      this.userInfo=userInfo
      //在展示对话框之前，获取所有角色的列表
      const{data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList=res.data
      this.setRoleDialogVisible=true
    },
    //点击按钮，分配角色到用户
    async saveRoleInfo(){
      //如果用户没有选的话
      if(!this.selectRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const {data:res} =await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
      if(res.meta.status!==200){
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible=false
    },
    //分配角色对话框的关闭事件,关闭了后就将相关参数全重置
    setRoleDialogClosed(){
      this.selectRoleId=''
      this.userInfo={}
    },
  }
}
</script>

<style scoped>

</style>
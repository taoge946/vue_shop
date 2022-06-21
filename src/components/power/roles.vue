<template>
<div>
  <!--  面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!--在第一行第一列添加一个按钮-->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
      </el-col>
    </el-row>
<!--    角色列表区-->
  <el-table :data="roleList" border stripe>
<!--    展开列-->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row :class="['bdbottom',i1===0? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
<!--          渲染一级权限,span=5表示占5列-->
          <el-col :span="5">
            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
<!--          渲染二级和三级权限-->
          <el-col :span="19">
<!--            通过for循环嵌套渲染2级权限-->
            <el-row :class="[i2===0? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
              <el-col :span="6">
                <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="13">
                <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>

        </el-row>
<!--        <pre>{{scope.row}}</pre>-->
      </template>
    </el-table-column>
<!--    索引列-->
    <el-table-column type="index"></el-table-column>
    <el-table-column label="角色" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" width="300px"><!--强制指定一个宽度可以让按钮都在一行显示-->
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleInfo(scope.row.id)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row.id)">删除</el-button>
        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
<!--  添加角色-->
  <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="70%"
      >
    <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef">
      <el-form-item label="角色" prop="roleName">
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" >
        <el-input v-model="addRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="uploadRole">确 定</el-button>
  </span>
  </el-dialog>
<!--  修改角色-->
  <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="70%"
  >
    <el-form :model="editRoleForm" :rules="addRoleFormRules" ref="editRoleFormRef">
      <el-form-item label="角色" prop="roleName">
        <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" >
        <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="uploadEditRole">确 定</el-button>
  </span>
  </el-dialog>
<!--  分配权限-->
  <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setDialogClosed"
  >
<!--    树形控件 :data是数据源，提供数据绑定,:props指定数据绑定的字段，需要自己根据需要定义-->
    <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
   <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "roles",
  data(){
    return{
      roleList:[],//所有角色的列表
      addRoleDialogVisible:false,
      editRoleDialogVisible:false,
      setRightDialogVisible:false,
      addRoleForm:{
        roleName:'',
        roleDesc:'',
      },
      editRoleForm:{},
      rightsList:[],//所有权限的数据
      defKeys:[], //渲染时默认是选中状态的节点的id值
      roleId:'',//当前即将分配权限的角色id
      addRoleFormRules:{
        roleName:[
          {
            required:true,
            message:'请输入角色名',//如果不满足则发送的提示信息
            trigger:'blur' //在失去焦点时验证
          }
        ]
      },
      treeProps:{//树形控件的属性绑定对象
        label:'authName', //从数据源中拿到authName属性并展示
        children:'children' //父子节点是通过children属性实现嵌套的
      },

    }
  },
  created() {
    this.getRolesList()
  },
  methods:{
    async getRolesList(){ //获取所有角色的列表
      const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取角色列表失败')
      }
      this.roleList=res.data
    },
    uploadRole(){
      this.$refs.addRoleFormRef.validate( async valid=>{
        if(!valid) return this.$message.error('请按照要求进行填写')//如果验证不通过直接就跳出去了
        //下面的就是通过的情况
        const {data:res}=await this.$http.post('roles',this.addRoleForm)
        if(res.meta.status!==201){
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addRoleDialogVisible=false//添加成功后将对话框隐藏
        this.getRolesList()
    })
    },
    async editRoleInfo(id){
      const {data:res}=await this.$http.get('roles/'+id)
      if(res.meta.status!==200){
        return this.$message.error('获取角色信息失败')
      }
      this.editRoleForm=res.data
      this.editRoleDialogVisible=true
    },
    uploadEditRole(){
      this.$refs.editRoleFormRef.validate(async valid=>{
        if (!valid) return this.$message.error('请按照指定格式填写')
        const {data:res}=await this.$http.put('roles/'+this.editRoleForm.roleId, {
          roleName:this.editRoleForm.roleName,
          roleDesc:this.editRoleForm.roleDesc})
        if(res.meta.status!==200){
          return this.$message.error('提交角色修改失败')
        }
        this.editRoleDialogVisible=false
        this.getRolesList()
        this.$message.success('角色修改成功！')

      })
    },
    async delRole(id){
      const{data:res}=await this.$http.delete('roles/'+id)
      if(res.meta.status!==200){
        return this.$message.error('删除失败')
      }
      this.getRolesList()
      this.$message.success('删除成功')
    },
    //根据id删除对应的权限
    async removeRightById(role,rightId){
      //弹窗提示用户是否要删除
      const confirmResult=await this.$confirm('此操作将永久删除该角色下的权限 , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(confirmResult!=='confirm'){
        return this.$message.info('取消了删除')
      }
      const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status!==200){
        return this.$message.error('删除角色权限失败')
      }
      //this.getRolesList()
      role.children=res.data
    },
    //展示分配权限的对话框
    async showSetRightDialog(role){
      this.roleId=role.id
      //获取所有权限的数据
      const {data:res}=await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList=res.data//将获取到的权限数据保存到data中
      //递归三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible=true
    },
    getLeafKeys(node,arr){ //通过递归的形式获取角色下所有三级权限的id并保存到数组中
      //如果当前节点不包含children属性，那就是三级权限节点，将id值保存到数组中
      if(!node.children){
        return arr.push(node.id)
      }
      //如果不是三级权限则使用递归将子节点继续调用直到找到3级权限
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    //监听分配权限对话框的关闭事件
    setDialogClosed(){
      this.defKeys=[]
    },
    //点击提交分配好的权限到后端
    async allotRights(){
      const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),//...是展开运算符，会将后面的数组中的所有内容展开变成一项一项的再放入一个新的数组中
          ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible=false
    },
  }
}
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdbottom{
  border-bottom: 1px solid #eeeeee;
}
.vcenter{ /*需要纵向居中的类的标签*/
  display: flex;
  align-items: center;
}
</style>
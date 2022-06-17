import Vue from 'vue'
import { Button } from 'element-ui'
import { Form ,FormItem} from 'element-ui'
import { Input } from 'element-ui'
import { Message} from "element-ui"; //导入弹框提示组件
import { Container,Header,Aside,Main,
    Menu,Submenu,MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
} from "element-ui";


Vue.use(Button) //在导入之后还需要将它们注册为全局可用的组件
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)


Vue.prototype.$message=Message //这个组件必须在Vue全局挂载，$message的名字不要求，合法就行，但是后面必须是Message
//就是把弹窗组件挂载到了Vue的原型上，这样的话每一个组件都可以直接通过this访问到$message
Vue.prototype.$confirm=MessageBox.confirm //MessageBox也比较特殊，不在vue.use中进行挂载
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-people"></i> 
                    <span style="font-size: 25;">用户管理</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>


                <el-select v-model="query.status" clearable placeholder="状态" filterable class="handle-select mr10">
                    <el-option key="1" label="有效" value="有效"></el-option>
                    <el-option key="2" label="无效" value="无效"></el-option>
                    <el-option key="3" label="其他" value="其他"></el-option>                                   
                </el-select>
               

                <el-select v-model="query.authority" 
                            clearable placeholder="权限" 
                            filterable class="handle-select mr10">
                    <el-option key="1" label="admin" value="admin"></el-option>
                    <el-option key="2" label="user" value="user"></el-option>
                </el-select>

                <el-select v-model="query.userName" 
                            clearable placeholder="姓名" 
                            filterable class="handle-select-name mr10"
                            @focus="getname()"
                            >
                    <el-option v-for="item in this.namelist"
                                    :key="item"
                                    :value="item">
                    </el-option>
                </el-select>



                <el-button type="primary" icon="el-icon-aim" @click="handleSearch">搜索</el-button>

                <el-button
                    type="primary"
                    icon="el-icon-full-screen"
                    class="handle-del mr10"
                    @click="all()"
                >全部</el-button>

                <el-button
                    type="success"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="handleInsert"
                >新增用户</el-button>

                <!-- <el-button type="primary" @click="post()">测试post</el-button> 这里的不对editId -->

            </div>

            <!-- 表格在这里 -->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column> <!-- 多选框 -->
                <!-- <el-table-column prop="id" label="ID" width="40" align="center"></el-table-column> ID栏 -->
                <el-table-column prop="userNo" label="编号" width="80" align="center" sortable></el-table-column>
                <el-table-column prop="userName" label="姓名" align="center" sortable></el-table-column>
                <el-table-column prop="password" label="密码"  align="center"></el-table-column>
                <el-table-column prop="authority" label="权限" width="80" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话"  align="center"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" sortable></el-table-column>
                <!-- 表格在这里 -->
           
                <!--功能按钮-->
                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row, scope.row.id)" 
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row,scope.row.id)"
                        >删除</el-button>
                        <!-- 这里的scope获取了每行信息在数据库中的主键id -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格在这里 -->

            <!-- 分页在这里 -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next "
                    :current-page.sync="query.page"
                    :page-size="query.pagesize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
            <!-- 分页在这里 -->

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑用户" :visible.sync="editVisible" width="25%">

            <div style="padding-left: 90px;padding-bottom: 20px;">
                    编号：{{form.userNo}}
            </div>            
            <div style="padding-left: 90px;padding-bottom: 20px;">
                    姓名：{{form.userName}}
            </div>
            <el-form ref="form" :model="form" label-width="70px" style="padding-left: 5px;" :rules="rules">
                
            <el-form-item prop="password">
                <div style="padding-left: 10px;" > 
                    密码：
                        <el-input v-model="form.password" placeholder="请输入内容"  style="width: 35%;"></el-input>
                </div>
            </el-form-item>

            <el-form-item prop="authority">
                <div style="padding-left: 25px;" border="2px solid red">
                    权限：
                    <el-select v-model="form.authority" clearable placeholder="请选择权限" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="0" label="admin" value="admin"></el-option>
                        <el-option key="1" label="user" value="user"></el-option>
                    </el-select>
                </div>
                </el-form-item>

                <el-form-item prop="status">
                <div style="padding-left: 25px;" border="2px solid red">
                    状态：
                    <el-select v-model="form.status" clearable placeholder="请选择状态" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="1" label="有效" value="无效"></el-option>
                        <el-option key="2" label="无效" value="无效"></el-option>
                        <el-option key="3" label="其他" value="其他"></el-option> 
                    </el-select>
                </div>
            </el-form-item>

            <el-form-item prop="phone">
                    <div style="padding-left: 10px;"> 
                    电话：
                        <el-input v-model="form.phone" placeholder="请输入电话"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>                
            </el-form>

            <!--按钮-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>

                <el-button type="primary" @click="saveEdit(editId)">确 定</el-button> <!--这里的不对editId-->
                
            </span>

        </el-dialog>

        <!--新增弹出框-->
        <el-dialog title="新增用户" :visible.sync="insertVisible" width="30%">

            <el-form ref="insertForm" :model="insert" label-width="70px" style="padding-left: 5px;" :rules="rules">
                
                <el-form-item prop="userNo">
                    <div style="padding-left: 10px;" > 
                    编号：
                        <el-input v-model="insert.userNo" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="userName">
                    <div style="padding-left: 10px;" >
                    姓名：
                        <el-input v-model="insert.userName" placeholder="请输入内容"  style="width: 50%;"></el-input>
                    </div>
                </el-form-item>
                
                <el-form-item prop="password">
                    <div style="padding-left: 10px;" > 
                    密码：
                        <el-input v-model="insert.password" placeholder="请输入密码"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="authority">
                <div style="padding-left: 25px;" border="2px solid red">
                    权限：
                    <el-select v-model="insert.authority" clearable placeholder="请选择权限" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="0" label="admin" value="admin"></el-option>
                        <el-option key="1" label="user" value="user"></el-option>
                    </el-select>
                </div>
                </el-form-item>

            <el-form-item prop="status">
                <div style="padding-left: 25px;" border="2px solid red">
                    状态：
                    <el-select v-model="insert.status" clearable placeholder="请选择状态" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="1" label="有效" value="有效"></el-option>
                        <el-option key="2" label="无效" value="无效"></el-option> 
                        <el-option key="2" label="其他" value="其他"></el-option>
                    </el-select>
                </div>
            </el-form-item>

            <el-form-item prop="image">
                    <div style="padding-left: 10px;"> 
                    图片：
                        <el-input v-model="insert.image" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>
                
                <el-form-item prop="phone">
                    <div style="padding-left: 10px;"> 
                    电话：
                        <el-input v-model="insert.phone" placeholder="请输入电话"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button @click="resetForm('insertForm')">重置</el-button>
                <el-button type="primary" @click="submitForm('insertForm')">确 定</el-button> <!--这里的不对editId-->
            </span>
        
        </el-dialog>

    </div>
</template>

<script>


//import {deleteT,updateData1} from '../../api/index';
import {userDelete,userinsert,userupdate} from '../../api/index';
import {prolist,userselect,selectname} from '../../api/index';
import {postTest} from '../../api/index';


export default {
    name: 'basetable',
    data() {
        return {
            query: {
                userName:'',
                authority:'',
                status:'',
                page:1,
                pagesize:8
            },
            tableData: [],
            multipleSelection: [],
            multipleSelectionId: [],//new
            delList: [],
            editVisible: false,
            insertVisible: false,
            pageTotal: 0,
            form: {
                userName:'',
                userNo:'',
                password:'',
                authority:'',
                status:'',
                phone:''
            },
            idx: -1,
            id: -1,
            testId: '',
            formData: '',
            searchData:[],
            selectExecutor:"",
            editId:'',
            missionCount:'',
            edit:{
                status:'',
                executorName:''
            },
            //时间选择器数据
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, 
                {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, 
                {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            editTime:'',
            editTime1:'',
            insert:{
                
                userNo:'',
                userName:'',
                password:'',
                authority:'',
                status:'',
                image:'',
                phone:''

            },
            namelist:[],

            
            //insert表单的规则
            //props和rules名字要与变量的名字保持一致
            rules: {
                
                userNo:[
                        { required: true, message: '请输入用户编号', trigger: 'blur' },
                        { required: true, pattern: /^[1-9]\d*$/, message: '用户编号应为数字', trigger: 'blur' },
                        { min: 1, max:5, message: '长度应在 1 到 5 个字符', trigger: 'blur' }
                ],
                userName:[
                        { required: true, message: '请输入用户姓名', trigger: 'blur' },
                        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max:20, message: '长度应在 6 到 20 个字符', trigger: 'blur' }
                ],
                authority:[
                    { required: true, message: '请选择权限', trigger: 'change' },
                    
                ],
                status:[
                    { required: true, message: '请选择状态', trigger: 'change' },
                    // { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                image:[
                    { required: true, message: '请输入图片地址', trigger: 'blur' },
                ],

                phone:[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { required: true, pattern: /^[1-9]\d*$/, message: '电话号码应为数字', trigger: 'blur' },
                    // { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                                
                }

            };

    },
    created() {
        this.getData();
                
    },
    methods: {

        // post(){
        //     postTest().then(res=>{
        //         console.log(res);
        //     })

        // },

        getpro(){

            prolist().then(res=>{
                this.projectlist=res;
            })
        },
        
        getData() {

            userselect(this.query).then(res =>{
                this.tableData=res.list;
                this.pageTotal = res.pageTotal ;//|| 50;
            })

        },
        getdepartment(){

            selectname().then(res=>{
                this.departmentlist=res;
                //alert(this.departmentlist);
            })
        },
        getname(){
            selectname().then(res=>{
                this.namelist=res;
            })
        },
        all(){
            
                this.$set(this.query, 'page', 1);
                this.query.authority='';
                this.query.userName='';
                this.query.status='';
                userselect(this.query).then(res =>{
                    this.tableData=res.list;
                    this.pageTotal = res.pageTotal ;//|| 50;
                })
        },
        // 触发搜索按钮this.query.status='';
        handleSearch() {
            this.$set(this.query, 'page', 1);
                this.missionCount = 1;
                userselect(this.query).then(res =>{
                this.tableData=res.list;
                this.pageTotal = res.pageTotal; //去掉了 || 50;
            })
        },
        selectPage(){
            selectPage(0,10).then(res=>{
                this.tableData = res.list;
            });
        },
        // 删除操作
        handleDelete(index, row, rowId) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);

                    userDelete(rowId);

                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {

            //清空上一次的多选情况
            //因为这一次可能有多选项被取消选中
            this.multipleSelection = [];
            this.multipleSelectionId = [];       

            //alert(index);
           
            this.multipleSelection = val;//原始的
            //alert(this.multipleSelection);

            val.forEach((element) => {
                this.multipleSelectionId.push(element.id);
            });
                                 
        },
        delAllSelection() {

            const length = this.multipleSelectionId.length;
            let str = '';
            let str1 = '';
            let num = length;
            this.delList = this.delList.concat(this.multipleSelectionId);
            //alert(this.delList);
            for (let i = 0; i < length; i++) {
                if(i != num - 1){
                    str += this.multipleSelectionId[i] + ',';//str为ID
                    str1 +=this.multipleSelection[i].userNo +'、';
                }
                else{
                    str += this.multipleSelectionId[i];
                    str1 +=this.multipleSelection[i].userNo;
                }
            }
            userDelete(str);

            //this.$message.error(`删除了${str}`);
            this.$message.error(`删除了用户${str1}，共${num}条数据`);
            //this.$message.error(`删除了`);

            this.multipleSelection = [];


        },
        // 编辑操作
        handleEdit(index, row, id) {
            //index 只是这条数据在前端中的数值
            this.idx = index;
            this.form = row;
            //alert(this.form.phone)
            this.editVisible = true;
            this.editId=id;
        },

        
        // 保存编辑
        saveEdit(editId) {

            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);

            userupdate(this.form);
            //打补丁，否则修改第二个信息的时候会显示第一次输入                   
        },

        handleInsert() {
           
            this.insertVisible = true;

        },
        
        submitForm(insertForm) {
        this.$refs[insertForm].validate((valid) => {
            if (valid) {
                
                userinsert(this.insert);
                
                this.insertVisible = false;
                this.insert={};

            } else {
                //console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(insertForm) { //重置表单内容
            this.$refs[insertForm].resetFields();

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },

    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-select-name {
    width: 180px;
}

.handle-input {
    width: 150px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

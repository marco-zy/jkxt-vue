<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 
                    <span style="font-size: 25;">任务管理</span>
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
                    <el-option key="1" label="未生效" value="未生效"></el-option>
                    <el-option key="2" label="未执行" value="未执行"></el-option>
                    <el-option key="3" label="已执行" value="已执行"></el-option>
                    <el-option key="4" label="其他" value="其他"></el-option>                                   
                </el-select>
               

                <el-select v-model="query.createDepartment" 
                            clearable placeholder="发布单位" 
                            filterable class="handle-select mr10"
                            @focus="getdepartment()"
                            >
                    <el-option v-for="item in this.departmentlist"
                                    :key="item"
                                    :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="query.executorName" 
                            clearable placeholder="执行人" 
                            filterable class="handle-select mr10"
                            @focus="getexecutor()"
                            >
                    <el-option v-for="item in this.executorlist"
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
                >新增任务</el-button>

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
                
                <el-table-column prop="missionNo" label="编号" width="80" align="center" sortable></el-table-column>
                <el-table-column prop="missionName" label="名称" width="60" align="center"></el-table-column>
                <el-table-column prop="projectId" label="所属项目" width="60" align="center" ></el-table-column>

                <el-table-column prop="createDepartment" label="发布单位" width="70" align="center"></el-table-column>
                <el-table-column prop="executor" label="执行人" width="70" align="center"></el-table-column>
                <el-table-column prop="executeTime" label="执行时间" align="center" sortable></el-table-column>
                <el-table-column prop="finishTime" label="完成时间" align="center" sortable></el-table-column>
                <el-table-column prop="status" label="状态" width="80" align="center">
                </el-table-column>
                <el-table-column prop="deviceId" label="关联设备"  width="60" align="center"></el-table-column>
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
        <el-dialog title="编辑任务" :visible.sync="editVisible" width="30%">
           
            <el-form ref="form" :model="form" label-width="70px" style="padding-left: 5px;" :rules="rules">
                                 
            <el-form-item>
                <div style="padding-left: 10px;"> 
                    执行人：
                    <el-input v-model="form.executor" placeholder="请输入内容"  style="width: 35%;"></el-input>
                </div>
            </el-form-item>

            <el-form-item >
                <div style="padding-left: 25px;" border="2px solid red">
                    状态：
                    <el-select v-model="form.status" clearable placeholder="状态" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="1" label="未生效" value="未生效"></el-option>
                        <el-option key="2" label="未执行" value="未执行"></el-option>
                        <el-option key="3" label="已执行" value="已执行"></el-option>
                        <el-option key="4" label="其他" value="其他"></el-option>
                    </el-select>
                </div>
            </el-form-item>
                              
            <el-form-item prop="editTime">
                <div class="block" padding-bottom="10px">
                    <span class="demonstration">执行时间：</span>
                    <el-date-picker
                    v-model="form.executeTime"
                    type="datetime"
                    placeholder="选择执行时间"
                    align="right"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    style="width: 50%;">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item prop="editTime1">
                <div class="block" margin-bottom="0"  >
                    <span class="demonstration">完成时间：</span>
                    <el-date-picker
                    v-model="form.finishTime"
                    type="datetime"
                    placeholder="选择完成时间"
                    align="right"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    style="width: 50%;">
                    </el-date-picker>
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
        <el-dialog title="新增任务" :visible.sync="insertVisible" width="30%">

            <el-form ref="insertForm" :model="insert" label-width="70px" style="padding-left: 5px;" :rules="rules">
                
                <el-form-item prop="no">
                    <div style="padding-left: 10px;" > 
                    编号：
                        <el-input v-model="insert.no" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="name">
                    <div style="padding-left: 10px;" > 
                    名称：
                        <el-input v-model="insert.name" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>
<!-- 
                <el-form-item prop="projectId">
                    <div style="padding-left: 10px;"> 
                    所属项目：
                        <el-input v-model="insert.projectId" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item> -->

                <el-form-item prop="projectId">
                    <div style="padding-left: 25px;" border="2px solid red">
                    所属项目：
                        <el-select v-model="insert.projectId" 
                            clearable placeholder="项目列表" 
                            filterable class="handle-select mr10"
                            @focus="getpro();"
                            >
                            <el-option  v-for="item in this.projectlist"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                            </el-option>

                        </el-select>
                </div>  

                </el-form-item>

                <el-form-item prop="createDepartment">
                <div style="padding-left: 25px;" border="2px solid red">
                    发布单位：
                    <el-select v-model="insert.createDepartment" clearable placeholder="发布单位" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="0" label="济南局" value="0"></el-option>
                        <el-option key="1" label="济宁局" value="1"></el-option>
                        <el-option key="2" label="超高压" value="3"></el-option>
                        <el-option key="3" label="其他" value="3"></el-option>
                    </el-select>
                </div>
                </el-form-item>


                <el-form-item prop="executor">
                    <div style="padding-left: 10px;"> 
                    执行人：
                        <el-input v-model="insert.executor" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

            <el-form-item prop="status">
                <div style="padding-left: 25px;" border="2px solid red">
                    状态：
                    <el-select v-model="insert.status" clearable placeholder="状态" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="1" label="未生效" value="未生效"></el-option>
                        <el-option key="2" label="未执行" value="未执行"></el-option>
                        <el-option key="3" label="已执行" value="已执行"></el-option>
                        <el-option key="4" label="其他" value="其他"></el-option>
                    </el-select>
                </div>
            </el-form-item>

            <el-form-item prop="deviceId">
                    <div style="padding-left: 10px;"> 
                    关联设备：
                        <el-input v-model="insert.deviceId" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>
            <!-- </el-form>

            <el-form :model="insert1" form="insertForm1" label-width="70px" style="padding-left: 5px;" :rules="rules">  -->
                <el-form-item prop="insertTime">
                    <div class="block" padding-bottom="10px">
                        <span class="demonstration">执行时间：</span>
                        <el-date-picker
                        v-model="insert.insertTime"
                        type="datetime"
                        placeholder="选择执行时间"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        style="width: 50%;">
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item prop="insertTime1">
                    <div class="block" margin-bottom="0"  >
                        <span class="demonstration" >完成时间：</span>
                        <el-date-picker
                        v-model="insert.insertTime1"
                        type="datetime"
                        placeholder="选择完成时间"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        style="width: 50%;">
                        </el-date-picker>
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


import {deleteT,updateData1} from '../../api/index';
import {prolist} from '../../api/index';
import {missionSelect,insertT,selectdepartment,selectexecutor} from '../../api/index';


export default {
    name: 'basetable',
    data() {
        return {
            query: {
                executorName:'',
                createDepartment:'',
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
                executeTime:'',
                finishTime:'',
                status:'',
                executor:'',

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
                no:'',
                name:'',
                projectId:'',
                createDepartment:'',
                executor:'',
                status:'',
                deviceId:'',
                insertTime:'',
                insertTime1:'', 
            },
            departmentlist:[],
            executorlist:[],
            projectlist:[],
            
            //insert表单的规则
            rules: {
                no: [
                        { required: true, message: '请输入任务编号', trigger: 'blur' },
                        { required: true, pattern: /^[1-9]\d*$/, message: '任务编号应为数字', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                name:[
                        { required: true, message: '请输入任务名称', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                projectId:[
                        { required: true, message: '请输入所属项目ID', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                createDepartment:[
                    { required: true, message: '请输入发布单位', trigger: 'change' },
                    
                ],
                executor:[
                    { required: true, message: '请输入执行人', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                status:[
                    { required: true, message: '请输入状态', trigger: 'change' },
                    // { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                deviceId:[
                    { required: true, message: '请输入关联设备ID', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                insertTime:[
                    { type: 'string', message: '请选择执行时间', trigger: 'change' }
                ],
                insertTime1:[
                    { type: 'string', message: '请选择完成时间', trigger: 'change' }
                ]
                                
                }

            };

    },
    created() {
        this.getData();
                
    },
    methods: {

        getpro(){

            prolist().then(res=>{
                this.projectlist=res;
            })
        },
        
        getData() {

            missionSelect(this.query).then(res =>{
                this.tableData=res.list;
                this.pageTotal = res.pageTotal ;//|| 50;
            })

        },
        getdepartment(){

            selectdepartment().then(res=>{
                this.departmentlist=res;
                //alert(this.departmentlist);
            })
        },
        getexecutor(){
            selectexecutor().then(res=>{
                this.executorlist=res;
            })
        },
        all(){
            
                this.$set(this.query, 'page', 1);
                this.query.createDepartment='';
                this.query.executorName='';
                this.query.status='';
                missionSelect(this.query).then(res =>{
                    this.tableData=res.list;
                    this.pageTotal = res.pageTotal ;//|| 50;
                })
        },
        // 触发搜索按钮this.query.status='';
        handleSearch() {
            this.$set(this.query, 'page', 1);
                this.missionCount = 1;
                missionSelect(this.query).then(res =>{
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

                    deleteT(rowId);

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
                    str1 +=this.multipleSelection[i].missionNo +'、';
                }
                else{
                    str += this.multipleSelectionId[i];
                    str1 +=this.multipleSelection[i].missionNo;
                }
            }
            deleteT(str);

            //this.$message.error(`删除了${str}`);
            this.$message.error(`删除了任务${str1}，共${num}条数据`);
            //this.$message.error(`删除了`);

            this.multipleSelection = [];


        },
        // 编辑操作
        handleEdit(index, row, id) {
            //index 只是这条数据在前端中的数值
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.editId=id;
        },
        
        // 保存编辑
        saveEdit(editId) {

            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            //updateData(editId,this.form.status,this.form.executorName,this.editTime,this.editTime1);

            updateData1(this.form);

            //打补丁，否则修改第二个信息的时候会显示第一次输入
            this.editTime='';
            this.editTime1='';
                     
        },

        handleInsert() {
           
            this.insertVisible = true;

        },
        
        submitForm(insertForm) {
        this.$refs[insertForm].validate((valid) => {
            if (valid) {
                
                insertT(this.insert);
                
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

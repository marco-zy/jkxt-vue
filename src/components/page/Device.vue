<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-monitor"></i> 
                    <span style="font-size: 25;">设备管理</span>
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

<!-- 有bug 选项key值的匹配有问题-->
                <el-select v-model="query.status" clearable placeholder="状态" filterable class="handle-select mr10">
                    <el-option key="1" label="已绑定" value="已绑定"></el-option>
                    <el-option key="2" label="未绑定" value="未绑定"></el-option>                                  
                </el-select>


                <el-select v-model="query.projectNo" clearable 
                    placeholder="绑定项目" 
                    filterable 
                    class="handle-select mr10"
                    v-if="query.status!='未绑定'">
                    <el-option v-for="item in projectlist" 
                        :value="item"
                        :key="item"
                        @focus="this.getproject()"
                        ></el-option>                               
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
                >新增设备</el-button>

            </div>

            <!-- 表格在这里 -->
            <el-table
                :data.sync="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                :key="bomCheckKey"
                :row-class-name="tableRowClassName"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column> <!-- 多选框 --> 

                <el-table-column prop="deviceName" label="名称" width="80" align="center" sortable></el-table-column>
                <el-table-column prop="channel" label="通道"  align="center" sortable></el-table-column>
                <el-table-column prop="deviceNo" label="设备编号"  align="center"></el-table-column>
                <el-table-column prop="storage" label="存储路径" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="80"></el-table-column>
                <el-table-column prop="projectNo" label="项目编号" width="110" align="center" sortable></el-table-column>
                <el-table-column prop="createTime" label="创建时间"  align="center" sortable></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"  align="center" sortable></el-table-column>
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
        <el-dialog title="编辑设备" :visible.sync="editVisible" width="30%">
           
            <el-form ref="form" :model="form" label-width="70px" style="padding-left: 5px;" :rules="rules">
                                 
            <el-form-item>
                <div style="padding-left: 10px;"> 
                    名称：
                    <el-input v-model="form.deviceName" placeholder="请输入内容"  style="width: 50%;"></el-input>
                </div>
            </el-form-item>

            <el-form-item>
                <div style="padding-left: 10px;"> 
                    通道：
                    <el-input v-model="form.channel" placeholder="请输入内容"  style="width: 50%;"></el-input>
                </div>
            </el-form-item>

            <el-form-item>
                <div style="padding-left: 10px;"> 
                    设备编号：
                    <el-input v-model="form.deviceNo" placeholder="请输入内容"  style="width: 50%;"></el-input>
                </div>
            </el-form-item>

            
            <el-form-item>
                <div style="padding-left: 10px;"> 
                    存储路径：
                    <el-input v-model="form.storage" placeholder="请输入内容"  style="width: 50%;"></el-input>
                </div>
            </el-form-item>

            <!-- <div style="padding-left: 30px;" border="2px solid red"> -->
                    <span style="padding-left: 80px;">状态：</span>
                <el-select v-model="form.status" clearable placeholder="状态" class="handle-select mr10" style="width: 36.5%;">
                            <el-option key="1" label="已绑定" value="已绑定"></el-option>
                            <el-option key="2" label="未绑定" value="未绑定"></el-option>
                </el-select>
            <!-- </div> -->

            <div v-if="form.status=='已绑定'">
                            <el-form-item>
                <div style="padding-left: 10px;padding-top: 20px;"> 
                    绑定项目：
                    <el-input v-model="form.projectNo" placeholder="请输入内容"  style="width: 50%;"></el-input>
                </div>
            </el-form-item>

            </div>

                
            </el-form>

            <!--按钮-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="noEdit()">取 消</el-button>
                <el-button type="primary" @click="saveEdit(editId)">确 定</el-button> <!--这里的不对editId-->
            </span>

        </el-dialog>

        <!--新增弹出框-->
        <el-dialog title="新增设备" :visible.sync="insertVisible" width="30%">

            <el-form ref="insertForm" :model="insert" label-width="70px" style="padding-left: 5px;" :rules="rules">
                
                <el-form-item prop="deviceName">
                    <div style="padding-left: 10px;" > 
                    名称：
                        <el-input v-model="insert.deviceName" placeholder="请输入名称"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="channel">
                    <div style="padding-left: 10px;" > 
                    通道：
                        <el-input v-model="insert.channel" placeholder="请输入通道"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="deviceNo">
                    <div style="padding-left: 10px;" > 
                    设备编号：
                        <el-input v-model="insert.deviceNo" placeholder="请输入设备编号"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="storage">
                    <div style="padding-left: 10px;" > 
                    存储路径：
                        <el-input v-model="insert.storage" placeholder="请输入存储路径"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="status">
                <div style="padding-left: 25px;" border="2px solid red">
                    状态：
                    <el-select v-model="insert.status" clearable placeholder="状态" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="1" label="未绑定" value="未绑定"></el-option>
                        <el-option key="2" label="已绑定" value="已绑定"></el-option>
                    </el-select>
                </div>
                </el-form-item>

                <div v-if="insert.status=='已绑定'">
                    <el-form-item prop="projectNo">
                        <div style="padding-left: 10px;" > 
                        项目编号：
                            <el-input v-model="insert.projectNo" placeholder="请输入绑定项目"  style="width: 35%;"></el-input>
                        </div>
                    </el-form-item>
                </div>

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


import {devupdate, devDelete} from '../../api/index';
import {devSelect,devinsertT,selectproject} from '../../api/index';


export default {
    name: 'basetable',
    data() {
        return {
            query: {

                status:'',
                projectNo:'',
                page:1,
                pagesize:8
            },
            bomCheckKey:0,
            tableData: [],
            multipleSelection: [],
            multipleSelectionId: [],
            delList: [],
            editVisible: false,
            insertVisible: false,
            pageTotal: 0,
            form: {
                id:'',
                deviceName:'',
                channel:'',
                deviceNo:'',
                storage:'',
                status:'',
                projectNo:'',

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
            projectlist:[],
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
                deviceName:'',
                channel:'',
                deviceNo:'',
                storage:'',
                status:'',
                projectNo:''
            },
            
            //insert表单的规则
            rules: {
                deviceName: [
                        { required: true, message: '请输入设备名称', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                channel:[
                        { required: true, message: '请输入设备通道', trigger: 'blur' },
                        { required: true, pattern: /^[1-9]\d*$/, message: '通道号应为数字', trigger: 'blur' },
                        { min: 20, max: 20, message: '长度为20个字符', trigger: 'blur' }
                ],
                deviceNo:[
                        { required: true, message: '请输入设备编号', trigger: 'blur'},
                        { required: true, pattern: /^[1-9]\d*$/, message: '设备编号应为数字', trigger: 'blur' },
                        { min: 20, max: 20, message: '长度为20个字符', trigger: 'blur' }
                ],
                storage:[
                        { required: true, message: '请输入存储路径', trigger: 'blur'},
                        { required: true, pattern: /^[1-9]\d*$/, message: '存储路径应为数字', trigger: 'blur' },
                        { min: 20, max: 20, message: '长度为20个字符', trigger: 'blur' }
                ],
                status:[
                    { required: true, message: '请选择状态', trigger: 'change' },
                    // { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                projectNo:[
                    { required: true, message: '请输入绑定项目编号', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],

                                
                }

            };

    },
    created() {
        this.getData();
        this.getproject();
        
    },
    methods: {


        tableRowClassName({row, rowIndex}) {
            if (row.status == '已绑定') {
            return 'warning-row';
            } else  {
            return 'success-row';
            }
            //return '';
        },       
        getData() {

            devSelect(this.query).then(res =>{
                this.tableData=res.list;
                this.pageTotal = res.pageTotal ;//|| 50;
            })

        },
        getproject(){

            selectproject().then(res=>{
                this.projectlist=res;
                //alert(this.projectlist);
            })

        },
        all(){
            
                this.$set(this.query, 'page', 1);

                this.query.status='';
                this.query.projectNo='';

                devSelect(this.query).then(res =>{
                    this.tableData=res.list;
                    this.pageTotal = res.pageTotal ;//|| 50;
                })
        },
        // 触发搜索按钮this.query.status='';
        handleSearch() {
            this.$set(this.query, 'page', 1);
                //this.missionCount = 1;

                // if(query.status!='未绑定'){
                //     this.query.projectNo='';
                // }

                devSelect(this.query).then(res =>{
                this.tableData=res.list;
                this.pageTotal = res.pageTotal; //去掉了 ;//|| 50;
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

                    devDelete(rowId);
                    

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
                    str1 +=this.multipleSelection[i].deviceName +'、';
                }
                else{
                    str += this.multipleSelectionId[i];
                    str1 +=this.multipleSelection[i].deviceName;
                }
            }

            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {

                    devDelete(str);
                    //this.$message.success('删除成功');
                    this.$message.error(`删除了设备${str1}，共${num}条数据`);
                    
                })
                .catch(() => {});

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

            //devupdate(this.form);

            devupdate(this.form).then(res =>{
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            });
            
            this.editVisible = false;
            //this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            //updateData(editId,this.form.status,this.form.executorName,this.editTime,this.editTime1);

            
            
            //打补丁，否则修改第二个信息的时候会显示第一次输入
            this.editTime='';
            this.editTime1='';
                     
        },
        noEdit(){

            //this.$set(this.tableData, this.idx, this.temp);
            this.getData();
            this.editVisible = false

        },

        handleInsert() {

            this.insert={};
            this.insertVisible = true;

        },
        
        submitForm(insertForm) {
        this.$refs[insertForm].validate((valid) => {
            if (valid) {

                // if(insert.status=="未绑定"){
                //     this.insert.projectNo='';
                // }

                devinsertT(this.insert).then(res=>{
                    this.insertVisible = false;
                    this.$message.success(`新增成功`);
                });
                

            } else {
                console.log('error submit!!');
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

.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

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

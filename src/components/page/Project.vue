<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-news"></i> 
                    <span style="font-size: 25;">项目管理</span>
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
                    <el-option key="1" label="未生效" value="未生效"></el-option>
                    <el-option key="2" label="未执行" value="未执行"></el-option>
                    <el-option key="3" label="已执行" value="已执行"></el-option>
                    <el-option key="4" label="其他" value="其他"></el-option>                                   
                </el-select>


                <!-- <el-input v-model="query.manager" placeholder="负责人"  width="30px" clearable class="handle-input mr10"></el-input> -->

                <el-select v-model="query.manager" 
                    clearable placeholder="负责人" 
                    filterable class="handle-select mr10"
                    @focus="getmanager();"
                    >
                    <el-option  v-for="item in this.managerlist"
                                    :key="item"
                                    :value="item">
                    </el-option>
                </el-select>

                
                <el-select v-model="query.province" 
                    clearable placeholder="省份" 
                    filterable class="handle-select mr10"
                    @focus="getprovince();"
                    @change="getcity(query.province)"
                    >
                    <el-option  v-for="item in this.provincelist"
                                    :key="item"
                                    :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="query.city" 
                    clearable placeholder="市" 
                    filterable class="handle-select mr10"
                    >
                    <el-option  v-for="item in this.citylist"
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
                >新增项目</el-button>

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
                <el-table-column prop="projectNo" label="编号" width="80" align="center" sortable></el-table-column>
                <el-table-column prop="projectName" label="名称" width="80" align="center"></el-table-column>
                <el-table-column prop="startTime" label="开始时间"  align="center" sortable></el-table-column>

                <!-- <el-table-column prop="finishTime" label="结束时间"  align="center" sortable></el-table-column>
                 -->
                <el-table-column prop="manager" label="负责人" width="100" align="center"></el-table-column>
                <el-table-column prop="province" label="省" width="70" align="center"></el-table-column>
                <el-table-column prop="city" label="市" width="70" align="center"></el-table-column>
                <el-table-column prop="lng" label="经度" width="80" align="center"></el-table-column>
                <el-table-column prop="lat" label="纬度" width="80" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="80"></el-table-column>
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
        <el-dialog title="编辑项目" :visible.sync="editVisible" width="30%">
           
            <el-form ref="form" :model="form" label-width="70px" style="padding-left: 5px;" :rules="rules">

            <el-form-item>
                <div style="padding-left: 10px;"> 
                    编号：
                    <el-input v-model="form.projectNo" placeholder="请输入内容"  style="width: 35%;"></el-input>
                </div>
            </el-form-item>
                                 
            <el-form-item>
                <div style="padding-left: 10px;"> 
                    名称：
                    <el-input v-model="form.projectName" placeholder="请输入内容"  style="width: 35%;"></el-input>
                </div>
            </el-form-item>
                              
            <el-form-item prop="editTime">
                <div class="block" padding-bottom="10px">
                    <span class="demonstration">开始时间：</span>
                    <el-date-picker
                    v-model="form.startTime"
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
                    <span class="demonstration">结束时间：</span>
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

            <el-form-item>
                <div style="padding-left: 10px;"> 
                    负责人：
                    <el-input v-model="form.manager" placeholder="请输入内容"  style="width: 35%;"></el-input>
                </div>
            </el-form-item>


            <el-form-item >
                <div style="padding-left: 25px;" border="2px solid red">
                    状态：
                    <el-select v-model="form.status" clearable placeholder="状态" class="handle-select mr10" style="width: 36.5%;">
                        <el-option key="1" label="未生效" value="1"></el-option>
                        <el-option key="2" label="未执行" value="2"></el-option>
                        <el-option key="3" label="已执行" value="3"></el-option>
                        <el-option key="4" label="其他" value="4"></el-option>
                    </el-select>
                </div>
            </el-form-item>
                
            </el-form>

            <!--按钮-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit()">取 消</el-button>
                <el-button type="primary" @click="saveEdit(editId)">确 定</el-button> <!--这里的不对editId-->
            </span>

        </el-dialog>

        <!--新增弹出框-->
        <el-dialog title="新增项目" :visible.sync="insertVisible" width="30%">

            <el-form ref="insertForm" :model="insert" label-width="70px" style="padding-left: 5px;" :rules="rules">
                
                <el-form-item prop="projectNo">
                    <div style="padding-left: 10px;" > 
                    编号：
                        <el-input v-model="insert.projectNo" placeholder="请输入内容"  style="width: 35%;" @change='typeCheck'></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="projectName">
                    <div style="padding-left: 10px;" > 
                    名称：
                        <el-input v-model="insert.projectName" placeholder="请输入内容"  style="width: 35%;"></el-input>
                    </div>
                </el-form-item>

                <el-form-item prop="insertTime">
                    <div class="block" padding-bottom="10px">
                        <span class="demonstration">开始时间：</span>
                        <el-date-picker
                        v-model="insert.startTime"
                        type="datetime"
                        placeholder="请选择执行时间"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        style="width: 50%;">
                        </el-date-picker>
                    </div>
                </el-form-item>

                <!-- <el-form-item prop="insertTime1">
                    <div class="block" margin-bottom="0"  >
                        <span class="demonstration" >结束时间：</span>
                        <el-date-picker
                        v-model="insert.finishTime"
                        type="datetime"
                        placeholder="请选择完成时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right"
                        :picker-options="pickerOptions"
                        style="width: 50%;">
                        </el-date-picker>
                    </div>
                </el-form-item> -->

                <el-form-item prop="manager">
                    <div style="padding-left: 10px;" > 
                    负责人：
                        <el-input v-model="insert.manager" placeholder="请输入负责人"  style="width: 35%;"></el-input>
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

                <!-- 设备绑定 -->

                <el-form-item prop="device">
                <div style="padding-left: 25px;" border="2px solid red">
                    设备：
                <el-select v-model="insert.deviceid" 
                    clearable placeholder="设备列表" 
                    filterable class="handle-select mr10"
                    @focus="getdev();"
                    @change="changeTest"
                    >
                    <el-option  v-for="item in this.devlist"
                                    :key="item.id"
                                    :label="item.deviceName"
                                    :value="item.id">
                    </el-option>

                </el-select>
                </div>
            </el-form-item>
                
                <!-- 设备绑定 -->

                <el-form-item prop="province">
                    <div style="padding-left: 10px;" > 
                    所属省：
                        <!-- <el-input v-model="insert.province" placeholder="请输入所属省"  style="width: 35%;"></el-input> -->
                        {{ insert.province }}
                    </div>
                </el-form-item>

                <el-form-item prop="city">
                    <div style="padding-left: 10px;" > 
                    所属市：
                        <!-- <el-input v-model="insert.city" placeholder="请输入所属市"  style="width: 35%;"></el-input> -->
                        {{ insert.city }}
                    </div>
                </el-form-item>

                
                <el-form-item prop="city">
                    <div style="padding-left: 10px;" > 
                    详细地址：
                        <!-- <el-input v-model="insert.city" placeholder="请输入所属市"  style="width: 35%;"></el-input> -->
                        {{ insert.address }}
                    </div>
                </el-form-item>


                <el-form-item prop="lng">
                    <div style="padding-left: 10px;" > 
                    经度：
                    {{ insert.lng }}
                        <!-- <el-input v-model="insert.lng" placeholder="请输入经度"  style="width: 35%;"></el-input> -->
                    </div>
                </el-form-item>

                <el-form-item prop="lat">
                    <div style="padding-left: 10px;" > 
                    纬度：
                    {{ insert.lat }}
                        <!-- <el-input v-model="insert.lat" placeholder="请输入纬度"  style="width: 35%;"></el-input> -->
                    </div>
                </el-form-item>
          


            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="positionVisible = true">地图选点</el-button>
                <el-button @click="insertVisible = false">取 消</el-button><!-- 需要将原有数据再弄回来 -->
                <el-button @click="resetForm('insertForm')">重置</el-button>
                <el-button type="primary" @click="submitForm('insertForm')">确 定</el-button> <!--这里的不对editId-->
            </span>
        
        </el-dialog>

        <!-- 新增项目的弹窗 -->
        <el-dialog
            title="地图选点"
            :visible.sync="positionVisible"
            left
            :append-to-body="true"
            :lock-scroll="false"
            width="65%"
            :show-close="false">

            <div>
        <!-- <el-select
                class="select"
                v-model="search"
                filterable
                remote
                clearable
                reserve-keyword
                @clear="clearSearch"
                placeholder="请输入地址"
                :remote-method="mapNameChange"
                @change="mapNameChange($event,'change')"
                :loading="loading"
                style="width: 100%;">
          <el-option
                  v-for="item in searchOption"
                  :key="item.title"
                  :label="item.title"
                  :value="item.title">
          </el-option>
        </el-select> -->

       
            </div>
            <baidu-map  class="map" :center="center" :zoom="zoom" @ready="handler"
                        :scroll-wheel-zoom="true"
                        @click="clickEvent"
                        ak="sQFPCH4q2dTZU4afGAyfPNgGxji4YOGq"
                        > <!-- hCQLtHVpuiofzTM91crWCyjEE0c8aOtp -->
                <!-- 地图控件位置 -->
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" style="margin-right: 100px;"></bm-navigation>
                <!-- 城市列表 --> <!-- 不知道为啥不能用了 -->
                <!-- <bm-city-list anchor="BMAP_ANCHOR_BOTTOM_LEFT" style="width: 300px;height: 100%; margin-top: 100px; margin-left: 10px;"></bm-city-list> -->
                <!-- 定位当前位置 -->
                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"  :showAddressBar="true" :autoLocation="true" @locationSuccess="getLoctionSuccess" ></bm-geolocation>
                <!-- 地图容器 -->
                <bm-view :style="{width:'100%',height: this.clientHeight+'px',flex: 1,marginBottom:'0px'}"></bm-view>
                <!-- <bm-view :style="{width:'100%',height: this.clientHeight+'px',flex: 1,marginBottom:'-30px'}"></bm-view> -->


                <bm-label v-if="labelShow&&(index==markerIndex)" :content="postion.title" :dragging="false" :label-style="labelStyle" :offset="{width:10,height:-30}" />
                <bm-control>
                <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 2005}">
                    <el-input v-model="keyword" placeholder="请输入内容" clearable style="width: 300px; margin-top: 10px; margin-left: 10px;">
                    <el-button slot="append" icon="el-icon-refresh" @click="setSourceCenter" />
                    </el-input>
                </bm-auto-complete>
                </bm-control>

                <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" :pageCapacity="4" ></bm-local-search>

            <!-- <bm-local-search :keyword="keyword" :auto-viewport="true" /> -->

            </baidu-map>
            <div class="demo-input-suffix" >

                <el-link type="info">经度(lng)： </el-link><el-input  class="lineinput"  style="width:100px" size="mini" v-model.number="locData.longitude"></el-input>
                <el-link type="info">纬度(lat)： </el-link><el-input  class="lineinput"  style="width:100px" size="mini" v-model.number="locData.latitude"></el-input>
                <el-link type="info">地址：</el-link><el-input  class="lineinput"  style="width:250px" size="mini" v-model="locData.address"></el-input>
                

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning"  size="small" icon="el-icon-close" @click.native="close">取消</el-button>
                <el-button type="primary" size="small" icon="el-icon-check" @click.native="findlocation">保存</el-button>
            </div>

        </el-dialog>
  

    </div>
</template>

<script>

let geoc = null;

import {BaiduMap,BmNavigation,BmView,BmGeolocation,BmCityList} from 'vue-baidu-map'
import {proupdate, proDelete,devnotbound} from '../../api/index';
import {projectSelect,proinsertT,selectprovince,selectcity,selectmanager} from '../../api/index';
import {devbound} from '../../api/index'


export default {
    
    name: 'basetable',
    components: {
      BaiduMap,
      BmNavigation,
      BmView,
      BmGeolocation,
      BmCityList
    },
    
    ///
    data() {
        return {
            ///

            center: {lng: 117.063035, lat: 36.672767},
            zoom: 12,
            locData:{
            longitude:'',
            latitude:'',
            address:'',
            city:'',
            province:''
            },
            clientHeight:document.documentElement.clientHeight-600, // 屏幕高度 
            //clientHeight:document.documentElement.clientHeight-450, // 屏幕高度
            iconUrl:'http://api.map.baidu.com/img/markers.png',
            search:'',
            searchOption:[],
            loading:false,
            keyword:'',
            ///

            query: {
                manager:'',
                province:'',
                city:'',
                status:'',
                page:1,
                pagesize:8,
                deviceName:''
            },
            tableData: [],
            multipleSelection: [],
            multipleSelectionId: [],
            delList: [],
            editVisible: false,
            insertVisible: false,
            positionVisible:false,
            pageTotal: 0,
            form: {
                id:'',
                projectName:'',
                startTime:'',
                finishTime:'',
                manager:'',
                status:'',
            },

            temp: {
                id:'',
                projectName:'',
                startTime:'',
                finishTime:'',
                manager:'',
                status:'',
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
                projectNo:'',
                projectName:'',
                startTime:'',
                finishTime:'',
                manager:'',
                province:'',
                city:'',
                lng:'',
                lat:'', 
                status:'',
                address:'',
                deviceid:''
                
            },
            provincelist:[],
            citylist:[],
            managerlist:[],
            devlist:[],
            flag:'',
            
            //insert表单的规则
            rules: {
                projectNo: [
                        { required: true, message: '请输入项目编号', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                projectName:[
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                projectId:[
                        { required: true, message: '请输入所属项目ID', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                manager:[
                    { required: true, message: '请输入负责人', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                status:[
                    { required: true, message: '请选择状态', trigger: 'change' },
                    // { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                province:[
                    { required: true, message: '请输入所属省', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                city:[
                    { required: true, message: '请输入所属市', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                lng:[
                    { required: true, message: '请输入经度', trigger: 'blur' },
                    // { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                lat:[
                    { required: true, message: '请输入纬度', trigger: 'blur' },
                    // { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
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
        ////
        
      handler ({BMap, map}) {
        let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          //console.log(r);
          _this.center = {lng: r.longitude, lat: r.latitude};		// 设置center属性值
          _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude};		// 自定义覆盖物
          _this.initLocation = true;
        },{enableHighAccuracy: true})
 
        window.map = map;
    },

    typeCheck (v) {
    try {
        this.tableData.forEach(item => {
            if (item.projectNo == v)
                throw new Error("type-check-error");
        })
        return true
    } catch (e) { 
        if (e.message == "type-check-error") {//可以接不同的error
            this.$message({
                message:'项目编号已存在',//换成对应的
                type: 'warning'
            })
            return false
            }
        }
    },
    getdev(){
        devnotbound().then(res=>{
            this.devlist = res;
        })

    },

    //下面这个函数没问题*****************
    clickEvent(e){
        map.clearOverlays();

        let Icon_0 = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                        offset: new BMap.Size(10, 25), // 指定定位位置  
                        imageOffset: new BMap.Size(0, 0 - 10 * 25)
                    });

        var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat),{icon: Icon_0});

        map.addOverlay(myMarker);

        //用所定位的经纬度查找所在地省市街道等信息
        var point = new BMap.Point(e.point.lng, e.point.lat);
        var gc = new BMap.Geocoder();
        let _this = this;
        gc.getLocation(point, function (rs) {
          var addComp = rs.addressComponents;
          //console.log(rs.address);//地址信息
          _this.locData.address = rs.address;


          _this.locData.province = addComp.province;
          _this.locData.city = addComp.city;
          _this.locData.district = addComp.district;

        });

        _this.locData.longitude = e.point.lng;
        _this.locData.latitude = e.point.lat;
      },

      //获取当前位置
      //也没问题
      getLoctionSuccess(point, AddressComponent, marker){
        map.clearOverlays();
        let Icon_0 = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                        offset: new BMap.Size(10, 25), // 指定定位位置  
                        imageOffset: new BMap.Size(0, 0 - 10 * 25)
                    });
        var myMarker = new BMap.Marker(new BMap.Point(point.point.lng, point.point.lat),{icon: Icon_0});
        map.addOverlay(myMarker);
        this.locData.longitude = point.point.lng;
        this.locData.latitude = point.point.lat;

        var point = new BMap.Point(point.point.lng, point.point.lat);
        var gc = new BMap.Geocoder();
        let _this = this;
        gc.getLocation(point, function (rs) {
          var addComp = rs.addressComponents;
          _this.locData.address = rs.address;
          //格式
 
        });


      },

      mapNameChange(e,data) {
        this.loading = true;
        if(!e && !this.search){
          return false
        }
        let that = this,
                point,
                marker = null;
        geoc = new BMap.Geocoder();


        let local = new BMap.LocalSearch(map, {
          renderOptions: { map: map },
          onSearchComplete: res => {
            this.loading = false;
            // console.log(res);
            if(res){
              if(data!=="change"){
                that.searchOption = res.Kr
              }
              if(res.Kr.length>0){
                that.$set(that.locData,'longitude',res.Kr[0].point.lng)
                that.$set(that.locData,'latitude',res.Kr[0].point.lat)
              }
            }
            if (local.getResults() != undefined) {
              map.clearOverlays(); //清除地图上所有覆盖物
              if (local.getResults().getPoi(0)) {
                point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                map.centerAndZoom(point, 10);
                marker = new BMap.Marker(point); // 创建标注
                map.addOverlay(marker); // 将标注添加到地图中
                marker.enableDragging(); // 可拖拽
                geoc.getLocation(point, function(rs) {
                  var addComp = rs.addressComponents;
                  that.$set(that.locData,'address',addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber)

                    that.$set(that.locData,'province',addComp.province)
                    that.$set(that.locData,'city',addComp.city)
                    
                });
              } else {
                this.$message('未匹配到地点!可拖动地图上的红色图标到精确位置');
              }
            } else {
              this.$message("未找到搜索结果");
            }
          }
        });
        local.search(e || this.search);
      },

      findlocation(){

        //alert(this.locData.longitude);
        this.positionVisible = false
        this.$emit("mapLocationSave",this.locData)

        this.insert.lng=this.locData.longitude;//
        this.insert.lat=this.locData.latitude;//

        this.insert.address=this.locData.address;//

        this.insert.province = this.locData.province;
        this.insert.city = this.locData.city;
        this.insert.district = this.locData.district;

        positionVisible = false
        
      },

      clearSearch(){
        this.loading = false
      },
      
      close(){
        this.positionVisible = false
        this.$emit('mapLocationClose')
      },
    


       ////

        getprovince(){

            selectprovince().then(res =>{

                this.provincelist=res;
                //alert(this.provincelist)
            })

        },
        getcity(){

            selectcity(this.query.province).then(res =>{

                this.citylist=[];
                this.query.city='';
                this.citylist=res;
                //alert(this.citylist);
            })

        },
        getmanager(){
            selectmanager().then(res =>{
                this.managerlist=res;
            })
        },


        getData() {

            projectSelect(this.query).then(res =>{
                this.tableData=res.list;
                this.pageTotal = res.pageTotal ;//|| 50;
                alert(pageTotal);
            })
            //this.getprovince();
            //this.getmanager();

        },
        all(){
            
                //getprovince();
                this.$set(this.query, 'page', 1);

                this.query.status='';
                this.query.manager='';
                this.query.city='';
                this.query.province='';

                projectSelect(this.query).then(res =>{
                    this.tableData=res.list;
                    this.pageTotal = res.pageTotal;// || 50;
                })
        },
        // 触发搜索按钮this.query.status='';
        handleSearch() {

            //getprovince();
            this.$set(this.query, 'page', 1);
                //this.missionCount = 1;
                projectSelect(this.query).then(res =>{
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

                    proDelete(rowId);

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
                    str1 +=this.multipleSelection[i].projectNo +'、';
                }
                else{
                    str += this.multipleSelectionId[i];
                    str1 +=this.multipleSelection[i].projectNo;
                }
            }

            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {

                    proDelete(str);
                    //this.$message.success('删除成功');
                    this.$message.error(`删除了项目${str1}，共${num}条数据`);
                    
                })
                .catch(() => {});

            this.multipleSelection = [];


        },
        // 编辑操作
        handleEdit(index, row, id) {
            //index 只是这条数据在前端中的数值
            
            this.idx = index;
            this.form = row;
            this.temp = row;
            this.editVisible = true;
            this.editId=id;
        },
        
        // 保存编辑
        saveEdit(editId) {

            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
            //updateData(editId,this.form.status,this.form.executorName,this.editTime,this.editTime1);

            proupdate(this.form);
            //打补丁，否则修改第二个信息的时候会显示第一次输入
            this.editTime='';
            this.editTime1='';
                     
        },
        cancelEdit(){

            this.form=this.temp;
            this.$set(this.tableData, this.idx, this.temp);
            this.editVisible = false;

        },

        handleInsert() {

            this.insert={};
            
            //清除选点弹窗中的keyword
            this.keyword=''
            
            this.insertVisible = true;

        },
        
        submitForm(insertForm) {
            
        this.$refs[insertForm].validate((valid) => {
            if (valid) {

                proinsertT(this.insert);

                devbound(this.insert.deviceid,this.insert.projectNo)

                this.insertVisible = false;

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

.map{
    margin-top: 5px;
  }
  .demo-input-suffix{
    width: 100%;
    margin-top: 40px;
  }
  .BMap_bubble_title a{  /* 隐藏搜索结果的详情按钮 */
    display: none;
  }
  .anchorBL{display:none} /* 去除百度地图左下角的介绍文字 */
</style>

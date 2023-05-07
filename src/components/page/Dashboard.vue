<template>
    <div>
        <el-row :gutter="20" name="1">
            <el-col :span="8" class="mgb5 mgt5">

                <!--账户信息-->
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <img src="../../assets/img/img.jpg" class="user-avator" alt />
                                <div class=" user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                    <div>{{role}}</div>
                                </div>
                                <div class=" user-info-cont1">
                                    <div>当前时间：</div>
                                    <div class="user-info-time">{{ nowDate }}</div>
                                    <div class="user-info-time">{{ nowTime }}</div>
                                </div>
                            </div>
                        </el-card>
                <!--账户信息-->
                              
            </el-col>

            <el-col :span="16">
                <el-row :gutter="20" class="mgb5 mgt5">
                    <el-col :span="6" >
                        <el-card shadow="hover" :body-style="{padding: '0px'}" >
                            <div class="grid-content grid-con-1" @click="this.toProject">
                                <i class="el-icon-s-flag grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.projectcount}}</div>
                                    <div class="mgt10">项目数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2" @click="this.toMission">
                                <i class="el-icon-s-claim grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ this.missioncount }}</div>
                                    <div class="mgt10">任务数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}" >
                            <div class="grid-content grid-con-3" @click="this.toDevice">
                                <i class="el-icon-video-camera-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.devicecount}}</div>
                                    <div class="mgt10">设备数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-4" @click="this.toUser">
                                <i class="el-icon-s-custom grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.usecount}}</div>
                                    <div class="mgt10">用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>

        <el-col :span="4"> <!-- 最下面的左框，放树 --> <!-- ***************************************** -->
            <el-card shadow="hover">
                <!-- <div style="text-align: center;">
                    <el-button @click="handleCheckedTreeExpand" size="mini">展开/折叠</el-button>
                </div> -->
                <!-- <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input> -->
                <div style="text-align: center;color:#909399; margin-bottom: 10px; font-size: 18px;">列表</div>
            
                <div style="height:575px;" >
                    <el-scrollbar style="height:100%">

                    <el-tree lazy :load="loadNode" 
                        :props="props" node-key="id" 
                        :filter-node-method="filterNode"
                        @node-click="handleNodeClick"
                        class="filter-tree"
                        ref="tree"
                        style="height:550px;">
                    </el-tree>
                
                </el-scrollbar>
                </div>
            </el-card>
        </el-col>

        <el-col :span="20"> <!-- 最下面的大框，放地图-->
            <el-card shadow="hover">
                <div style="height:610px;">
                    <baidu-map class="bm-view" :center=this.center :zoom="this.zoom" :scroll-wheel-zoom="true">
                        
                        <div v-for="marker of markers">
                            <bm-marker  :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)">
                                <bm-info-window :title="marker.projectName" :position="{lng: marker.lng, lat: marker.lat}"   
                                :show="marker.showFlag" @close="infoWindowClose(marker)" @open="infoWindowOpen(marker)">
                                <div style="font-size:11px;">
                                    <div>
                                        编号：{{marker.projectNo}}
                                    </div>
                                    <div>
                                        起始时间：{{marker.startTime}}
                                    </div>
                                    <div>
                                        负责人：{{marker.manager}}
                                    </div>
                                    <div>
                                        状态：{{marker.status}}
                                    </div>
                                    <!-- <div style="color: red;">
                                        任务：未实现
                                    </div>
                                    <div style="color: red;">
                                        设备：未实现
                                    </div> -->
                                    
                                    
                                </div>
                                </bm-info-window>
                            </bm-marker>

                        </div>
                        
                        <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>

                        <bm-boundary :name=boundaryname :strokeWeight="3" strokeColor="green" fillOpacity="0"></bm-boundary>
                        <!-- 有bug -->

                    </baidu-map>
                </div>
            </el-card>
        </el-col>

    </div>
</template>

<script>
//import Schart from 'vue-schart';
import {dashprocount,dashdevcount,dashmisscount,dashproselect,dashusercount} from '../../api/index'
import {province,city,project,mission} from '../../api/index'
//import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        
        return {
            name: localStorage.getItem('ms_username'),
            nowDate:'',
            nowTime:'',
            center: {lng: 104.969052, lat: 33.377164},//
            zoom: 5,
            projectcount:'',
            devicecount:'',
            missioncount:'',
            markers: [],
            inforWindow:{
                id:'',
                projectNo:'',
                projectName:'',
                startTime:'',
                manager:'',
                province:'',
                city:'',
                lng:'',
                lat:'',
                status:'',
                createTime:'',
                updateTime:''
            },
            boundaryname:'',
            coordination:{
                lat:'',
                lng:''
            },
            doundarycolor:'',
            filterText: '',
            usecount:'',

            //////////////     
            props: {
                label: "label",
                isLeaf: "isLeaf",
            },       
    };
    
    },
    components: {
        /* //Schart */
    },

    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    // created() {
    //     this.handleListener();
    //     this.changeDate();
    // },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    created(){
        this.currentTime();
        this.proselect();
        this.getprovince();
        this.dashcount();
    },
    mounted(){
        this.currentTime();
        this.proselect();
        this.getprovince();
        this.dashcount();
    },
    watch: {
      filterText(val) {
            this.$refs.tree.filter(val);
        }
        },
        

    methods: {

        filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      
      ///页面跳转
      toProject(){
        this.$router.push('/Project');
        this.dashcount();
      },
      toMission(){
        this.$router.push('/Mission');
        this.dashcount();
      },      
      toDevice(){
        this.$router.push('/Device');
        this.dashcount();
      },      
      toUser(){
        this.$router.push('/User');
        this.dashcount();
      },
      dashcount(){

        this.procount();
        this.devcount();
        this.misscount();
        this.usercount();

      },

        /////////
        // 绑定click事件
        /////
        loadNode(node, resolve) {
        //如果展开第一级节点，从后台加载一级节点列表******省
        if (node.level == 0) {
            this.loadfirstnode(resolve);
        }
        //如果展开市节点，动态从后台加载下一级节点列表******市
        if (node.level == 1) {
            this.loadcitynode(node, resolve);
        }
        //如果展开项目节点，动态从后台加载下一级节点列表******项目
        if (node.level == 2) {
            this.loadprojectnode(node, resolve);
        }
        if (node.level == 3) {
            this.loadmissionnode(node, resolve);
            //console.log(node)
        }

        },

        //省
        async loadfirstnode(resolve) {
        let params = {
            level: 0,
        };

        const res = await province();
        return resolve(res);
        },
        //市
        async loadcitynode(node, resolve) {

        let params = {
            province: node.label,
        };
        const res = await city(params);
        return resolve(res);
        },

        //项目
        async loadprojectnode(node, resolve) {
        
        let params = {
            city: node.label,
        };
        const res = await project(params);
        return resolve(res);
        },        
        
        //任务
        async loadmissionnode(node, resolve) {
        console.log(node)
        let params = {
            projectId: node.data.objId,
        };
        const res = await mission(params);
        console.log(res)
        return resolve(res);
        },

        //设备
        async loaddevicenode(node, resolve) {
        
        let params = {
            city: node.label,
        };
        const res = await project(params);
        return resolve(res);
        },

        ///////////
        handleNodeClick(data) 
        {
            //console.log(data);

            //新增一个属性
            if(data.level=="province"){
                //alert("province")

                this.center = {};
                this.center = data.label;
                this.boundaryname = data.label
                this.zoom=8;

            }
            else if(data.level=="city"){

                this.center = {};
                this.center=data.label;
                this.boundaryname = data.label
                this.zoom = 10;
                
                //alert("city")
            }else if(data.level=="project"){

                this.coordination.lat = data.lat;
                this.coordination.lng = data.lng;
                this.center = this.coordination;
                this.zoom = 16;
                //alert("project")
            }          
     
      },

        // 点击点坐标赋值
    lookDetail(marker){
        marker.showFlag = true;
        this.inforWindow = marker;

        // this.inforWindow


        //alert(this.infoWindow.lat,this.infoWindow.lng);

    },
    // 关闭弹窗
    infoWindowClose(marker) {
        marker.showFlag = false
    },
    // 打开弹窗
    infoWindowOpen(marker) {
        marker.showFlag = true
    },

    procount(){
        dashprocount().then(res=>{

            this.projectcount=res;
        })
    },
    devcount(){
        dashdevcount().then(res=>{

            this.devicecount=res;
        })
    },
    misscount(){

        dashmisscount().then(res=>{
            this.missioncount=res;
        })
    },
    usercount(){
        dashusercount().then(res=>{
            this.usecount=res;
        })
    },
    proselect(){
        dashproselect().then(res=>[
        this.markers=res
        ])
    },

    getprovince(){
        province().then(res=>{
            this.treeData1=res;
            //alert(this.treeData1);
            
        })
    },

////树状图加载
////树状图加载

        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },

        getDate() {
            let date = new Date();
            let year = date.getFullYear(); // 年
            let month = date.getMonth() + 1; // 月
            let day = date.getDate(); // 日
            let week = date.getDay(); // 星期
            let weekArr = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
            let hour = date.getHours(); // 时
            hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
            let minute = date.getMinutes(); // 分
            minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
            let second = date.getSeconds(); // 秒
            second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
            this.nowDate = `${year}年${month}月${day}日 ${weekArr[week]}`;
            this.nowTime = `${hour}时${minute}分${second}秒`;
        },

        currentTime(){
            setInterval(()=>{
                this.getDate()
            },500)
        },
        handler ({BMap, map}) {
        console.log(BMap, map)
            this.center.lng = 116.404
            this.center.lat = 39.915
            this.zoom = 15
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

*::-webkit-scrollbar {
    display: none;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}
.grid-con-4 .grid-con-icon {
    background: rgb(139, 80, 242);
}

.grid-con-4 .grid-num {
    color: rgb(139, 80, 242);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 80px;
    height: 80px;
    /* padding-left: 20px; */
    margin-left:35px;
    border-radius: 50%;
    
}

.user-info-cont {
    padding-left: 30px;
    flex: 1;
    font-size: 14px;
    color: #999;
}


.user-info-cont1 {
    padding-right: 30px;
    padding-top: 3px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-time{
    
    width:150px;
    flex: 1;
    font-size: 14px;
    color: #999;
}


.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.mgb5 {
    margin-bottom: 5px;
}
.mgt5 {
    margin-top: 5px;
}

.bm-view {
    width: 100%;
    height: 610px;
  }

</style>

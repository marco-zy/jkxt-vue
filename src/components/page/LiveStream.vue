<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-video-camera"></i> 
                    <span style="font-size: 25;">视频直播</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- <div class="container" > -->
        
        <el-col :span="4"> <!-- 最下面的左框，放树 --> <!-- ***************************************** -->
            <el-card shadow="hover">

                <div style="height:700px;" class="dir-tree">
                 <div style="text-align: center;color:#909399;margin-bottom: 10px; font-size: 18px;" >设备列表</div>
                 <el-scrollbar style="height:100%">
                    <el-tree lazy :load="loadNode" 
                        :props="props" 
                        node-key="id" 
                        @node-click="handleNodeClick"
                        class="filter-tree"
                        show-checkbox
                        ref="tree">
                    </el-tree>
                </el-scrollbar>
                </div>
            </el-card>
        </el-col>

        <el-col :span="20"> <!-- 最下面的大框，放直播界面-->
            <el-card shadow="hover" style="height:740px">
        <div class="cell" style="height:650px;">
          <div class="cell-tool">
            <div style="text-align: center;">
              <el-button-group >
                  <!-- <el-button @click="cellCountFn(item.number)" v-for="(item,index) in iconArr" :key="index">{{item.number}}</el-button> -->
                  <el-button @click="cutPicture" icon="el-icon-scissors" type="warning"  round>截图</el-button>
                  <el-button @click="cellCountFn(1)" icon="el-icon-picture" type="primary">1宫格</el-button>
                  <el-button @click="cellCountFn(4)" icon="el-icon-menu" type="primary">4宫格</el-button>
                  <el-button @click="cellCountFn(9)" icon="el-icon-s-grid" type="primary">9宫格</el-button>
                  <el-button @click="cellCountFn(16)" icon="el-icon-s-grid" type="primary" round>16宫格</el-button>
                  
                  <!-- item 是被遍历的数组中的各个元素，index是元素的索引 -->
              </el-button-group>  
            </div>
          </div>

            <div class="cell-player" style="height:650px;">
            <div :class="cellClass(i)" v-for="i in cellCount" :key="i">
                <hw-cell-player :title="i" :src="video" v-if="cellCount != 6"></hw-cell-player>
                <hw-cell-player :title="i" :src="video" v-if="cellCount == 6 && i != 2 && i != 3"></hw-cell-player>
                <template v-if="cellCount == 6 && i == 2">
                    <div class="cell-player-6-2-cell">
                        <hw-cell-player :title="i" :src="video"></hw-cell-player>
                        <hw-cell-player :title="(++i)" :src="video"></hw-cell-player>
                    </div>
                </template>

            </div>
            </div>
           
          </div>
        </el-card>
        
        
    
        </el-col>
        <!-- </div> container -->



    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import {province,city,project,mission} from '../../api/index'
import HwCellPlayer from './HwCellPlayer.vue'
export default {
    name: 'LiveStream',
    components: {
      HwCellPlayer},
    data() {
        return {
            query: {

                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            num: 0,
            cellCount:4,  //默认从4开始

            treeData1:'',
            props: {
                label: "label",
                isLeaf: "isLeaf",
            },  
            video:'../videos/01.mp4',
            // video:'http://114.115.144.239/live/34020000001318880001.mp4',

        cellCountArr: [
          {
            index:1,
            data:null,
            isShow:false
          },
          {
            index:2,
            data:null,
            isShow:false
          },
          {
            index:3,
            data:null,
            isShow:false
          },
          {
            index:4,
            data:null,
            isShow:false
          },
        ],
        iconArr:[             //1 2 3 4 6 9 16宫格 icon 样式
          {
            number:1,   //必须是int（number） 类型 
            name:'el-icon-s-platform',
            tips:'1画面'
          },
          {
            number:4,   //必须是int（number） 类型 
            name:'el-icon-menu',
            tips:'4画面'
          },
          {
            number:9,   //必须是int（number） 类型 
            name:'el-icon-s-grid',
            tips:'9画面'
          },
          {
            number:16,  //必须是int（number） 类型 
            name:'el-icon-s-grid',
            tips:'16画面'
          },

        ],  
        };
    },
    created() {
        this.getData();
        this.getprovince();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                //alert(res);
                console.log(res);
                this.tableData = res.list; 
                //this.tableData = res.list; /* 将获取数据中的list赋值给tabledata */
                this.pageTotal = res.pageTotal ;//|| 50;
            });
        },
        cellCountFn(number){
            this.cellCount = number
            this.cellCountArr.length = number
        },
        handleNodeClick(data) 
        {
            console.log(data);

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
        }

        },

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
        
        async loadmissionnode(node, resolve) {
        
        //alert(node.objId)
        let params = {
            projectId: node.data.objId,
        };
        const res = await mission(params);
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

        
    getprovince(){
        province().then(res=>{
          
            this.treeData1=res;
            //alert(this.treeData1);
            
        })
    },
        proselect(){
        dashproselect().then(res=>[
        this.markers=res
        ])
    },

    },
    computed: {
    // 计算类样式属性
    cellClass() {
      return function (index) {
            switch (this.cellCount) {
                case 1:
                    return ['cell-player-1']
                case 4:
                    return ['cell-player-4']                 
                case 9:
                    return ['cell-player-9']
                case 16:
                    return ['cell-player-16']
                default:
                    break;
                }

            }
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
    width: 300px;
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

.cell {
  display: flex;
  flex-direction: column;
  height:200px
}
.cell-tool {
  height: 40px;
  line-height: 30px;
  padding: 0 7px;
}
.player {
  height: 200px;
}
.player-w1 {
  width: 100%;
  height:100%;
  box-sizing: border-box;
}
.player-w4 {
  width: 50%;
  height: 50% !important;
  box-sizing: border-box;/**可有可无 */
  float:left;
}

.player-9 {
  width: 33.33%;
  height: 33.33% !important;
  box-sizing: border-box;
  float: left;
}
.player-16 {
  width: 25%;
  height: 25% !important;
  box-sizing: border-box;
  float:left;
}
.container{
  width:96%;
  /* width:100%; */
  height: 1000px;
}

.cell-tool {
    height: 40px;
    line-height: 30px;
    padding: 0 7px;
}
.cell-player {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.cell-player-4 {
    width: 50%;
    height: 50% !important;
    box-sizing: border-box;
}
.cell-player-1 {
    width: 100%;
    box-sizing: border-box;
}
.cell-player-6-1 {
    width: 66.66%;
    height: 66.66% !important;
    box-sizing: border-box;
}
.cell-player-6-2 {
    width: 33.33%;
    height: 66.66% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.cell-player-6-none {
    display: none;
}
.cell-player-6-2-cell {
    width: 100%;
    height: 50% !important;
    box-sizing: border-box;
}
.cell-player-6 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
}
.cell-player-9 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
}
.cell-player-16 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
}
.cell {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>

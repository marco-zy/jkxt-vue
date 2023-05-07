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

        <div class="container" >
          
        <!--            
                    <el-button-group>
                        <el-button round icon="el-icon-picture" @click="clicked(1)" >一宫格</el-button>
                        <el-button round icon="el-icon-menu" @click="clicked(4)">四宫格</el-button>
                        <el-button round icon="el-icon-s-grid" @click="clicked(9)">九宫格</el-button>
                        <el-button round icon="el-icon-s-grid" @click="clicked(16)">十六宫格</el-button>
                    </el-button-group> 
                    <br>
        -->
            <div style="text-align: center;">
                <el-button-group>
                    <!-- <el-button @click="cellCountFn(item.number)" v-for="(item,index) in iconArr" :key="index">{{item.number}}</el-button> -->

                    <el-button @click="cellCountFn(1)" icon="el-icon-picture">1宫格</el-button>
                    <el-button @click="cellCountFn(4)" icon="el-icon-menu">4宫格</el-button>
                    <el-button @click="cellCountFn(9)" icon="el-icon-s-grid">9宫格</el-button>
                    <el-button @click="cellCountFn(16)" icon="el-icon-s-grid">16宫格</el-button>
                    
                    <!-- item 是被遍历的数组中的各个元素，index是元素的索引 -->
                </el-button-group>  
            </div>

            <br>

            <div class="cell">
                <div class="player">
                    <div :class="cellClass(index2)" v-for="(i,index2) in cellCountArr" :key="index2">
                        <playVideo :str1="index2+1" ></playVideo>
                    </div>
                </div>
            </div>

        </div>



    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import playVideo from '../page/PlayVideo.vue'
export default {
    name: 'basetable',
    components: {
    playVideo},
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
        }
        
    },
    computed: {
    // 计算类样式属性
    cellClass() {
      return function (index) {
        switch (this.cellCount) {
            case 1:
                return ['player-w1']
            case 4:
                return ['player-w4']
            case 9:
                return ['player-9']
            case 16:
                return ['player-16']
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
  /* width: 100%;
  height:100%; */
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
.player-w2 {
  width: 50%;
  height:100%;
  box-sizing: border-box;
  float:left;
}
.player-w3-1 {
  width: 100%;
  height:50%;
  box-sizing: border-box;
  float:left;
}
.player-w3-2 {
  width: 50%;
  height:50%;
  box-sizing: border-box;
  float:left;
}

.player-w6-1 {
  width: 66.66%;
  height: 65.66% !important; /*这里小一点 注意点 */
  box-sizing: border-box;
  float:left;
}
.player-w6-2 {
  width: 33.33%;
  height: 33.33% !important;
  box-sizing: border-box;
  display:inline-table;/**可有可无 */
  float:left;
}
.player-w8-1 {
  width: 75%;
  height: 74% !important;
  box-sizing: border-box;
  float:left;
}
.player-w8-2 {
  width: 25%;
  height: 25% !important;
  box-sizing: border-box;
  display:inline-table; /**可有可无 */
  float:left;
}
</style>

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
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-s-flag grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234_fake</div>
                                    <div class="mgt10">项目数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-claim grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321_fake</div>
                                    <div class="mgt10">任务数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-video-camera-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000_fake</div>
                                    <div class="mgt10">设备数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>

        <el-col :span="24"> <!-- 最下面的大框，放地图-->
            <el-card shadow="hover">
                <div style="height:610px;">
                    <baidu-map class="bm-view" center="济南" :zoom="5" :scroll-wheel-zoom="true">
                        
                        <div v-for="marker of markers">
	<bm-marker  :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)">
		<bm-info-window :title="infoWindow.name" :position="{lng: infoWindow.lng, lat: infoWindow.lat}"   
        :show="marker.showFlag" @close="infoWindowClose(marker)" @open="infoWindowOpen(marker)">
		</bm-info-window>
	</bm-marker>
</div>
                        
                        <!--bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale-->

                    </baidu-map>
                </div>
            </el-card>
        </el-col>

    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {

        
        return {
            name: localStorage.getItem('ms_username'),
            nowDate:'',
            nowTime:'',
            center: {lng: 0, lat: 0},
            zoom: 3,
            
            markers: [
	{
		lng: 117.12640,
		lat: 36.65655 ,
		name:'国网智能监控项目<br>任务名称：巡检1<br><a href="http://192.168.174.43:8081/#/livestream" οnclick="doSomething();return false">点击查看监控</a>',
		showFlag:false //flag放在每一条数据里
	},
	{
		lng: 116.58066,
		lat: 35.42889,
		name:'国网山东电力济宁监控项目<br>任务名称：巡检2<br><a href="http://192.168.174.43:8081/#/livestream" οnclick="doSomething();return false">点击查看监控</a>',
		showFlag:false
	},
    {
		lng: 122.59952,
		lat: 37.40728,
		name:'国网山东荣成监控项目<br>任务名称：巡检3<br><a href="http://192.168.174.43:8081/#/livestream" οnclick="doSomething();return false">点击查看监控</a>',
		showFlag:false
	}
],
        infoWindow:{},
        };

    },
    components: {
        Schart
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
    },
    methods: {
        // 点击点坐标赋值
lookDetail(marker){
	marker.showFlag = true;
	this.infoWindow = marker;
},
// 关闭弹窗
infoWindowClose(marker) {
	marker.showFlag = false
},
// 打开弹窗
infoWindowOpen(marker) {
	marker.showFlag = true
},



        
        
        
        

        
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }

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
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
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

import VueVideoPlayer from 'vue-video-player'

<template>
    <div class="player">
        通道{{ str1 }}
        <video style="width: 100%;height: 100%" controls>
            <!-- <source src="../videos/01.mp4"> -->
            <source src="http://114.115.144.239/live/34020000001320031181.mp4"></source>
        </video>
    </div>

</template>

<script>

  export default {
    name: 'playVideo',
    props: {
        str1: {
            type: String,
            default: ''
        },
    },
    data(){

      return {

        tableData: [],
        
      };
    },
    create(){
      console.log("下标",this.str1);
    },
    methods(){
      
    }
  }
</script>
  




<style scoped>
  .player {
      background-color: black;
      /* height: 100%;
      width: 100%; */
      border: 1px solid white;
      color: white;
      text-align: center;
  }
</style>
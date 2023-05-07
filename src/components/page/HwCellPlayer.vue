<template>
    <div class="player">player{{ title }}
        <div>

            
            <video style="height: 100%;width: 100%;" controls id="videos" ref="video" autoplay="true">
                    <source :src=src>
            </video>

        </div>
    </div>
    
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        src:{
            type: String,
            default:'../videos/01.mp4'
        }
    },
}
</script>

<style scoped>
.player {
    background-color: black;
    height: 100%;
    border: 1px solid white;
    color: white;
    text-align: center;
}
</style>
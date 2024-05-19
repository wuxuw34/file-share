<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from 'vue'

const SCREEN_STATUS = {
    0: '等待发送',
    1: '发送成功',
    '-1': '发送失败',
    '-2': '数据终止'
}

const props = defineProps<{
    status: 0 | -1 | 1 | -2,
    index: number,
    stream: MediaStream,
    info: {
        frameRate?: string | number,
        width?: string | number,
        height?: string | number
    }
}>()
defineEmits<{
    (e: 'deleteFile', value: number): void
}>()
const videoRef = ref<HTMLVideoElement>()

// watch(() => props.stream, () => {
//     videoRef.value!.srcObject = props.stream
// })

onMounted(() => {
    videoRef.value!.srcObject = props.stream
    videoRef.value?.addEventListener('loadeddata', () => {
        console.log('视频加载');
        
        videoRef.value?.play()
    })

})

function stopPropagation(e: Event) {
    e.stopPropagation()
    if ((e.target as HTMLElement).tagName === 'VIDEO' && !document.fullscreenElement) {
        videoRef.value!.controls = false
        videoRef.value?.requestFullscreen()
    } else if ((e.target as HTMLElement).tagName === 'VIDEO' && document.fullscreenElement) {
        document.exitFullscreen()
    }
}

</script>

<template>
    <div class="video-item" @click="stopPropagation">
        <div>
            <div class="video-container">
                <div>
                    <video ref="videoRef" muted="true"></video>
                </div>
            </div>
            <div class="opearate">
                <div>
                    <div class="desc">{{ info.width }} x {{ info.height }}</div>
                    <div class="desc">{{ info.frameRate }}</div>
                    <div class="desc status">{{ SCREEN_STATUS[status] }}</div>
                    <div class="garbage" v-show="status === 0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.video-item {
    display: table-row;
    min-height: 75px;
    max-height: 200px;

    /* padding: 10px; */
    box-sizing: content-box;

    /* box-shadow: 0 0  1px 10px red; */
    &>div {
        border: 1px solid rgb(223, 223, 223);
        border-radius: 5px;
        background-color: white;
    }

    .video-container {
        min-height: 150px;
        max-height: 300px;
        height: 100%;
        max-width: 400px;
        min-width: 170px;
        background-color: black;
        justify-content: center;
        align-items: center;
        display: table-cell;
        position: relative;

        &>div {
            height: 100%;
            width: auto;
            aspect-ratio: 16/10;
        }

        video {
            object-fit: contain;
            position: absolute;
        }
    }

    .opearate {
        display: table-cell;
        padding: 5px 10px;
        position: relative;
        vertical-align: middle;

        &>div {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            height: 100%;
            gap: 5px;
        }
    }
}

video {
    width: 100%;
    height: 100%;
}

video::-webkit-media-controls-panel {
    display: none;
}

.garbage {
    display: table-cell;
    padding: 5px;
    text-align: center;
    vertical-align: middle;
    line-height: 100%;
}
</style>
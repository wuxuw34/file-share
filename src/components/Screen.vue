<script setup lang="ts">
import { ref } from 'vue'
import { random } from '../utils/uuid.ts'
import VideoItem from './VideoItem.vue';
import { createPeer } from '../utils/Peer.ts'
import ContentVue from './Content.vue'
import Qrcode from './Qrcode.vue';
const code = ref<string>()


const {
    callAnthorPeerConnection,
    initPeerConnection,
    streams
} = createPeer()



function requestAllScreen(screens: any[]) {


    screens.forEach((item: {
        index: number,
        key: string,
        info:any
    }) => {
        callAnthorPeerConnection(item.key, item.index,item.info)
    });
}



defineExpose({ requestAllScreen })


/**
 *  发送视频key给服务器
 */
function startShare() {
    const formdata = new FormData()
    formdata.append('screens', JSON.stringify(streams.value.map((item, index) => {
        return {
            index,
            key: item.streamKey,
            info:item.info
        }
    })))
    fetch(window.$baseURL + 'screens', {
        method: 'post',
        body: formdata
    }).then(r => r.json())
        .then((r: MessageResultType) => {
            if (r.state) {
                code.value = r.data.code
                initPeerConnection()
            }
        })
}

function getVideoInfo(stream: MediaStream) {
    const tracks = stream.getTracks()

    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].kind == 'video') {

            const setting = tracks[i].getSettings()
            console.log('视频', setting);
            return {
                frameRate: setting.frameRate,
                height: setting.height,
                width: setting.width
            }
        }
    }
    return null
}

/**
 * 处理点击事件，并获取视频流
 */
async function handleClick() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    })

    const key = stream.id
    stream.getTracks()[0].onended = () => {
        streams.value.forEach((item: {
            stream: MediaStream,
            status: 0 | -1 | 1 | -2
        }) => {
            if (item.stream.id == key) {
                item.status = -2
            }
        })
    }
    const info  = getVideoInfo(stream)
    streams.value.push({
        streamKey: random(),
        stream,
        info:info,
        status: 0
    })
}
/**
 *  清空获取到的屏幕,关闭媒体流轨道
 */
function clearAllScreen() {
    // 停止所有轨道
    streams.value.forEach(item => {
        const { stream } = item
        stream.getTracks().forEach(track => {
            track.stop()
        })
    })
    // 清空数组
    streams.value = []
}

</script>

<template>
    <div class="screens">
        <div class="operate_bnt">
            <el-button-group>
                <el-button @click="handleClick">添加屏幕</el-button>
                <el-button @click="clearAllScreen">清空</el-button>
            </el-button-group>
        </div>
        <ContentVue @click="handleClick" class="screen_list">
            <span v-show="!streams.length" class="placeholder">点击添加文件或将文件拖放到该区域</span>
            <div class="videos">
                <VideoItem v-for="(item, index) in streams" :stream="item.stream" :index="index"
                    :status="item.status" :info="item.info" />
            </div>
        </ContentVue>

        <el-button type="primary" class="send_bnt" @click="startShare">发送</el-button>
        <Qrcode v-show="code" :code="code" title="收取视频" type="screen" />
    </div>
</template>

<style scoped lang="scss">
.operate_bnt {
    display: flex;
    justify-content: flex-end;
}

.screen_list {

    &>div {
        display: table;
        width: fit-content;
        border-spacing: 10px 5px;
    }

    &:hover {
        border: 1px solid $primary_color;
        box-shadow: 0 0 2px 1px rgb(182 215 241);
        outline: none;
    }

    &>.placeholder {
        font-size: 18px;
        color: #b0b0b0;
    }

    .videos {
        display: table;
    }
}

.send_bnt {
    margin-top: 10px;

}
</style>

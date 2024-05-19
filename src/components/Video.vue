<script setup lang="ts">
import { ref } from 'vue'
import { random } from '../utils/uuid.ts'
import VideoItem from './VideoItem.vue';
import Qrcode from './Qrcode.vue';
import { createPeer } from '../utils/Peer.ts'
import ContentVue from './Content.vue'

const {
    callAnthorPeerConnection,
    initPeerConnection,
    streams
} = createPeer()
const code = ref<string>()
const devices = ref<{
    videos: Array<{
        id: string,
        label: string
    }>,
    audio: boolean
}>({
    videos: [],
    audio: true
})
const checkList = ref<{
    video: string[],
    audio: boolean
}>({
    video: [],
    audio: true
})
const isShowSelectDevice = ref<boolean>(false)

function requestAllScreen(screens: any[]) {
    screens.forEach((item: {
        index: number,
        key: string
    }) => {
        callAnthorPeerConnection(item.key, item.index)
    });

}



defineExpose({ requestAllScreen })


/**
 *  发送视频key给服务器
 */
function startShare() {
    const formdata = new FormData()
    formdata.append('screens', JSON.stringify(streams.value.map((item:any, index:number) => {
        const info = getVideoInfo(item.stream)
        return {
            index,
            key: item.streamKey,
            frameRate: info?.frameRate,
            width: info?.width,
            height: info?.height
        }
    })))
    fetch(window.$baseURL + 'videos', {
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

/**
 * 处理点击事件，并获取视频流
 */
async function handleClick() {
    const d = await navigator.mediaDevices.enumerateDevices()
    d.forEach((device: MediaDeviceInfo) => {
        if (device.kind === 'videoinput') {
            devices.value.videos.push({
                id: device.deviceId,
                label: device.label
            })
        }
    })
    isShowSelectDevice.value = true
}

function getVideoInfo(stream: MediaStream) {
    const tracks = stream.getTracks()
    console.log('准备获取数据', stream, tracks[0]);

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

function getAllStream() {
    checkList.value.video.forEach(async video => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: video
            },
            audio: checkList.value.audio
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
        streams.value.push({
            streamKey: random(),
            stream,
            status: 0
        })
    })
    closeDialog()
}

function closeDialog(done?: Function) {
    checkList.value.video = []
    checkList.value.audio = true
    devices.value.videos = []
    isShowSelectDevice.value = false
    done?.()
}

</script>

<template>
    <div>
        <div class="screens">
            <div class="operate_bnt">
                <el-button-group>
                    <el-button @click="handleClick">添加视频</el-button>

                    <el-button @click="clearAllScreen">清空</el-button>
                </el-button-group>
            </div>
            <ContentVue>
                <div class="screen_list" @click="handleClick">
                    <span v-show="!streams.length" class="placeholder">点击选择摄像头和麦克风</span>
                    <div class="videos">
                        <VideoItem v-for="(item, index) in streams" :stream="item.stream" :index="index"
                            :status="item.status" />
                    </div>
                </div>
            </ContentVue>

            <el-button type="primary" class="send_bnt" @click="startShare">发送</el-button>
            <Qrcode v-show="code" :code="code" title="收取视频" type="video" />
        </div>
        <el-dialog v-model="isShowSelectDevice" title="选择摄像头和麦克风" width="500" :before-close="closeDialog">
            <table>
                <tr>
                    <td>摄像头</td>
                    <td class="">
                        <div class="select_video">
                            <el-checkbox-group v-model="checkList.video">
                                <el-checkbox v-for="item in devices.videos" :label="item.label" :value="item.id" />
                            </el-checkbox-group>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>麦克风</td>
                    <td>
                        <el-switch v-model="checkList.audio" />
                    </td>
                </tr>
            </table>
            <template #footer>
                <div class="dialog_footer">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="getAllStream">确定</el-button>
                </div>
            </template>
        </el-dialog>
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

table {
    border-spacing: 6px;
    width: 100%;
}

.select_video {
    border: 1px solid var(--el-border-color);
    border-radius: 3px;
    padding: 6px 10px;
    width: max-width;
    min-height: 80px;
}
</style>

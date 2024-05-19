<script setup lang="ts">
import InputCodeVue from '../components/InputCode.vue';
import Texts from '../components/Texts.vue';
import Files from '../components/Files.vue';
import Header from '../components/Header.vue'
import VideoVue from '../components/Video.vue'
import { ref } from 'vue'
import { onMounted, onUnmounted,provide } from 'vue';
import './index.scss'
import TabTransition from '../components/TabTransition.vue';
// import { createFileChunk } from './utils/HandleFile'
// import { calculateHash } from './utils/hash/hash'
import { ElMessage } from 'element-plus'
// const text = ref<string | undefined>()
// const baseURL = 'http://localhost:8083/'
// const code = ref<string | undefined>()
// let merge: any = null


type MESSAGE_TYPE = 'file'|'text'|'screen'|'video'

const codeVal = ref<string>()
const labelName = ref<string>('0')
const screenRef = ref<any | null>()
const videoRef = ref<any | null>()
const fileRef = ref<any | null>()
const vector = ref<boolean>(true)
let preLabelName: string = '0'
const textRef = ref<any|null>()
const senButtonStatus = ref(true)


provide('getSendButtonStatus',getSendButtonStatus)

onMounted(() => {
    // window.$baseURL = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : window.location.host
    document.getElementById('loader')!.style.display = 'none'
    window.$baseURL = 'http://192.168.31.196:8083/'
    handleResultURL()
    window.addEventListener('copy', copyEvent)
})

onUnmounted(() => {
    window.removeEventListener('copy', copyEvent)
})

function getSendButtonStatus(){
    return senButtonStatus.value
}

function copyEvent() {
    ElMessage.success('复制成功')
}

function handleResultURL() {

    const getQueryString = (url: string) => {
        const query = url.split('?')
        if (query.length < 2) {
            return {
                code: null,
                type: null
            }
        }
        const q = query[1].split('&')


        const res: any = {}
        for (let i = 0; i < q.length; i++) {
            const r = q[i].split('=')
            res[r[0]] = r[1]
        }
        return res
    }


    const { type, code } = getQueryString(window.location.href)
    console.log('结果',type,code)


    if (type && code) {
        quest(type, code)
    }
}


function getTypeIndex(type: MESSAGE_TYPE) {
    const types = {
        'file': '0',
        'text': '1',
        'screen': '2',
        'video': '3'
    }
    return types[type]
}



function quest(type: MESSAGE_TYPE, code: string) {
    labelName.value = getTypeIndex(type)
    const url = window.$baseURL + 'res?code=' + code + '&type=' + type
    fetch(url, {
        method: 'GET'
    }).then(r => r.json())
        .then((r: MessageResultType) => {
            const { state, msg, data } = r

            if (state) {
                senButtonStatus.value = false
                switch (type) {
                    case 'screen': {
                        screenRef.value.requestAllScreen(JSON.parse(data.screens))
                        break
                    }
                    case 'video': {
                        videoRef.value.requestAllScreen(JSON.parse(data.screens))
                        break
                    }
                    case 'file': {
                        fileRef.value.requestAllFiles(data.file_info)
                        break
                    }
                    case 'text':{
                        
                        textRef.value.getText(data.text)
                        break
                    }
                }
            }
        })
}

function handleTabClick(pane: any) {
    const { paneName } = pane
    preLabelName = labelName.value

    vector.value = parseInt(paneName) - parseInt(preLabelName) > 0
}

function queryTypeByCode(code?:string) {
    const url = window.$baseURL + 'getType?code=' + (code || codeVal.value)
    fetch(url, {
        method: 'get'
    }).then(r => r.json())
        .then(r => {
            console.log(r)
            const { state, msg, data } = r
            if (state) {
                const type = data.type
                quest(type, codeVal.value as string)
            }
        })
}

function handleTabChange(){
    isBanSendButton.value = false
}

provide('queryTypeByCode',queryTypeByCode)

</script>

<template>
    <div class="home">
        <Header></Header>
        <main style="width: var(--width);">
            <div class="input_area">
                <InputCodeVue @search="queryTypeByCode" v-model:value="codeVal" />
            </div>
            <div class="operate_area">
                <el-tabs v-model="labelName" @tab-click="handleTabClick" @tab-change="handleTabChange">
                    <el-tab-pane label="传文件" name="0">
                        <template #label>
                            <span class="tab">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z" />
                                </svg>
                                传文件
                            </span>
                        </template>
                        <TabTransition :v="vector">
                            <Files v-show="labelName === '0'" ref="fileRef" />
                        </TabTransition>
                    </el-tab-pane>
                    <el-tab-pane label="传文字" name="1">
                        <template #label>
                            <span class="tab">
                                <svg t="1704708010493" class="icon" viewBox="0 0 1024 1024" fill="currentColor"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4473" width="16" height="16">
                                    <path
                                        d="M755.809524 182.857143V316.952381h-73.142857v-60.952381h-207.238096V804.571429H560.761905v73.142857H316.952381v-73.142857h85.333333V256h-219.428571V316.952381h-73.142857V182.857143H755.809524zM902.095238 804.571429v73.142857H609.52381v-73.142857h292.571428z m0-146.285715v73.142857H609.52381v-73.142857h292.571428z m0-146.285714v73.142857H609.52381v-73.142857h292.571428z"
                                        p-id="4474"></path>
                                </svg>
                                传文字
                            </span>
                        </template>
                        <TabTransition :v="vector">
                            <Texts ref="textRef" v-show="labelName === '1'" />
                        </TabTransition>
                    </el-tab-pane>
                    <el-tab-pane label="传屏幕" name="2">
                        <template #label>
                            <span class="tab">
                                <svg t="1704708010493" class="icon" viewBox="0 0 1024 1024" fill="currentColor"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4473" width="16" height="16">
                                    <path
                                        d="M755.809524 182.857143V316.952381h-73.142857v-60.952381h-207.238096V804.571429H560.761905v73.142857H316.952381v-73.142857h85.333333V256h-219.428571V316.952381h-73.142857V182.857143H755.809524zM902.095238 804.571429v73.142857H609.52381v-73.142857h292.571428z m0-146.285715v73.142857H609.52381v-73.142857h292.571428z m0-146.285714v73.142857H609.52381v-73.142857h292.571428z"
                                        p-id="4474"></path>
                                </svg>
                                传屏幕
                            </span>
                        </template>
                        <TabTransition :v="vector">
                            <Screen ref="screenRef" v-show="labelName === '2'" />
                        </TabTransition>
                    </el-tab-pane>
                    <el-tab-pane label="传视频" name="3">
                        <template #label>
                            <span class="tab">
                                <svg t="1704708010493" class="icon" viewBox="0 0 1024 1024" fill="currentColor"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4473" width="16" height="16">
                                    <path
                                        d="M755.809524 182.857143V316.952381h-73.142857v-60.952381h-207.238096V804.571429H560.761905v73.142857H316.952381v-73.142857h85.333333V256h-219.428571V316.952381h-73.142857V182.857143H755.809524zM902.095238 804.571429v73.142857H609.52381v-73.142857h292.571428z m0-146.285715v73.142857H609.52381v-73.142857h292.571428z m0-146.285714v73.142857H609.52381v-73.142857h292.571428z"
                                        p-id="4474"></path>
                                </svg>
                                传视频
                            </span>
                        </template>
                        <TabTransition :v="vector">
                            <VideoVue ref="videoRef" v-show="labelName === '3'" />
                        </TabTransition>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </main>
        <footer>尾部</footer>
    </div>
</template>

<style scoped lang="scss">
.home {
    background-color: rgb(240, 242, 245);
    height: 100%;

    main {
        width: var(--width);
        margin: auto;
        padding: 10px 5px;
        display: flex;
        flex-direction: column;
        gap: 10px;


        .input_area {
            display: flex;
            justify-content: end;
            align-items: center;
        }

        .operate_area {
            padding: 5px 10px 10px;
            box-shadow: 0 0 10px 1px rgba(167, 167, 167, .75);
            border-radius: 5px;
            background-color: white;
        }

        .tab {
            display: flex;
            align-items: center;
            gap: 3px;
        }
    }

}
</style>

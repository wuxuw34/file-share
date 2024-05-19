<script setup lang="ts">
import { ref, computed, provide, watch, inject, onMounted } from 'vue'
// import { convert } from '../utils/size.ts'
import FileItem from './FileItem.vue'
import { createFileChunk } from '../utils/HandleFile'
import { calculateHash } from '../utils/hash/hash'
import ContentVue from './Content.vue'
import Qrcode from './Qrcode.vue';
import { convert } from '../utils/size';
// import {MessageResultType} from '../types/index.d.ts'
const inputRef = ref<HTMLInputElement | null>()
const fileList = ref<File[] | { size: number | string, name: string }[]>([])
const fileStatus = ref<Array<-1 | 0 | 1>>([])
let merge: any = null
const code = ref<string | null | undefined>()
const info = ref({
    totalSize: computed(() => {
        return fileList.value.reduce((pre: number, curr) => {
            return pre + (curr.size as number)
        }, 0)
    })
})
const needClearAllFiles = ref<boolean>(false)
const isDownload = ref(false)
const sendButtonStatus = ref(true)

provide('deleteFile', deleteFile)

watch(() => [...fileStatus.value], () => {
    console.log('被修改', fileStatus.value);
})


/**
 * @param index 文件索引
 */
function deleteFile(index: number) {
    fileList.value.splice(index, 1)
}

/**
 * input值修改响应事件
 * @param e 
 */
function handleFileList(e: Event) {
    if (needClearAllFiles.value) {
        clearAll()
        needClearAllFiles.value = false
    }
    if ((e.target as HTMLInputElement).files) {
        for (let file of (e.target as HTMLInputElement).files!) {
            fileList.value.push(file)
            fileStatus.value.push(0)
        }
    }
}

/**
 *上传
 */
function handleUpload() {
    inputRef.value?.click()
}

function dragOver(e: DragEvent) {
    e.preventDefault()
}

/**
 * 处理鼠标松开事件
 * @param e 
 */
function drop(e: DragEvent) {
    e.preventDefault()
    if (needClearAllFiles.value) {
        clearAll()
        needClearAllFiles.value = false
    }
    if (e.dataTransfer) {
        const files = e.dataTransfer.files
        for (let file of files) {
            fileList.value.push(file)
            fileStatus.value.push(0)
        }
    }
}

function requestCode() {
    const formdata = new FormData()
    formdata.append('fileList', JSON.stringify(fileList.value.map((file: File) => {
        return {
            name: file.name,
            size: file.size
        }
    })))
    fetch(window.$baseURL + 'qfilecode', {
        method: 'post',
        body: formdata
    }).then(r => {
        return r.json()
    }).then((r: MessageResultType) => {
        const { state, msg, data } = r
        if (state) {
            code.value = data.code
        }
    }).catch(err => {
        console.error('发送失败', err);
    })
}

/**
 * 清空文件列表,同时需要重置code，防止之前的二维码显示
 */
function clearAll() {
    fileList.value = []
    code.value = ''
    sendButtonStatus.value = true
}

/**
 * 发送所有文件
 */
function sendFileList() {
    needClearAllFiles.value = true;
    console.log("文件列表", fileList.value);
    let index = 0

    const send = () => {
        if (index < fileList.value.length) {
            const _index = index
            index++
            handleSendSingleFile(fileList.value[_index])?.then((r: MessageResultType | null) => {
                if (r) {
                    const { state, data, msg } = r
                    if (state) {
                        fileStatus.value[_index] = 1 // 修改文件状态
                    } else {
                        fileStatus.value[_index] = -1 // 修改文件状态
                    }
                } else {
                    fileStatus.value[_index] = -1
                }
                console.log("当前index", _index);
                send()
            }
            ).catch((err) => {
                console.log('上传错误', err);
                send()
            })
        } else {
            requestCode()
        }
    }
    send()
}


function handleSendSingleFile(file: File) {
    // 文件需要判空


    if (file!.size === 0) return

    return new Promise(async (resolve, reject) => {
        console.log('开始上传前', file.name);
        const fileChunksList = createFileChunk(file)
        const list = await calculateHash(fileChunksList), file1 = await calculateHash({
            file: file
        })

        console.log('开始上传前的处理', list);
        // 并发上传文件分片
        Promise.all((list as Array<any>).map((chunk) => {
            return new Promise((resolve, reject) => {
                const formdata = new FormData()
                formdata.append('file', chunk.chunk)
                formdata.append('hash', chunk.hash)
                formdata.append('index', chunk.index)
                formdata.append('name', file.name)
                fetch(window.$baseURL + 'rFile', {
                    method: 'POST',
                    body: formdata,
                    mode: 'cors'
                })
                    .then(r => r.json())
                    .then((r: any) => {
                        resolve(true)
                    }).catch(err => {
                        reject(false)
                    })
            })
        })).then((res) => {
            // 并发请求全完成后开始发送合并请求
            // 判断是否全部发送成功，需要容错
            console.log('全部文件分片结果', res);


            if (res.every(i => i)) {

                const formdata = new FormData()
                formdata.append('name', file.name)
                formdata.append('hash', (file1 as any).hash)
                const chunksize = 10 * 1024 * 1024 * 8
                formdata.append('chunksize', String(chunksize))
                fetch(window.$baseURL + 'mFile', {
                    method: 'POST',
                    body: formdata
                }).then(res => {


                    return res.json()
                }).then((r: MessageResultType) => {
                    console.log('请求合并结果', r);
                    resolve(r)
                })

            }
        }).catch(err => {
            reject(err)
        })
    })

}


function handleClickDownload(e: MouseEvent, index: number, calback?: any) {
    let sum = 0, receivedData = 0

    fetch(window.$baseURL + 'getFile?filename=' + fileList.value[index].name)
        .then(r => {
            sum = parseInt(r.headers.get('Content-Length')!);
            name = r.headers.get('Content-Disposition')?.split("=")[1] as string
            return r.body;
        }).then((r) => {
            const reader = r?.getReader()
            const chunks: any[] = []
            reader?.read().then(function read(r: any) {
                const { done, value } = r
                if (done) {

                    const blob = new Blob(chunks)
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.download = fileList.value[index].name
                    a.href = url
                    a.style.display = 'none'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)

                    return
                }

                receivedData += value.length
                calback?.(receivedData / sum)

                chunks.push(value)
                return reader?.read().then(read)
            })

        })
}

function requestAllFiles(files: string) {
    fileList.value = JSON.parse(files)
    needClearAllFiles.value = true
    isDownload.value = true
    sendButtonStatus.value = false
}

defineExpose({ requestAllFiles })


</script>

<template>
    <div>
        <div>
            <div class="operate_bnt">
                <el-button-group>
                    <el-button @click="">下载全部</el-button>
                    <el-button @click="handleUpload">添加文件</el-button>
                    <el-button @click="clearAll">清空</el-button>
                </el-button-group>
            </div>
            <ContentVue :show-info="fileList.length > 0" class="file_list" @drop="drop" @dragover="dragOver"
                @click="handleUpload">
                <div>
                    <FileItem @handle-click-download="handleClickDownload" v-for="(file, index) in fileList"
                        :name="file.name" :size="file.size" :status="fileStatus[index] as -1 | 0 | 1" :index="index"
                        :download="isDownload" />
                </div>
                <span v-show="!fileList.length" class="placeholder">点击添加文件或将文件拖放到该区域</span>

                <template #info>
                    <div class="desc">{{ fileList.length }}个文件</div>
                    <div class="desc">{{
                        convert(info.totalSize)
                        }}</div>
                </template>
            </ContentVue>
            <input ref="inputRef" type="file" @change="handleFileList" />
        </div>
        <el-button type="primary" style="margin-top: 5px;" :disabled="!sendButtonStatus"
            @click="sendFileList">发送</el-button>
        <Qrcode v-show="code" :code="code" title="接收文件" type="file" />
    </div>
</template>

<style scoped lang="scss">
.operate_bnt {
    display: flex;
    justify-content: flex-end;
}


.file_list {
    width: 100%;
    border: 1px solid $gray_color;
    background-color: rgba(243, 243, 246, 0.75);
    box-sizing: border-box;
    min-height: 200px;
    font-size: 16px;
    padding: 8px 10px;
    font-weight: 500;
    /* border-radius: 5px; */
    color: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;


    &>div {
        display: table;
        width: fit-content;
        border-spacing: 0 5px;
        overflow-y: auto;
    }

    &>.placeholder {
        font-size: 18px;
        color: #b0b0b0;
    }
}

input {
    display: none;
}
</style>
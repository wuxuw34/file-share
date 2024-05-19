<script setup lang="ts">
import { convert } from '../utils/size.ts'
import { defineProps, defineEmits, inject, ref } from 'vue'

const FILE_STATUS = {
    0: '等待发送',
    1: '成功',
    '-1': '失败'
}
const downloadStutas = ref({
    progress: 0,
    isDownloading: false,
    status: '下载中'
})
const deleteFile = inject<(index: number) => void>('deleteFile')

const props = defineProps<{
    name: string,
    size: number,
    status: 0 | -1 | 1,
    index: number,
    download: boolean
}>()
const emits = defineEmits<{
    (e: 'deleteFile', value: number): void,
    (e: 'handleClickDownload', value: MouseEvent, index: string | number): void
}>()
const isDownloading = ref(false)

function onHandleClickDownload(e: MouseEvent) {
    emits('handleClickDownload', e, props.index, handleDownloadPropress)
}
function handleDownloadPropress(progress: number) {
    downloadStutas.value.progress = parseInt(progress.toFixed(2))
    if (progress >= 1) {
        downloadStutas.value.status = '下载完成'
    }
}
</script>

<template>
    <div class="file_item" @click="(e) => {
        e.stopPropagation()
    }">

        <a class="file_name" @click="(e: MouseEvent) => {
            isDownloading = true
            downloadStutas.isDownloading = true
            onHandleClickDownload(e)
        }">{{ name }}</a>
        <div>
            <span class="desc">{{ convert(size) }}</span>
            <span :class="['desc', 'status_' + status]" v-if="!download">{{ FILE_STATUS[status] }}</span>
            <el-tag v-show="isDownloading" :type="downloadStutas.progress < 1 ? 'primary' : 'success'">
                {{ downloadStutas.status + (downloadStutas.progress < 1 ? downloadStutas.progress : '') }} </el-tag>

                    <div class="garbage" v-show="status === 0" @click="() => {
                        deleteFile?.(index)
                    }">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </div>
                    </div>

        </div>
    </div>
</template>

<style scoped lang="scss">
.file_item {
    border-radius: 3px;
    outline: 1px solid #dfdfdf;
    width: 100%;
    display: table-row;
    font-weight: lighter;
    padding: 3px;
    /* vertical-align: middle; */
    background-color: #fff;
    /* padding-right: 5px; */

    /* border: 10px solid rgba(0,0,0,0); */
    /* border-spacing: 0; */
    &>.file_name {
        display: table-cell;
        padding: 8px;
    }

    &>div {
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        align-items: center;
        gap: 5px;
        padding: 3px;
        padding-right: 5px;

        &>.file_size {
            display: table-cell;
            padding: 5px;

            &>span {
                background-color: rgb(250, 250, 250);
                border: 1px solid rgb(223, 223, 223);
                padding: 2px 5px;
                font-size: 13px;
                border-radius: 3px;
            }
        }


        &>.garbage {
            display: table-cell;
            padding: 5px;
            text-align: center;
            vertical-align: middle;
            height: 100%;

            &>div {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

}
</style>
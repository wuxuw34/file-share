<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as QRcode from 'qrcode'
import { selectAll, copyText } from '../utils/textOperate'
import { handlePickUpCode } from '../utils/handleURL'

type Props = {
    code: string | undefined | null,
    title: string,
    type: string
}
type Emits = {
    (e: 'onchange', value: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()
const qrRef = ref<null | HTMLCanvasElement>()

watch(() => props.code, () => {
    createQRcode()
})

onMounted(() => {
    createQRcode()
})

function createQRcode() {
    if (props.code) {
        QRcode.toCanvas(qrRef.value, props.code, {
            width: 148,
            height: 148
        }, (err: any) => {
            if (err) console.error(err);
            console.log('二维码生成成功');
        })
    }
}

function copy() {

    if (props.code) {
        copyText(props.code)
    }
}

</script>
    
<template>
    <div class="qr_code">
        <div class="title">
            <span>{{ title }}</span>
        </div>
        <div class="container">
            <div>
                <label class="pickup_title">取件码</label>
                <span @click="selectAll" @dblclick="copy" class="pickup_code">{{ code }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                @click="()=>{
                    copyText(code!)
                }"
                >
                    <path fill="currentColor"
                        d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 0 1-1.75 1.75H8.774a1.75 1.75 0 0 1-1.75-1.75Zm1.75-.25a.25.25 0 0 0-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25Z" />
                    <path fill="currentColor"
                        d="M1.995 10.749a1.75 1.75 0 0 1 1.75-1.751H5.25a.75.75 0 1 1 0 1.5H3.745a.25.25 0 0 0-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.51a.75.75 0 1 1 1.5 0v1.51A1.75 1.75 0 0 1 13.25 22h-9.5A1.75 1.75 0 0 1 2 20.25z" />
                </svg>
            </div>
            <div>
                <label class="pickup_title">取件链接</label>
                <span @click="selectAll" @dblclick="copy" class="urls">{{ handlePickUpCode(type, code!) }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click="()=>{
                    copyText(handlePickUpCode(type, code!)!)
                }">
                    <path fill="currentColor"
                        d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 0 1-1.75 1.75H8.774a1.75 1.75 0 0 1-1.75-1.75Zm1.75-.25a.25.25 0 0 0-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25Z" />
                    <path fill="currentColor"
                        d="M1.995 10.749a1.75 1.75 0 0 1 1.75-1.751H5.25a.75.75 0 1 1 0 1.5H3.745a.25.25 0 0 0-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.51a.75.75 0 1 1 1.5 0v1.51A1.75 1.75 0 0 1 13.25 22h-9.5A1.75 1.75 0 0 1 2 20.25z" />
                </svg>
            </div>
            <!-- <button @click="copy">复制</button> -->
            <div style="align-items: flex-start;">
                <label class="pickup_title">扫码取件</label>
                <canvas id="qr" ref="qrRef" height="148" width="148"></canvas>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.qr_code {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;

    &>.container {
        gap: 5px;
        max-width: 270px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        svg{
            width: 16px;
            height: 16px;
            padding:3px;

            &:hover{
                color:#1890ff;
            }
        }

        &>div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            label {
                width: fit-content;
                min-width: 50px;
                text-wrap: nowrap;
                text-align: left;
            }

            .pickup_title {
                padding-right: 20px;
            }

            .pickup_code {
                border-radius: 3px;
                padding: 3px 5px;
                border: 1px solid #bcbcbc;
            }

            .urls {
                text-align: left;
                text-wrap: nowrap;
                max-width: 200px;
                overflow-x: auto;
                background-color: #e4e4e4;
                border-radius: 5px;
                padding: 3px 10px;
                color: #1890ff;

                &::-webkit-scrollbar {
                    visibility: hidden;
                    height: 0;
                }
            }
        }

    }
}

.title {
    display: table;
    justify-content: center;
    width: 100%;
    white-space: nowrap;
    text-align: center;
    font-size: 16px;
    padding-bottom: 10px;

    &>span {
        padding: 3px 5px;
    }

    &::before {
        content: '';
        width: 50%;
        position: relative;
        height: 1px;
        top: 50%;
        display: table-cell;
        border-top: 1px solid #e8e8e8;
        transform: translateY(50%);
    }

    &::after {
        content: '';
        width: 50%;
        position: relative;
        height: 1px;
        top: 50%;
        display: table-cell;
        border-top: 1px solid #e8e8e8;
        transform: translateY(50%);
    }
}
</style>

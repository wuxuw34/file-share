<script setup lang="ts">
import { ref } from 'vue'
import Qrcode from './Qrcode.vue'

type Props = {
    text?: string | undefined
}
type Emits = {
    (e: 'update:text', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const textVal = ref<any>(props.text || '')
const textRef = ref<HTMLTextAreaElement | null>()
let flag: boolean = false
const code = ref<string | null>()
const loading = ref<boolean>(false)

// 输入完成后调用
function handleChange(e: Event) {
    textVal.value = e
    emits('update:text', textVal.value)
}

// 输入文字时调用，判断是否处于中文拼音输入法环境
function handleInput(e: Event) {
    if (!flag) {
        textVal.value = e
    }
}

// 复制时调用，调用浏览器clipboard api
function copyText() {
    // 没有数据则不复制
    if (textVal.value) {
        navigator.clipboard.writeText(textVal.value)
    }
}

// 读取剪切板时调用,赋值给当前展示的数据
function readTextFromClipboard() {
    navigator.clipboard.readText().then(t => {
        textVal.value = t
    })
}

// 清除数据
function clearAll() {
    textRef.value!.value = ''
    textVal.value = null
}


function sendText() {
    loading.value = true
    fetch(window.$baseURL + 'texts', {
        method: 'POST',
        body: JSON.stringify({
            content: textVal.value
        })
    }).then(r => r.json())
        .then(res => {
            const { data, state } = res
            if (state) {
                // 上传成功
                code.value = data.code
            } else {

            }
        }).finally(() => {
            loading.value = false
        })

}

function getText(text:string){
    textVal.value = text
}

defineExpose({
    getText
})


</script>

<template>
    <div class="texts">
        <div class="operate_bnt">
            <el-button-group>
                <el-button @click="copyText">复制</el-button>
                <el-button @click="readTextFromClipboard">粘贴</el-button>
                <el-button @click="clearAll">清空</el-button>
            </el-button-group>
        </div>
        <el-input v-loading="loading" element-loading-text="正在发送文本" @compositionstart="() => {
            flag = true // 表示此时正在进行中文拼音输入
        }" @compositionend="(e: Event) => {
    flag = false
    handleInput(e)
}" type="textarea" @input="handleInput" class="input-style"
@change="handleChange" v-model="textVal" ref="textRef"
            placeholder="此处输入需要发送的文本" />
        <div>
            <span class="tips">*当前已输入字数: {{ textVal?.length }}</span>
        </div>
        <el-button type="primary" @click="sendText">发送</el-button>
        <Qrcode v-show="code" :code="code" title="接收文本" type="text" />
    </div>
</template>

<style scoped lang="scss">
.texts {
    width: 100%;
    padding: 3px;

    .operate_bnt {
        display: flex;
        justify-content: end;
        padding-right: 6px;
    }

    .input-style{
        font-size: 18px;
    }
    .tips {
        color: rgb(96 96 96);
        font-size: 13px;
    }
}
</style>

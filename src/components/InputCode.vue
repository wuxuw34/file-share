<script setup lang="ts">
import { ref, inject } from 'vue'
import { scan } from '../utils/Scanner';

defineProps<{
    value: string | undefined
}>()
const emits = defineEmits<{
    (e: 'update:value', value: string): void,
    (e: 'search'): void
}>()
const queryTypeByCode = inject('queryTypeByCode') as (value: string) => void

const scanStutas = ref<string>()
// let stopFn: any = null

function scanCode() {
    const { stop } = scan((value: string) => {
        console.log('扫描结果为:' + value);
        emits('update:value', value)
        emits('search')
        stop()
    }, () => {
        scanStutas.value = '扫描失败'
    })
    // stopFn = stop
}

function handleClick() {
    emits('search')
}

</script>

<template>
    <div class="input_code">
        <span class="scan" id="scanBnt" @click="scanCode">
            <svg t="1704197908148" fill="currentColor" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="4194" width="28" height="28">
                <path
                    d="M192 416C172.8 416 160 403.2 160 384L160 256c0-51.2 44.8-96 96-96l128 0c19.2 0 32 12.8 32 32S403.2 224 384 224L256 224C236.8 224 224 236.8 224 256l0 128C224 403.2 211.2 416 192 416z"
                    p-id="4195"></path>
                <path
                    d="M384 864 256 864c-51.2 0-96-44.8-96-96l0-128c0-19.2 12.8-32 32-32S224 620.8 224 640l0 128c0 19.2 12.8 32 32 32l128 0c19.2 0 32 12.8 32 32S403.2 864 384 864z"
                    p-id="4196"></path>
                <path
                    d="M768 864l-128 0c-19.2 0-32-12.8-32-32s12.8-32 32-32l128 0c19.2 0 32-12.8 32-32l0-128c0-19.2 12.8-32 32-32s32 12.8 32 32l0 128C864 819.2 819.2 864 768 864z"
                    p-id="4197"></path>
                <path
                    d="M832 416c-19.2 0-32-12.8-32-32L800 256c0-19.2-12.8-32-32-32l-128 0C620.8 224 608 211.2 608 192S620.8 160 640 160l128 0c51.2 0 96 44.8 96 96l0 128C864 403.2 851.2 416 832 416z"
                    p-id="4198"></path>
                <path
                    d="M832 544 192 544C172.8 544 160 531.2 160 512S172.8 480 192 480l640 0c19.2 0 32 12.8 32 32S851.2 544 832 544z"
                    p-id="4199"></path>
            </svg>
        </span>
        <input type="text" maxlength="5" pattern="[0-9a-zA-Z]{5}" placeholder="请输入取件码" :value="value" @input="(e: Event) => {
            $emit('update:value', (e.target as HTMLInputElement).value)
        }" />
        <button @click="handleClick">接收</button>
    </div>
</template>

<style scoped lang="scss">
.input_code {
    display: flex;
    align-items: center;
    padding: 5px;
    box-shadow: 0 0 10px 1px rgba(167, 167, 167, .75);
    border-radius: 5px;

    .scan {
        padding: 2px;
        display: flex;
        align-items: center;
        border: 1px $gray_color solid;

        &>svg {
            color: $primary_color;
        }
    }

    button {
        height: 32px;
        background-color: #3b97f3;
        border: none;
        color: white;
        padding: 0 8px;
        margin-left: 5px;
        border-radius: 3px;

        &:hover {
            background-color: $primary_color;
        }

        &:active {
            background-color: #077aed;
        }
    }

    input {
        height: 32px;
        border: 1px $gray_color solid;
        font-size: 16px;
        padding: 0 4px;
        text-align: center;
        letter-spacing: 2px;
        width: 120px;
        transition: all 0.3s ease-in;

        &::placeholder {
            letter-spacing: 0;
        }

        &:focus {
            outline: none;
            width: 150px;
            border-color: $primary_color;
            box-shadow: 0 0 8px -2px $primary_color;
        }

        &:invalid {
            border-color: red;
            box-shadow: 0 0 8px -2px red;
        }
    }
}
</style>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{
    v?: boolean
}>()
</script>

<template>
    <Transition :name="v?'slide':'slide_reverse'">
        <slot></slot>
    </Transition>
</template>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active,
.slide_reverse-enter-active,
.slide_reverse-leave-active 
{
    transition: opacity 0.5s ease,translate 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    translate: -100px;
}
.slide_reverse-enter-from,
.slide_reverse-leave-to{
    opacity: 0;
    translate: 0px;
}
</style>
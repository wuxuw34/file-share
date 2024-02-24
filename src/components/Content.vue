<script setup lang="ts">

defineProps<{
    showInfo?: boolean,
    class:string
}>()

</script>

<template>
    <div class="content_container">
        <div :class="class">
            <slot></slot>
        </div>
        <div class="info" v-show="showInfo">
            <slot name="info"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content_container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid $gray_color;
    background-color: rgba(243, 243, 246, 0.75);
    min-height: 200px;
    font-size: 16px;
    padding: 8px 10px;
    gap: 5px;
    box-sizing: border-box;
    border-radius: 5px;

    .info {
        background-color: white;
        width: 100%;
        border: 1px solid $gray_color inset;
        display: flex;
        gap: 5px;
        padding: 3px 8px;
        box-sizing: border-box;
    }

    &:hover {
        border: 1px solid $primary_color;
        box-shadow: 0 0 2px 1px rgb(182 215 241);
        outline: none;
    }

}
</style>
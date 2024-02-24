<script setup lang="ts">


</script>

<template>
    <div class="header">
        <nav class="navbar">
            <div class="title">
                互传
            </div>
            
        </nav>
    </div>
</template>

<style scoped lang="scss">

.header {
    height: 64px;
    background-color: rgb(30, 122, 215);
    box-shadow: 0 0 10px 1px rgba(167,167,167,.75);
}
.navbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    width: var(--width);
    .title {
        color: rgb(255, 255, 255);
        line-height: 64px;
        font-size:24px;
    }
}
</style>

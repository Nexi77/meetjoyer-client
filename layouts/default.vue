<script setup lang="ts">
const isMenuOpened = ref(false);
</script>

<template>
    <div class="full-screen-site">
        <div class="site-wrapper">
            <Menu :is-menu-opened="isMenuOpened" />
            <div class="site">
                <Header @menu-change="isMenuOpened = !isMenuOpened" />
                <div class="content">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.site-wrapper {
    display: flex;
}

.site {
    width: 100%;
}

.content {
    padding: 20px;
}
</style>

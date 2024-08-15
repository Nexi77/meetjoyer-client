<script setup lang="ts">
interface Props {
    isMenuOpened: boolean;
}

defineProps<Props>();
</script>

<template>
    <nav class="site-menu" :class="{ extended: isMenuOpened }">
        <p class="logo">
            Meetjoyer
        </p>
    </nav>
</template>

<style lang="scss" scoped>
.site-menu {
    text-align: center;
    background-color: var(--accent-400);
    height: 100%;
    min-height: 100vh;
    min-width: 300px;
    position: absolute;
    transform: translateX(-300px);
    transition: transform 0.3s ease-in-out;

    &.extended {
        transform: translateX(0);
    }

    @media screen and (width <= 768px) {
        min-width: 100vw;
        transform: translateX(-100vw);
    }

    @media screen and (width >= 968px) {
        transform: translateX(0);
    }
}

.logo {
    font-family: Lexend, sans-serif;
    font-weight: 600;
    height: 66px;
    display: inline-block;
    padding-block: 10px;
    width: 100%;
    font-size: 1.875rem;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--half-white-400);
}
</style>

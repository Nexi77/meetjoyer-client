<template>
    <section class="full-screen-site centered-section">
        <slot />
    </section>
</template>

<style lang="scss" scoped>
section {
    background-image: url('@images/bg_waves.svg');
    background-repeat: no-repeat;
    background-size: 120% 150%;

    @media screen and (width >= 740px) {
        background-image: url('@images/bg_waves.svg');
        background-size: 100% 100%;
    }
}
</style>

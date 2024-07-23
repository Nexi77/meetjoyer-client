<template>
    <section class="full-screen-site centered-section">
        <slot />
    </section>
</template>

<style lang="scss" scoped>
section {
    background-image: url('@images/bg_waves.svg');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>

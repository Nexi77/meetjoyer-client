<template>
    <header>
        <NuxtLink to="/profile">
            <UiUserAvatar :image-url="useAuthStore().userImage" />
        </NuxtLink>
        <button class="menu-toggle" title="Menu toggle" @click="$emit('menu-change')">
            <span />
            <span />
            <span />
        </button>
    </header>
</template>

<style lang="scss" scoped>
header {
    height: 66px;
    padding-block: 10px;
    padding-inline: 20px;
    gap: 10px;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid var(--half-white-400);
    align-items: center;
}

.menu-toggle {
    display: flex;
    background-color: transparent;
    border: 0;
    width: 40px;
    position: relative;
    z-index: 1002;
    flex-direction: column;
    gap: 5px;

    span {
        display: inline-block;
        width: 100%;
        height: 3px;
        border-radius: 5px;
        background-color: var(--white-400);
    }

    @media screen and (width >= 968px) {
        display: none;
    }
}
</style>

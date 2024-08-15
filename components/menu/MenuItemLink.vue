<template>
    <li class="menu-link">
        <slot />
    </li>
</template>

<style lang="scss" scoped>
.menu-link {
    min-width: 214px;
    padding: 12px 10px;
    border-radius: var(--base-radius);
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &:has(.router-link-active) {
        background-color: var(--asset-400);
    }

    :slotted(a) {
        color: var(--white-400);
        text-decoration: unset;
        font-weight: 300;
    }

    :slotted(svg){
        width: 30px;
        height: 30px;
        fill: var(--white-400);
    }
}
</style>

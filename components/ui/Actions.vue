<template>
    <div class="actions">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: flex-end;
    margin-bottom: 20px;

@media screen and (width >= 768px){
        flex-direction: row;
    }
}
</style>

<script setup lang="ts">
</script>

<template>
    <section>
        <div class="dashboard-header">
            <h1>Lectures you want to participate in</h1>
            <NuxtLink :to="{ name: 'lectures', query: { type: 'mine' }}" class="asset-button">
                Show all
            </NuxtLink>
        </div>
        <ListsLecturesList type="mine" :in-home="true" />
    </section>
</template>

<style lang="scss" scoped>
.dashboard-header{
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;

    @media screen and (width > 768px){
        flex-direction: row;
    }
}
</style>

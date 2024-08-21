<script setup lang="ts">

</script>

<template>
    <section>
        <UiTabs :active-index="0">
            <UiTab title="Ongoing Events" :index="0">
                <ListsEventList type="ongoing" />
            </UiTab>
            <UiTab title="Upcoming Events" :index="1">
                <ListsEventList type="upcoming" />
            </UiTab>
            <UiTab title="My Events" :index="2">
                <ListsEventList type="mine" />
            </UiTab>
        </UiTabs>
    </section>
</template>

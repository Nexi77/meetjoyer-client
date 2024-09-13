<script setup lang="ts">
interface Props {
    activeIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    activeIndex: 0
});

const slots = useSlots();
const children = computed(() => slots.default ? slots.default() : []);
const tabTitles = computed(() => children.value.map(child => child.props?.title));
const selectedIndex = ref(props.activeIndex);

const setSelectedIndex = (e: Event) =>
{
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    const index = button?.dataset.index;

    if (index)
        selectedIndex.value = Number(index);
};

provide('selectedIndex', selectedIndex);
</script>

<template>
    <div class="tabs">
        <ul class="tabs-header" @click="setSelectedIndex">
            <li v-for="(title, index) in tabTitles" :key="index">
                <button class="clean tab-header" :class="{'active': index === selectedIndex}" :data-index="index">
                    {{ title }}
                </button>
            </li>
        </ul>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.tabs-header {
    display: flex;
    padding: 0;
    margin-top: 0;
    flex-direction: column;
    list-style-type: none;
    gap: 20px;
    margin-bottom: 20px;

    @media screen and (width >= 680px) {
        flex-direction: row;
    }

    li {
        position: relative;
    }

    li:not(:last-child)::after {
        display: inline-block;
        height: 100%;
        position: absolute;
        width: 3px;
        left: calc(100% + 8.5px);
        border-radius: var(--base-radius);
        background-color: var(--white-400);

        @media screen and (width >= 680px) {
            content: '';
        }
    }

    .tab-header {
        padding: 1rem;
        text-align: center;
        font-weight: bold;
        border: 0;
        width: 100%;
        border-radius: var(--base-radius);
        transition: background-color 0.3s ease;

        &:hover {
            background-color: var(--white-400-hover);
        }

        &.active {
            background-color: var(--asset-400);
            color: var(--white-400);

            &:hover {
                background-color: var(--asset-400-hover);
            }
        }
    }
}
</style>

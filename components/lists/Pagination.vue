<script setup lang="ts">
import { useAppStore } from '~~/stores/app';

interface Props {
    pagerIndentifier: string
}

const route = useRoute();
const router = useRouter();
const store = useAppStore();
const props = defineProps<Props>();
const pager = computed(() => store.pagers[props.pagerIndentifier]);
const pageFromQuery = computed(() => route.query.page as string || null);

const emits = defineEmits(['change']);

const getUrl = (index: number) =>
{
    pager.value!.page = index;
    router.push({ name: route.name as string, params: route.params, query: { page: index } });

    emits('change');
};

const pages = computed((): number[] =>
{
    if (!pager.value) return [];

    const pagesArray = [];

    const min = Math.max(pager.value!.page - 2, 1) + 1;
    const max = Math.min(pager.value!.page + 2, pager.value!.total) - 1;

    for (let i = min; i <= max; i++)
    {
        pagesArray.push(i);
    }

    return pagesArray;
});

watchEffect(() =>
{
    if (pageFromQuery.value)
        pager.value!.page = Number(pageFromQuery.value);
    else pager.value!.page = 1;
});
</script>

<template>
    <nav v-if="pager?.total" class="pagination">
        <ul class="page-list">
            <li v-if="pager.page === 1" class="page-item disabled arrow">
                <span class="page-link arrow">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M18 17L13 12L18 7M11 17L6 12L11 7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                </span>
            </li>
            <li v-else class="page-item arrow">
                <button class="page-link arrow clean" type="button" title="Previous page" @click="getUrl(pager!.page - 1)">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M15 6L9 12L15 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                </button>
            </li>

            <li class="page-item">
                <button type="button" class="page-link clean" tabindex="-1" :class="{'page-active': pager.page === 1}" @click="getUrl(1)">
                    {{ 1 }}
                </button>
            </li>

            <template v-if="pages.length">
                <li v-if="pages[0] - 1 > 2" class="page-item">
                    <span class="dots">...</span>
                </li>
                <li v-else-if="pages[0] - 1 === 2" class="page-item">
                    <button type="button" class="page-link clean" :class="{'page-active': pager.page === 2}" tabindex="-1" @click="getUrl(2)">
                        {{ 2 }}
                    </button>
                </li>
            </template>

            <li v-for="i of pages" :key="i" class="page-item">
                <button type="button" class="page-link clean" :class="{'page-active': pager.page === i}" @click="getUrl(i)">
                    {{ i }}
                </button>
            </li>

            <template v-if="pages.length">
                <li v-if="pages[pages.length - 1] + 1 < pager.total - 1" class="page-item">
                    <span class="dots">...</span>
                </li>
                <li v-else-if="pages[pages.length - 1] + 1 === pager.total - 1" class="page-item">
                    <button type="button" class="page-link clean" tabindex="-1" @click="getUrl(2)">
                        {{ pager.total - 1 }}
                    </button>
                </li>
            </template>

            <li v-if="pager.total > 1" class="page-item">
                <button type="button" class="page-link clean" :class="{'page-active': pager.page === pager.total}" @click="getUrl(pager!.total)">
                    {{ pager.total }}
                </button>
            </li>

            <li v-if="pager.page == pager.total" class="page-item disabled">
                <span class="page-link arrow">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                </span>
            </li>
            <li v-else class="page-item arrow">
                <button type="button" class="page-link arrow clean" title="Next strona" @click="getUrl(pager!.page + 1)">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 17L11 12L6 7M13 17L18 12L13 7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                </button>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
.pagination {
    display: flex;
    justify-content: flex-end;
    position: relative;
    padding: 40px;
    flex-direction: column;
    background-color: var(--color-white);
    box-shadow: 0 10px 20px rgb(48 49 51 / 7%), 0 2px 7px rgb(40 41 42 / 10%), inset 0 0 0 1px var(--clr-gray-300);
    border-radius: 7px;
    margin-block: 20px;
    gap: 30px;

    svg {
        width: 30px;
    }

    button {
        background-color: transparent;
        border: 0;
    }
}

.page-list {
    margin: 0;
    list-style-type: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.page-link.page-active {
    background-color: var(--asset-400);
    color: var(--white-400);
}

.page-item {
    background-color: var(--white-400);
    border-radius: var(--base-radius);
    color: var(--primary-400);
    width: 42px;
    overflow: hidden;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(.arrow, .disabled){
        border: 2px solid var(--asset-400);
    }

    span, button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    &.disabled {
        background-color: var(--half-white-400);
        cursor: not-allowed;
    }
}
</style>

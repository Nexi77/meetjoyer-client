<script setup lang="ts">
import { reset } from '@formkit/core';

const isFiltersExpanded = ref(false);

interface Emits {
    (e: 'search', value?: Record<string, unknown>): void
}

const emits = defineEmits<Emits>();
const uuid = crypto.randomUUID();

function onSubmit(data: Record<string, unknown>)
{
    emits('search', data);
}

function resetFilters()
{
    reset(uuid);
    emits('search');
}
</script>

<template>
    <div class="collapse-wrapper">
        <div class="collapse-header">
            <p>Filters</p>
            <button type="button" class="clean" @click="isFiltersExpanded = !isFiltersExpanded">
                <svg v-if="!isFiltersExpanded" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
                <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </g></svg>
            </button>
        </div>
        <div class="collapse" :class="{ expanded: isFiltersExpanded }">
            <div class="content">
                <FormKit :id="uuid" type="form" :actions="false" @submit="onSubmit">
                    <div class="filters-grid">
                        <slot />
                    </div>
                    <div class="actions">
                        <button type="button" class="reset" @click="resetFilters">
                            Reset
                        </button>
                        <button type="submit" @click="resetFilters">
                            Search
                        </button>
                    </div>
                </FormKit>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--primary-400);

    button {
        min-width: 200px;
    }
}

.collapse-wrapper {
    background-color: var(--white-400);
    padding: 10px;
    border-radius: var(--base-radius);
    color: var(--primary-400);
    margin-bottom: 20px;

    button {
        background-color: var(--asset-400);
        display: flex;
        color: var(--white-400);
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: var(--base-radius);
        padding: 10px;
        transition: background-color 0.3s ease;

        &:hover {
            &:hover {
                background: var(--asset-400-hover)
            }
        }
    }

    svg{
        width: 35px;

       path {
        stroke: var(--white-400);
       }
    }
}

.collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    p {
        margin: 0
    }
}

.collapse {
    display: grid;
    width: 100%;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;

    &.expanded {
        grid-template-rows: 1fr;
    }

    .content {
        overflow: hidden;
    }
}

.filters-grid {
    display: grid;
    gap: 10px;

    @media screen and (width >= 768px){
        grid-template-columns: repeat(auto-fit, minmax(auto, 300px));
    }
}
</style>

<style>
.collapse .content label {
    font-size: 1.1rem;
}

.collapse .content input {
    border: 2px solid var(--primary-400);
}
</style>

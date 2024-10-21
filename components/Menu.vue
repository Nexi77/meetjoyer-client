<script setup lang="ts">
import Permission from './ui/Permission.vue';

interface Props {
    isMenuOpened: boolean;
}

defineProps<Props>();

const route = useRoute();

function isPartOfRoute(routePath: string, exact = false)
{
    if (exact)
    {
        return route.fullPath === `/${routePath}`;
    }

    return route.fullPath.startsWith(`/${routePath}`) && route.fullPath.split('/').length <= routePath.split('/').length + 1;
}
</script>

<template>
    <nav class="site-menu" :class="{ extended: isMenuOpened }">
        <NuxtLink class="logo" to="/">
            Meetjoyer
        </NuxtLink>
        <ul>
            <MenuItemLink>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M20 4.026h2V7H2V4.026h2v-1H1V21h22V3.026h-3zM22 20H2V8.026h20zM7 4.026v-1h10v1zM5 2h1v3H5zm13 0h1v3h-1zM9.209 17.309L12 15.28l2.791 2.028-1.066-3.281L16.515 12h-3.449L12 8.719 10.934 12h-3.45l2.791 2.028zM11.66 13l.34-1.046.34 1.046h1.097l-.888.646.34 1.044-.889-.645-.889.645.34-1.044-.889-.646z" /><path fill="none" d="M0 0h24v24H0z" /></g></svg>
                <NuxtLink to="/events" :class="{ 'router-link-active': isPartOfRoute('events') }">
                    Events
                </NuxtLink>
            </MenuItemLink>
            <MenuItemLink>
                <svg
                    id="Layer_1"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512.001 512.001"
                    xml:space="preserve"
                ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M72.519,313.78v7.86c0,25.409,10.701,51.112,29.598,70.519c19.627,20.156,45.074,31.257,71.902,31.257 s52.426-11.101,72.053-31.257c18.898-19.407,29.749-45.11,29.749-70.519v-7.86H72.519z M234.798,381.192 c-16.644,17.092-38.228,26.505-60.778,26.505c-22.55,0-44.135-9.413-60.778-26.505c-14.095-14.475-22.917-32.958-24.867-51.692 h171.29C257.714,348.234,248.893,366.717,234.798,381.192z" /> </g> </g> <g> <g> <path d="M239.038,204.795c-16.284,0-29.532,13.248-29.532,29.533c0,16.284,13.248,29.532,29.532,29.532 c16.285,0,29.533-13.248,29.533-29.532S255.324,204.795,239.038,204.795z M239.038,248.141c-7.617,0-13.813-6.197-13.813-13.813 c0-7.618,6.197-13.814,13.813-13.814c7.618,0,13.814,6.197,13.814,13.814C252.852,241.945,246.656,248.141,239.038,248.141z" /> </g> </g> <g> <g> <path d="M102.986,204.795c-16.284,0-29.532,13.248-29.532,29.533c0,16.284,13.248,29.532,29.532,29.532 s29.532-13.248,29.532-29.532S119.27,204.795,102.986,204.795z M102.986,248.141c-7.617,0-13.813-6.197-13.813-13.813 c0-7.618,6.197-13.814,13.813-13.814s13.813,6.197,13.813,13.814C116.799,241.945,110.602,248.141,102.986,248.141z" /> </g> </g> <g> <g> <path d="M425.824,45.859H375.15c-47.517,0-86.176,38.659-86.176,86.176v29.466c-31.6-27.768-72.54-43.399-114.954-43.399 C78.065,118.103,0,196.167,0,292.122s78.065,174.02,174.019,174.02c95.955,0,174.02-78.065,174.02-174.02 c0-4.604-0.204-9.222-0.564-13.813h78.349c47.517,0,86.176-38.659,86.176-86.176v-60.097 C512,84.518,473.342,45.859,425.824,45.859z M174.019,450.423c-87.286,0-158.3-71.014-158.3-158.301s71.014-158.301,158.3-158.301 c43.414,0,85.13,18.004,114.954,49.484v95.003h42.732c0.396,4.586,0.614,9.207,0.614,13.813 C332.32,379.409,261.306,450.423,174.019,450.423z M496.281,192.132c0,38.85-31.607,70.457-70.457,70.457H304.693V132.035 c0-38.85,31.607-70.457,70.457-70.457h50.674c38.85,0,70.457,31.607,70.457,70.457V192.132z" /> </g> </g> <g> <g> <rect x="352.322" y="90.565" width="95.364" height="15.719" /> </g> </g> <g> <g> <rect x="335.555" y="123.051" width="128.898" height="15.719" /> </g> </g> <g> <g> <rect x="335.555" y="153.442" width="128.898" height="15.719" /> </g> </g> <g> <g> <rect x="335.555" y="185.929" width="128.898" height="15.719" /> </g> </g> <g> <g> <rect x="335.555" y="218.415" width="89.076" height="15.719" /> </g> </g> <g> <g> <path d="M187.834,275.768c0,3.633-2.956,6.59-6.59,6.59h-14.449c-3.633,0-6.59-2.956-6.59-6.59h-15.719 c0,12.301,10.008,22.309,22.309,22.309h14.449c12.301,0,22.309-10.008,22.309-22.309H187.834z" /> </g> </g> </g></svg>
                <NuxtLink to="/lectures" :class="{ 'router-link-active': isPartOfRoute('lectures') }">
                    Lectures
                </NuxtLink>
            </MenuItemLink>
            <Permission :accept="['ADMIN']">
                <MenuItemLink>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M12 1.2A4.8 4.8 0 1 0 16.8 6 4.805 4.805 0 0 0 12 1.2zm0 8.6A3.8 3.8 0 1 1 15.8 6 3.804 3.804 0 0 1 12 9.8zM20 22H4v-4.5A5.506 5.506 0 0 1 9.5 12h5a5.506 5.506 0 0 1 5.5 5.5zM5 21h14v-3.5a4.505 4.505 0 0 0-4.5-4.5h-5A4.505 4.505 0 0 0 5 17.5z" /><path fill="none" d="M0 0h24v24H0z" /></g></svg>
                    <NuxtLink to="/users" :class="{ 'router-link-active': isPartOfRoute('users') }">
                        Users
                    </NuxtLink>
                </MenuItemLink>
            </Permission>
            <Permission :accept="['SPEAKER']">
                <MenuItemLink>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M12 1.2A4.8 4.8 0 1 0 16.8 6 4.805 4.805 0 0 0 12 1.2zm0 8.6A3.8 3.8 0 1 1 15.8 6 3.804 3.804 0 0 1 12 9.8zM20 22H4v-4.5A5.506 5.506 0 0 1 9.5 12h5a5.506 5.506 0 0 1 5.5 5.5zM5 21h14v-3.5a4.505 4.505 0 0 0-4.5-4.5h-5A4.505 4.505 0 0 0 5 17.5z" /><path fill="none" d="M0 0h24v24H0z" /></g></svg>
                    <NuxtLink to="/lectures/speaker" :class="{ 'router-link-active': isPartOfRoute('lectures/speaker', true) }">
                        Hosted lectures
                    </NuxtLink>
                </MenuItemLink>
            </Permission>
        </ul>
        <Logout />
    </nav>
</template>

<style lang="scss" scoped>
.site-menu {
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: var(--accent-400);
    min-height: 100vh;
    min-width: 300px;
    position: absolute;
    z-index: 1001;
    transform: translateX(-300px);
    transition: transform 0.3s ease-in-out;

    &.extended {
        transform: translateX(0);
    }

    @media screen and (width <= 768px) {
        min-width: 100vw;
        transform: translateX(-100vw);
    }

    @media screen and (width >= 968px) {
        transform: translateX(0);
        position: static;
    }
}

.logo {
    font-family: Lexend, sans-serif;
    font-weight: 600;
    color: inherit;
    text-decoration: unset;
    height: 66px;
    display: inline-block;
    padding-block: 10px;
    width: 100%;
    font-size: 1.875rem;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--half-white-400);
}

ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style-type: none;
}
</style>

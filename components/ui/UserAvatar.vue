<script lang="ts" setup>
import ImageePlaceholder from '@images/image_placeholder.png';
interface Props {
    imageUrl?: string;
    size?: number;
}

withDefaults(defineProps<Props>(), {
    size: 50
});
</script>

<template>
    <div class="user-avatar">
        <div class="user-avatar-image" :style="`height: ${size}px; width: ${size}px;`">
            <img :src="imageUrl || ImageePlaceholder" alt="user avatar">
        </div>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.user-avatar {
    display: flex;
    align-items: center;
    gap: 18px;
}

.user-avatar-image {
    border-radius: 100%;
    overflow: hidden;

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

}
</style>

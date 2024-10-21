<script lang="ts" setup>
interface Props {
    isLoading: boolean;
    message: string;
}

defineProps<Props>();
</script>

<template>
    <div v-if="isLoading" class="fullscreen-loader">
        <div class="loader-content">
            <p>{{ message }}...</p>

            <UiLoader />
        </div>
    </div>
</template>

  <style scoped>
  .fullscreen-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 95%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loader-content {
    color: white;
    font-size: 2rem;
    text-align: center;
  }
  </style>

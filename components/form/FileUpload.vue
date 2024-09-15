<script setup lang="ts">
import { reset } from '@formkit/core';
import EmptyImage from '@images/image_placeholder.png';
interface Props {
    label: string;
    buttonText: string;
}

defineProps<Props>();

const randomId = crypto.randomUUID();
const imagePreview = ref<string | null>(null);
const selectedFile = ref<any | null>(null);

function imageChanged(e: Event)
{
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;

    if (file)
    {
        selectedFile.value = file;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) =>
        {
            imagePreview.value = e.target?.result as string;
        };

        reader.readAsDataURL(file);
    }
    else
    {
        selectedFile.value = null;
        imagePreview.value = null;
    }
}

function removeImage()
{
    selectedFile.value = null;
    imagePreview.value = null;
    reset(randomId, null);
}
</script>

<template>
    <div class="file-upload">
        <div class="file-preview">
            <p class="file-upload-label">
                {{ label }}
            </p>
            <p v-if="!imagePreview" class="preview-text">
                Selected image can be seen here as a preview
            </p>
            <button v-if="selectedFile" type="button" title="Remove image" @click="removeImage">
                &#10005;
            </button>
            <div class="image-wrapper">
                <img :src="imagePreview || EmptyImage" alt="">
            </div>
        </div>
        <label class="form-upload" :for="randomId">
            {{ buttonText }}
            <FormKit
                :id="randomId"
                type="file"
                name="image"
                accept=".jpg"
                :value="selectedFile"
                :model-value="selectedFile"
                @change="imageChanged"
            />
        </label>
    </div>
</template>

<style lang="scss" scoped>
.file-upload {
    display: flex;
    flex-direction: column;
    position: relative;
}

.file-preview {
    margin-bottom: 10px;
    border-radius: var(--base-radius);
    overflow: hidden;
    position: relative;

    .preview-text {
        position: absolute;
        color: var(--primary-400);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        margin: 0;
        text-shadow: 2px 2px 8px rgb(0 0 0 / 70%);
    }

    .file-upload-label {
        font-weight: 300;
    }

    button {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 35px;
        height: 35px;
        padding: 0;
        border-radius: 100%;
        border: 2px solid var(--asset-400);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--primary-400);
        color: var(--white-400);
        line-height: 2;
    }
}

.image-wrapper {
    height: 350px;
    border-radius: var(--base-radius);
    overflow: hidden;

    img {
        width: 100%;
        height: 350px;
        object-fit: cover;
        object-position: center;
    }
}
</style>

<script setup lang="ts">
interface Props {
    title: string;
    message?: string;
}

interface Emits {
    (e: 'confirm', value: number): void;
    (e: 'cancel'): void;
}

defineProps<Props>();

const emit = defineEmits<Emits>();
const dialog = ref<HTMLDialogElement | null>(null);
const itemId = ref<string | number | null>(null);

const openDialog = () =>
{
    if (dialog.value && !dialog.value.open)
    {
        dialog.value.showModal();
    }
};

const closeDialog = () =>
{
    if (dialog.value && dialog.value.open)
    {
        dialog.value.close();
    }
};

const confirm = () =>
{
    emit('confirm', itemId.value as number);
    closeDialog();
};

const cancel = () =>
{
    emit('cancel');
    closeDialog();
};

function handleConfirmEvent(event: Event)
{
    const customEvent = event as CustomEvent;
    const { id } = customEvent.detail;

    if (id)
    {
        itemId.value = id;
        openDialog();
    }
    else
    {
        itemId.value = null;
        closeDialog();
    }
}

onMounted(() => window.addEventListener('confirm', handleConfirmEvent));

onUnmounted(() => window.removeEventListener('confirm', handleConfirmEvent));
</script>

<template>
    <dialog ref="dialog" class="confirm-dialog">
        <h3>{{ title }}</h3>
        <p v-if="message">
            {{ message }}
        </p>
        <div class="dialog-actions">
            <button class="btn-confirm" @click="confirm">
                Confirm
            </button>
            <button class="btn-cancel" @click="cancel">
                Cancel
            </button>
        </div>
    </dialog>
</template>

  <style scoped lang="scss">
  .confirm-dialog {
    border: none;
    border-radius: 8px;
    padding: 1.5rem;
    width: 300px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

    &::backdrop {
        background-color: rgb(0 0 0 / 50%);
    }
  }

  .dialog-actions {
    display: flex;
    justify-content: space-between;
  }

  h3 {
    text-align: center;
  }

  .btn-confirm {
    background-color: #4caf50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;

    &:hover {
        background-color: #218838;
    }
  }

  .btn-cancel {
    background-color: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;

    &:hover {
        background-color: #c82333;
    }
  }

  button {
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  }
</style>

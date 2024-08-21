import type { ToastInterface } from 'vue-toastification';
import type { ApiModel } from './composables';

export interface PluginsInjections {
    $toast: ToastInterface
    $api: ApiModel
}

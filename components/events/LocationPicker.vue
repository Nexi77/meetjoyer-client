<script setup lang="ts">
interface Emits {
    (e: 'locationSet', value: [number, number]): void
}

const emits = defineEmits<Emits>();
const center = ref<[number, number]>([50.0369, 21.9993]);
const selectedLocation = ref<[number, number] | null>(null);
const selectedLocationName = ref('');

interface NomatimResponse {
    display_name: string;
    lat: string;
    lon: string;
}

async function handleMapClick(event: any)
{
    const { lat, lng } = event.latlng;

    selectedLocation.value = [lat, lng];
    await fetchOSMObject(selectedLocation.value);

    if (selectedLocation.value)
        emits('locationSet', selectedLocation.value);
}

async function fetchOSMObject(latAndLng: [number, number])
{
    try
    {
        const result = await $fetch<NomatimResponse>(`https://nominatim.openstreetmap.org/reverse?lat=${latAndLng[0]}&lon=${latAndLng[1]}&format=json`);

        selectedLocation.value = [Number(result.lat), Number(result.lon)];
        selectedLocationName.value = result.display_name;
    }
    catch (error)
    {
        selectedLocationName.value = `Unknown location, coordinates: ${selectedLocation.value?.[0]}, ${selectedLocation.value?.[1]}`;
    }
}
</script>

<template>
    <LMap
        style="height: 350px; border-radius: 10px;"
        :zoom="16"
        :center="center"
        :use-global-leaflet="false"
        @click="handleMapClick"
    >
        <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base"
            name="OpenStreetMap"
        />

        <LMarker v-if="selectedLocationName && selectedLocation" :lat-lng="selectedLocation">
            <LPopup>
                {{ selectedLocationName }}
            </LPopup>
        </LMarker>
    </LMap>
</template>

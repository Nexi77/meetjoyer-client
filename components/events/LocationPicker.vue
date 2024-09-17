<script setup lang="ts">
import type { EventGeolocation } from '~/types/api';
import type { NominatimResponse } from '~/types/global';

interface Emits {
    (e: 'locationSet', value: [number, number]): void
}

interface Props {
    geolocation?: EventGeolocation;
}

const emits = defineEmits<Emits>();
const props = defineProps<Props>();
const center = ref<[number, number]>([50.0369, 21.9993]);
const selectedLocation = ref<[number, number] | null>(null);
const selectedLocationName = ref('');
const map = ref<any>(null);

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
        const result = await $fetch<NominatimResponse>(`https://nominatim.openstreetmap.org/reverse?lat=${latAndLng[0]}&lon=${latAndLng[1]}&format=json`);

        selectedLocation.value = [Number(result.lat), Number(result.lon)];
        selectedLocationName.value = result.display_name;
        center.value = selectedLocation.value;
        setMapCenter();
    }
    catch (error)
    {
        selectedLocationName.value = `Unknown location, coordinates: ${selectedLocation.value?.[0]}, ${selectedLocation.value?.[1]}`;
    }
}

if (props.geolocation)
{
    selectedLocation.value = [props.geolocation.lat, props.geolocation.lng];
    fetchOSMObject(selectedLocation.value);
}

function setMapCenter()
{
    const mapLeaflet = map.value.leafletObject ?? null;

    mapLeaflet.setView(selectedLocation.value, 16);
}
</script>

<template>
    <LMap
        ref="map"
        style="height: 350px; border-radius: 10px;"
        :zoom="16"
        :center="center"
        :use-global-leaflet="false"
        @click="handleMapClick"
        @ready="setMapCenter"
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

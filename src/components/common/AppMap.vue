<template>
  <div ref="mapContainer" class="w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-800"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  lat: number
  lng: number
  title?: string
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView([props.lat, props.lng], 13)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  marker = L.marker([props.lat, props.lng]).addTo(map)
  if (props.title) {
    marker.bindPopup(props.title).openPopup()
  }
})

watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (map && marker) {
    const latLng = L.latLng(newLat, newLng)
    map.setView(latLng, 13)
    marker.setLatLng(latLng)
  }
})
</script>

<style>
/* Fix for Leaflet icon issues in some builds */
.leaflet-default-icon-path {
  background-image: url(https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png);
}
</style>

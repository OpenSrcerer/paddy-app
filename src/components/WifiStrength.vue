<template>
  <q-icon :style="`font-size: ${size};`" id="wifi-strength" :name="getIconNameFromRssi(rssi)"/>
</template>

<script setup lang="ts">

import { getIconNameFromRssi } from 'src/utils/RssiUtils';

interface WifiStrengthProps {
  size: string;
  rssi?: number;
}
defineProps<WifiStrengthProps>()

</script>

<style scoped lang="scss">
.q-icon {
  margin: 0 1rem 0 0;
}
</style>

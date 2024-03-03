<template>
  <q-page class="row items-center justify-evenly">
    <div id="container" >
      <h4>Paddy {{ padId }}</h4>

      <label>Wifi SSID:</label>
      <input type="text" v-model="ssidForm"><br><br>

      <label>Wifi Password:</label>
      <input type="text" v-model="passForm"><br><br>

      <div>
        <BLESetupButton @setupBLE="injectCredentials"/>
        <button @click="togglePad">Toggle</button>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BLESetupButton from 'components/BLESetupButton.vue';
import { ref } from 'vue';
import { sendSsidAndPass } from 'src/bluetooth/BLEService';
import pad from 'src/backend/pad/PadPaddyBackendClient';
import { useRoute } from 'vue-router';

const route = useRoute();

const padId = ref(route.params.id)
const ssidForm = ref()
const passForm = ref()

const injectCredentials = () => {
  sendSsidAndPass(ssidForm.value, passForm.value)
}

const togglePad = () => {
  pad.toggle(padId.value as string)
}
</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

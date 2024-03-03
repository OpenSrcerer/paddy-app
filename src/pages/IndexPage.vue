<template>
  <q-page class="row items-center justify-evenly">
    <div id="container">
      <label>Wifi SSID:</label>
      <input type="text" v-model="ssidForm"><br><br>

      <label>Wifi Password:</label>
      <input type="text" v-model="passForm"><br><br>

      <div>
        <BLESetupButton @setupBLE="injectCredentials"/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BLESetupButton from 'components/BLESetupButton.vue';
import { ref } from 'vue';
import { sendSsidAndPass } from 'src/bluetooth/BLEService';
import pad from 'src/backend/pad/PadPaddyBackendClient';

const ssidForm = ref()
const passForm = ref()

pad.getAllUserPads()

const injectCredentials = () => {
  sendSsidAndPass(ssidForm.value, passForm.value)
}
</script>

<style scoped lang="scss">
#id {
  display: flex;
  flex-direction: column;
}
</style>

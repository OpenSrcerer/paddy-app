<template>
  <q-page class="row items-center justify-evenly">
    <div id="container" >
      <h4>Daemon {{ daemonId }}</h4>

      <label>Wifi SSID:</label>
      <input type="text" v-model="ssidForm"><br><br>

      <label>Wifi Password:</label>
      <input type="text" v-model="passForm"><br><br>

      <div>
        <BLESetupButton @setupBLE="injectCredentials"/>
        <button @click="toggleDaemon">Toggle</button>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BLESetupButton from 'components/BLESetupButton.vue';
import { ref } from 'vue';
import { sendSsidAndPass } from 'src/bluetooth/BLEService';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRoute } from 'vue-router';

const route = useRoute();

const daemonId = ref(route.params.id)
const ssidForm = ref()
const passForm = ref()

const injectCredentials = () => {
  sendSsidAndPass(ssidForm.value, passForm.value)
}

const toggleDaemon = () => {
  daemon.toggle(daemonId.value as string)
}
</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

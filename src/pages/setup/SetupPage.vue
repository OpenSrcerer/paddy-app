<template>
  <q-page class="row items-center justify-evenly">

    <div v-if="!store.daemon || !store.id" class="container">
      <h5>Add new Daemon!</h5>

      <button type="button" @click="onInit">Init Setup</button>
    </div>

    <div v-else-if="!store.wpaType" class="container">
      <h5>Wifi Security Type:</h5>

      <button type="button" @click="store.wpaType = 'P'">Personal</button>
      <br><br>
      <button type="button" @click="store.wpaType = 'E'">Enterprise</button>
    </div>

    <div v-else-if="!store.ssid" class="container">
      <label>Wifi SSID:</label>
      <input type="text" v-model="ssidForm"><br><br>

      <label v-if="!store.isWifiEnterprise">Wifi Password:</label>
      <input v-if="!store.isWifiEnterprise" type="password" v-model="passForm"><br><br>

      <label v-if="store.isWifiEnterprise">Enterprise Username:</label>
      <input v-if="store.isWifiEnterprise" type="password" v-model="eUsernameForm"><br><br>

      <label v-if="store.isWifiEnterprise">Enterprise Password:</label>
      <input v-if="store.isWifiEnterprise" type="password" v-model="ePasswordForm"><br><br>

      <button type="button" @click="onSubmit">Submit</button>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useSetupStore } from 'stores/setup';
import { config, disconnect, init } from 'src/bluetooth/BleService';
import { ref } from 'vue';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useSetupStore()

const ssidForm = ref("");
const passForm = ref("");
const eUsernameForm = ref("");
const ePasswordForm = ref("");

const onInit = async () => {
  const device = await init()

  const daemonRes = await daemon.createDaemon(device.id)
  if (!daemonRes) {
    return;
  }

  store.daemon = device.daemon
  store.id = device.id
  store.jwt = daemonRes.jwt
}

const onSubmit = async () => {
  store.ssid = ssidForm.value
  store.pass = passForm.value
  store.eUsername = eUsernameForm.value
  store.ePassword = ePasswordForm.value

  await config(store) // Push config to Daemon
  await disconnect(store.daemon?.deviceId) // Disconnect

  store.$reset()
  await router.replace('home'); // Go to list of devices
}
</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

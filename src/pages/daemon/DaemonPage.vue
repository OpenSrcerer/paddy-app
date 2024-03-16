<template>
  <q-page class="row items-center justify-evenly">
    <div id="container" >
      <h4>Daemon {{ daemonId }}</h4>

      <button @click="toggleDaemon">Toggle</button>
      <br><br>
      <button @click="resetDaemon">Reset</button>
      <br><br>
      <button @click="deleteDaemon">Delete</button>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRoute, useRouter } from 'vue-router';
import { init, reset } from 'src/bluetooth/BleService';

const route = useRoute();
const router = useRouter()

const daemonId = ref(route.params.id)

const toggleDaemon = () => {
  daemon.toggle(daemonId.value as string)
}

const resetDaemon = async () => {
  const device = await init()
  await reset(device)
}

const deleteDaemon = async () => {
  await daemon.delete(daemonId.value as string)
  await router.replace('home')
}
</script>

<style scoped lang="scss">
</style>

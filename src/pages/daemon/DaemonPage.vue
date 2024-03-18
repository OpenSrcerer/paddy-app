<template>
  <q-page class="row items-center justify-evenly">
    <div id="container" >
      <h4>Daemon {{ daemonId }}</h4>
      <h5>Status: {{ daemonLastPing }}</h5>
      <h5>Active: {{ daemonStateFormatted }}</h5>

      <div id="buttons">
        <button @click="toggleDaemon">Toggle</button>
        <br><br>
        <button @click="resetDaemon">Reset</button>
        <br><br>
        <button @click="deleteDaemon">Delete</button>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRoute, useRouter } from 'vue-router';
import { init, reset } from 'src/bluetooth/BleService';
import moment from 'moment';

const route = useRoute();
const router = useRouter()

const daemonId = ref(route.params.id)
const daemonLastPing = ref('...')
const daemonState = ref<boolean | undefined>(undefined)

onBeforeMount(async () => updateDaemonData())

const daemonStateFormatted = computed(() => {
  if (daemonState.value === undefined) { return '...' }
  if (daemonState.value === true) { return 'Yes' }
  if (daemonState.value === false) { return 'No' }
  return 'Unknown'
})

const toggleDaemon = async () => {
  await daemon.toggle(daemonId.value as string)
  await updateDaemonData()
}

const resetDaemon = async () => {
  const device = await init()
  await reset(device)
}

const deleteDaemon = async () => {
  await daemon.delete(daemonId.value as string)
  await router.replace('home')
}

const updateDaemonData = async () => {
  console.log("1", daemonState.value)
  const res = await daemon.getDaemon(daemonId.value as string)
  if (!res) { return; }

  daemonState.value = res.on

  if (!res?.lastPing) { daemonLastPing.value = 'Unknown'; return }
  if ((Date.now() / 1000) - res.lastPing < 60) { daemonLastPing.value = 'Online'; return }

  daemonLastPing.value = `Last ping ${moment(res.lastPing * 1000).fromNow()}`
}
</script>

<style scoped lang="scss">
#container {
  text-align: center;
}

#buttons {
  display: flex;
  gap: 1.5rem;
}
</style>

<template>
  <q-page class="column items-center justify-evenly">
    <div id="chart"></div>

    <div id="container">
      <div class="vertical">
        <h4>Daemon {{ daemonId }}</h4>
        <h5>Status: {{ daemonLastPing }}</h5>
        <h5>Active: {{ daemonStateFormatted }}</h5>
      </div>

      <br><br>

      <div class="horizontal">
        <button @click="toggleDaemon">Toggle</button>
        <br><br>
        <button @click="resetDaemon">Reset</button>
        <br><br>
        <button @click="deleteDaemon">Delete</button>
      </div>

      <br><br>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRoute, useRouter } from 'vue-router';
import { init, reset } from 'src/bluetooth/BleService';
import moment from 'moment';
import ApexCharts from 'apexcharts';
import power from 'src/backend/power/PowerPaddyBackendClient';

const route = useRoute();
const router = useRouter()

const daemonId = ref(route.params.id)
const daemonLastPing = ref('...')
const daemonState = ref<boolean | undefined>(undefined)

onBeforeMount(async () => {
  await Promise.all([
    updateDaemonData(),
    loadChartData()
  ])
})

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
  const res = await daemon.getDaemon(daemonId.value as string)
  if (!res) { return; }

  daemonState.value = res.on

  if (!res?.lastPing) { daemonLastPing.value = 'Unknown'; return }
  if ((Date.now() / 1000) - res.lastPing < 60) { daemonLastPing.value = 'Online'; return }

  daemonLastPing.value = `Last ping ${moment(res.lastPing * 1000).fromNow()}`
}

const loadChartData = async () => {
  const powers = await power.getAllDaemonPowers(daemonId.value as string)

  const options = {
    chart: { type: 'line' },
    series: [{
      name: 'Power Draw (W)',
      data: powers.map(p => p.w)
    }],
    xaxis: {
      categories: powers.map(p => new Date(p.timestamp * 1000)
        .toLocaleTimeString('en-US', { hour12: false }))
    }
  }

  const chart = new ApexCharts(document.querySelector("#chart"), options);
  await chart.render();
}

</script>

<style scoped lang="scss">
#chart {
  min-width: 30%;
}

h4, h5 {
  margin: 0;
}

#container {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.vertical {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.horizontal {
  display: flex;
  gap: 1.5rem;
  justify-content: space-around;
}
</style>

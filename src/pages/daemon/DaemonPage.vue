<template>

  <q-page class="grid-container">

    <div class="horizontal">
      <div id="power-chart"></div>
    </div>

    <div class="column items-center justify-center">
      <div class="vertical">
        <h4>Daemon {{ daemonId }}</h4>
        <h5>Status: {{ daemonLastPing }}</h5>
        <h5>Active: {{ daemonStateFormatted }}</h5>
      </div>

      <br><br>

      <div class="horizontal">
        <q-btn @click="toggleDaemon">Toggle</q-btn>
        <q-btn @click="resetDaemon">Reset</q-btn>
        <q-btn @click="deleteDaemon">Delete</q-btn>
      </div>

      <br><br>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRoute, useRouter } from 'vue-router';
import { init, reset } from 'src/bluetooth/BleService';
import moment from 'moment';
import ApexCharts from 'apexcharts';
import power from 'src/backend/power/PowerPaddyBackendClient';
import * as apexcharts from 'apexcharts';

const route = useRoute();
const router = useRouter()

const daemonId = ref(route.params.id)
const daemonLastPing = ref('...')
const daemonState = ref<boolean | undefined>(undefined)

const chart = ref<ApexCharts>()
const timerId = setInterval(async () => await loadChartData(), 10000);

onBeforeMount(async () => await updateDaemonData())

onMounted(async () => await makeChart())

onUnmounted(() => {
  clearInterval(timerId);
});

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

const makeChart = async () => {
  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      height: '90%'
    },
    title: {
      text: 'Power Draw'
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.3)', // Color of the grid lines
      strokeDashArray: 4, // Stroke dash array for dashed lines
      yaxis: {
        lines: {
          show: true // Show horizontal grid lines
        }
      }
    },
    // dataLabels: {
    //   enabled: true,
    //   style: {
    //     colors: ['#ff0000'] // Red color
    //   }
    // },
    series: [],
    xaxis: {},
    noData: { text: 'Loading...' },
  }

  const newChart = new ApexCharts(document.querySelector("#power-chart"), options);
  await newChart.render();
  chart.value = newChart;

  await loadChartData()
}

const loadChartData = async () => {
  const powers = await power.getAllDaemonPowers(daemonId.value as string, { limit: 10 })
  await chart.value?.updateOptions({
    series: [{
      name: 'Power Draw (W)',
      data: powers.map(p => p.w),
      color: '#b262cf'
    }],
    xaxis: {
      categories: powers.map(p => new Date(p.timestamp * 1000)
        .toLocaleTimeString('en-US', { hour12: false })),
      labels: {
        style: {
          colors: powers.map(_ => 'ghostwhite') // Red color
        }
      }
    },
    yaxis: {
      labels: {
        maxTicks: 5,
        style: {
          colors: powers.map(_ => 'ghostwhite') // Red color
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
#power-chart {
  min-width: 80%;
}

h4, h5 {
  margin: 0;
}

.grid-container {
  display: grid;
  width: 100%;
}

.grid-container > div:nth-of-type(2) {
  width: 100%;
  border-top: ghostwhite 1px solid;
  text-align: center;
}

.vertical {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.q-btn {
  min-width: 5rem;
  color: ghostwhite;
  border: ghostwhite 1px solid;
}

.horizontal {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>

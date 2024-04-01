<template>

  <MainLayout>
    <template #toolbar>
      <DaemonComponent :dense="true" :daemon="daemonRef"/>
      <q-toggle
        :model-value="daemonRef.on"
        icon="bolt"
        size="3rem"
        @click="toggleDaemon"
      />
    </template>

    <q-page v-if="!!daemonRef" class="grid-container">

      <div class="d-items-container">
        <div>
          <div class="horizontal">
            <q-btn @click="resetDaemon">Reset</q-btn>
            <q-btn @click="deleteDaemon">Delete</q-btn>
          </div>
        </div>

        <div id="schedules">
          <h5 v-for="schedule in daemonSchedules" :key="schedule.id">{{ schedule.periodic }}</h5>
        </div>
      </div>

      <div class="horizontal">
        <div id="power-chart"></div>
      </div>
    </q-page>

    <div class="column items-center justify-center" v-else><LoadingSpinner/></div>
  </MainLayout>

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
import { Daemon, getBadgeColor, getDaemonStatus } from 'src/backend/daemon/dto/Daemon';
import DaemonComponent from 'components/DaemonComponent.vue';
import LoadingSpinner from 'components/LoadingSpinner.vue';
import { Schedule } from 'src/backend/schedule/dto/Schedule';
import schedule from 'src/backend/schedule/SchedulePaddyBackendClient';
import MainLayout from 'layouts/MainLayout.vue';

const route = useRoute();
const router = useRouter()

const daemonId = ref(route.params.id)
const daemonRef = ref<Daemon | undefined>({
  id: daemonId.value as string,
  on: false,
  lastPing: 0
})
const daemonSchedules = ref<Array<Schedule>>([])

const chart = ref<ApexCharts>()
const pollIntervalId = setInterval(
  async () => await Promise.all([loadChartData(), updateDaemonData()]),
  10000
);

onBeforeMount(async () => await updateDaemonData())
onMounted(async () => await makeChart())
onUnmounted(() => { clearInterval(pollIntervalId); });

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
  const dRes = await daemon.getDaemon(daemonId.value as string)
  if (!dRes) { return; }
  const sRes = (await schedule.getAllSchedules(daemonId.value as string)) ?? []

  daemonRef.value = dRes;
  daemonSchedules.value = sRes;
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
      color: '#aa0aaa'
    }],
    xaxis: {
      categories: powers.map(p => new Date(p.timestamp * 1000)
        .toLocaleTimeString('en-US', { hour12: false })),
      labels: {
        style: {
          colors: powers.map(_ => 'ghostwhite')
        }
      }
    },
    yaxis: {
      labels: {
        maxTicks: 5,
        style: {
          colors: powers.map(_ => 'ghostwhite')
        }
      }
    }
  })
}
</script>

<style lang="scss">
body {
  overflow-y: visible;
}
</style>

<style scoped lang="scss">
h4, h5 {
  margin: 0;
}

#power-chart {
  min-width: 80%;
}

#schedules {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.d-items-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.d-items-container > * {
  flex: 1 1 auto;
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
  padding: 0 1rem 0 1rem;
}

.name-chip-wrapper {
  flex-wrap: nowrap !important;
}
</style>

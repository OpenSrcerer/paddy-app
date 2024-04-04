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

    <div v-if="!!daemonRef">
      <OverView
        v-if="routeView == 'OVER'"

        :powers="daemonPowers"
      />
      <ScheduleView v-else-if="routeView == 'SCHD'"/>
      <StatisticsView v-else-if="routeView == 'STAT'"/>
    </div>

    <div v-else class="column items-center justify-center">
      <LoadingSpinner/>
    </div>

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
import { Power } from 'src/backend/power/dto/Power';
import OverView from 'pages/daemon/views/OverView.vue';
import ScheduleView from 'pages/daemon/views/ScheduleView.vue';
import StatisticsView from 'pages/daemon/views/StatisticsView.vue';

const route = useRoute();
const router = useRouter()

const daemonId = ref(route.params.id)
const daemonRef = ref<Daemon | undefined>({
  id: daemonId.value as string,
  on: false,
  lastPing: 0
})
const daemonSchedules = ref<Array<Schedule>>([])
const daemonPowers = ref<Array<Power>>([])

const pollIntervalId = setInterval(async () => await updateDaemonData(), 10000);

onBeforeMount(async () => await updateDaemonData())
onUnmounted(() => { clearInterval(pollIntervalId); });

const routeView = computed((): 'OVER' | 'SCHD' | 'STAT' => {
  const view = route.params?.view ?? 'OVER';

  if (view == 'schedules') return 'SCHD'
  else if (view == 'statistics') return 'STAT';
  else return 'OVER';
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
  const dRes = await daemon.getDaemon(daemonId.value as string)
  if (!dRes) { return; }
  const sRes = (await schedule.getAllSchedules(daemonId.value as string)) ?? []
  const pRes = (await power.getAllDaemonPowers(daemonId.value as string, { limit: 10 })) ?? []

  daemonRef.value = dRes;
  daemonSchedules.value = sRes;
  daemonPowers.value = pRes;
}
</script>

<style scoped lang="scss">

</style>

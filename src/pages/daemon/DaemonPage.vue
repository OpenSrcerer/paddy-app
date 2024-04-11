<template>

  <MainLayout :navLinks="navLinks" :actionLinks="actionLinks">
    <template #toolbar>
      <DaemonComponent v-if="!!daemonRef" :dense="true" :daemon="daemonRef"/>
      <q-toggle
        v-if="!!daemonRef"
        :model-value="daemonRef.on"
        icon="bolt"
        size="3rem"
        :disable="getDaemonStatus(daemonRef) == 'Unknown'"
        @click="toggleButtonEvent"
      />
    </template>

    <ScheduleDialog v-model="scheduleAlert" @created="createSchedule"/>

    <DialogComponent
      v-model="alert"

      :icon="scheduleToDelete ? 'timer_off' : shouldReset ? 'build' : 'delete_forever'"
      :title="scheduleToDelete ? 'Schedule Delete' : shouldReset ? 'Reset Daemon' : 'Delete Daemon'"
      close-button="Cancel"
      :persistent="false"
      :buttons="scheduleToDelete ? ['Remove'] : alertError ? [] : shouldReset ? ['reset'] : ['delete']"
      :dangerous="true"

      @reset="deleteResetDaemon"
      @delete="deleteResetDaemon"
      @remove="deleteSchedule"
      @closed="resetAlert"
    >
      <div v-if="alertError">
        <p>{{ alertError }}</p>
      </div>

      <div v-else-if="scheduleToDelete">
        <p>Are you sure you want to delete this schedule?</p>
        <p>Your daemon will no longer turn on/off at the specified time.</p>
      </div>

      <div v-else-if="shouldReset">
        <p>
          Are you sure you want to reset your Daemon?
          <br><br>
          To recover your daemon, go to the home screen and tap <b>Add / Recover Daemon</b>.
          <br><br>
          Your data will <b>not</b> be deleted.
        </p>
      </div>

      <div v-else>
        <p>
          Are you sure you want to delete your Daemon?
          <br><br>
          <b>All your daemon data will be erased.</b> That means all your schedules and power measurements will be gone.
          <br><br>
          You can re-add your daemon anytime from the home screen by tapping <b>Add / Recover Daemon</b>.
        </p>
      </div>
    </DialogComponent>

    <div style="height: 100%; width: 100%;" v-if="!!daemonRef">
      <OverView
        v-if="routeView == 'OVER'"
        :powers="daemonPowers"
      />
      <ScheduleView
        v-else-if="routeView == 'SCHD'"
        :schedules="daemonSchedules"

        @reload="reloadSchedules"
        @delete="scheduleDeleteAlert"
        @close="resetAlert"
      />
      <StatisticsView
        v-else-if="routeView == 'STAT'"
        v-model="temporal"
        :cumulative-usage="daemonTotalPower"
        :average-usage="daemonAveragePwr"
        :rolling-usage="daemonRollingPwr"
      />
    </div>

    <div v-else class="column items-center justify-center">
      <LoadingSpinner/>
    </div>
  </MainLayout>

</template>

<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRoute, useRouter } from 'vue-router';
import { init, reset } from 'src/bluetooth/BleService';
import { Daemon, getDaemonStatus } from 'src/backend/daemon/dto/Daemon';
import DaemonComponent from 'components/DaemonComponent.vue';
import LoadingSpinner from 'components/LoadingSpinner.vue';
import { Schedule } from 'src/backend/schedule/dto/Schedule';
import schedule from 'src/backend/schedule/SchedulePaddyBackendClient';
import MainLayout from 'layouts/MainLayout.vue';
import OverView from 'pages/daemon/views/OverView.vue';
import ScheduleView from 'pages/daemon/views/ScheduleView.vue';
import StatisticsView from 'pages/daemon/views/StatisticsView.vue';
import DialogComponent from 'components/DialogComponent.vue';
import ScheduleDialog from 'components/ScheduleDialog.vue';
import { PowerStatistic } from 'src/backend/stats/dto/PowerStatistic';
import stats, { PowerTemporal } from 'src/backend/stats/StatsPaddyBackendClient';

const route             = useRoute();
const router            = useRouter()

const daemonId          = ref<string>(route.params.id as string)
const daemonRef         = ref<Daemon | undefined>(undefined)

const alert             = ref<boolean>(false)
const alertError        = ref<string | undefined>(undefined)
const shouldReset       = ref<boolean>(false)

const daemonSchedules   = ref<Array<Schedule>>([])
const scheduleToDelete  = ref<string | undefined>(undefined)
const scheduleAlert     = ref<boolean>(false)

const daemonPowers      = ref<Array<PowerStatistic>>([])
const daemonRollingPwr  = ref<Array<PowerStatistic>>([])
const daemonAveragePwr  = ref<Array<PowerStatistic>>([])
const daemonTotalPower  = ref<PowerStatistic | undefined>(undefined)
const temporal          = ref<PowerTemporal>('DAY')

const pollIntervalId = setInterval(async () => await updateDaemonData(), 10000);

onBeforeMount(async () => await updateDaemonData())
onUnmounted(() => { clearInterval(pollIntervalId); });

watch(() => temporal.value, async () => await reloadCharts())

const daemonIsOnline = computed(() => getDaemonStatus(daemonRef.value as Daemon) == 'Online')
const toggleButtonEvent = computed(() => getDaemonStatus(
  daemonRef.value as Daemon) == 'Unknown' ? undefined : toggleDaemon)

const routeView = computed((): 'OVER' | 'SCHD' | 'STAT' => {
  const view = route.params?.view ?? 'OVER';

  if (view == 'schedules') return 'SCHD'
  else if (view == 'statistics') return 'STAT';
  else return 'OVER';
})

const toggleDaemon = async () => {
  if (daemonRef.value) {
    daemonRef.value.on = !daemonRef.value?.on
  }

  await daemon.toggle(daemonId.value)
  await daemon.getDaemon(daemonId.value)
}

const deleteResetDaemon = async () => {
  try {
    if (!daemonIsOnline.value) {
      const device = await init()
      await reset(device)
    }

    if (shouldReset.value) {
      await daemon.reset(daemonId.value)
    } else {
      await daemon.delete(daemonId.value)
    }

    await router.replace('/home')
  } catch (e) {
    alertError.value = e as string
  }
}

const updateDaemonData = async () => {
  const dRes = await daemon.getDaemon(daemonId.value)
  if (!dRes) { return; }

  daemonRef.value = dRes;
  daemonSchedules.value = (await schedule.getAllSchedules(daemonId.value)) ?? [];
  daemonPowers.value = (await stats.getAverageStatsPower(daemonId.value, {
    temporal: 'MINUTE',
    limit: 10
  })) ?? [];
  daemonTotalPower.value = (await stats.getTotalPower(daemonId.value));

  await reloadCharts()
}

const reloadCharts = async () => {
  daemonRollingPwr.value = (await stats.getRollingAveragePower(daemonId.value, {
    temporal: temporal.value,
    limit: 15
  }))
  daemonAveragePwr.value = (await stats.getAverageStatsPower(daemonId.value, {
    temporal: temporal.value,
    limit: 15
  }))
}

const reloadSchedules = async (done: (() => void) | undefined = undefined) => {
  daemonSchedules.value = (await schedule.getAllSchedules(daemonId.value)) ?? []
  if (!!done) done()
}

const deleteSchedule = async () => {
  alert.value = false
  await schedule.delete(scheduleToDelete.value as string, daemonId.value)
  await reloadSchedules()
}

const scheduleDeleteAlert = (scheduleId: string) => {
  scheduleToDelete.value = scheduleId
  alert.value = true
}

const resetAlert = () => {
  scheduleToDelete.value = undefined
  alertError.value = undefined
}

const createSchedule = async (newSchedule: Partial<Schedule>) => {
  await schedule.createSchedule(newSchedule, daemonId.value)
  await router.replace(`/daemon/${daemonId.value}/schedules`)
  await reloadSchedules()
}

const navLinks = [
  {
    title: 'Daemon',
    caption: 'Overview for your Daemon',
    icon: 'space_dashboard',
    route: `/daemon/${daemonId.value}`
  },
  {
    title: 'Schedules',
    caption: 'Manage your Daemon\'s schedules',
    icon: 'alarm',
    route: `/daemon/${daemonId.value}/schedules`
  },
  {
    title: 'Insights',
    caption: 'View your Daemon\'s power statistics',
    icon: 'insights',
    route: `/daemon/${daemonId.value}/statistics`
  }
]

const actionLinks = computed(() => [
  {
    title: 'Add Schedule',
    caption: 'Toggle your Daemon on a schedule',
    icon: 'alarm_add',
    action: () => {
      alertError.value = undefined
      scheduleAlert.value = true
    },
  },
  {
    title: 'Reset Daemon',
    caption: 'Reset your Daemon to factory settings',
    icon: 'build',
    action: () => {
      alertError.value = undefined
      shouldReset.value = true
      alert.value = true
    },
  },
  {
    title: 'Delete Daemon',
    caption: 'Resets & deletes your Daemon',
    icon: 'delete_forever',
    dangerous: true,
    action: () => {
      alertError.value = undefined
      shouldReset.value = false
      alert.value = true
    }
  },
])
</script>

<style scoped lang="scss">
</style>

<template>

  <DialogComponent
    v-model="model"

    icon="alarm_add"
    title="Add Schedule"
    close-button="Cancel"
    :buttons="dialogButtons"
    @closed="clear"

    @next="alertStep = getStep"
    @finish="finish(); clear();"
  >
    <div class="schedule-selector" v-if="alertStep == 'INIT'">
      <div id="single-periodic-selector">
        <p :class="schedulePeriodic ? 'gray' : ''">Once</p>
        <q-toggle
          :model-value="schedulePeriodic"
          :icon="schedulePeriodic ? 'replay' : 'done'"
          size="3rem"
          @click="schedulePeriodic = !schedulePeriodic"
        />
        <p :class="schedulePeriodic ? '' : 'gray'">Repeat</p>
      </div>

      <q-option-group
        v-model="scheduleType"
        :options="[
          { label: 'ON', value: 'ON' },
          { label: 'OFF', value: 'OFF' },
          { label: 'TOGGLE', value: 'TOGGLE' }]"
        color="primary"
        inline
      />

      <q-select
        v-if="schedulePeriodic"
        clearable
        menu-anchor="bottom start"
        style="width: 15rem"
        input-debounce="0"
        label="Repeat"
        v-model="scheduleEvery"
        popup-content-style="width: 1px;"
        :options="[
          { label: 'Every Minute', value: 'MINUTE' },
          { label: 'Every Hour', value: 'HOUR' },
          { label: 'Every Day', value: 'DAY' },
          { label: 'Every Week', value: 'WEEK' },
          { label: 'Every Month', value: 'MONTH' }]"
        :dark="true"
      />

      <q-select
        use-input
        clearable
        menu-anchor="bottom start"
        style="width: 15rem"
        input-debounce="0"
        label="Timezone"
        v-model="scheduleTzSearch"
        popup-content-style="width: 1px;"
        :options="scheduleTimezones"
        :dark="true"
        @filter="findTimezone"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="schedule-selector" v-else-if="alertStep == 'TIME'">
      <q-time format24h dark v-model="scheduleDtModel" mask="YYYY-MM-DD HH:mm" color="purple" />
    </div>

    <div class="schedule-selector" v-else>
      <q-date dark no-unset
        v-model="scheduleDtModel"
        mask="YYYY-MM-DD HH:mm"
        color="purple"
      />
    </div>

  </DialogComponent>

</template>

<script setup lang="ts">
import { findTimeZone, getZonedTime, listTimeZones } from 'timezone-support';
import { computed, ref } from 'vue';
import { Schedule, ScheduleType } from 'src/backend/schedule/dto/Schedule';
import DialogComponent from 'components/DialogComponent.vue';

type AlertStep = 'INIT' | 'DATE' | 'TIME'
type ScheduleEvery = 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH'

const model = defineModel<boolean>();
const emit = defineEmits(['created'])

const tz: Array<string> = listTimeZones()

const alertStep         = ref<AlertStep>('INIT')
const scheduleType      = ref<ScheduleType | undefined>(undefined)
const scheduleTzSearch  = ref<string>('')
const scheduleTimezones = ref<Array<string>>(tz)
const schedulePeriodic  = ref<boolean>(false)
const scheduleDtModel   = ref<string | undefined>(undefined)
const scheduleEvery     = ref<{ label: string, value: ScheduleEvery }>({ label: 'Every Day', value: 'DAY' })

const skipCalendar = computed(() => schedulePeriodic.value &&
  (scheduleEvery.value.value == 'HOUR' ||
  scheduleEvery.value.value == 'DAY' ||
  scheduleEvery.value.value == 'MINUTE'))

const dialogButtons = computed(() => {
  if (alertStep.value == 'DATE') return ['finish'];
  if (alertStep.value == 'TIME' && skipCalendar.value) return ['finish'];

  return ['next']
})

const getStep = computed((): AlertStep => {
  if (scheduleDtModel.value)
    return 'DATE'

  if (scheduleType.value && scheduleTzSearch.value)
    return 'TIME'

  return 'INIT'
})

const findTimezone = (
  search: string,
  update: (callbackFn: () => void, afterFn: (() => void) | undefined) => void,
  abort: () => void
) => {
  if (search === '') {
    update(() => scheduleTimezones.value = tz, undefined)
    return
  }

  update(() => scheduleTimezones.value = tz.filter(
    zone => zone.toLowerCase().includes(search.toLowerCase())), undefined)
}

const clear = () => {
  scheduleType.value = undefined
  scheduleTzSearch.value = ''
  scheduleTimezones.value = tz
  schedulePeriodic.value = false
  scheduleDtModel.value = undefined
  scheduleEvery.value = { label: 'Every Day', value: 'DAY' }

  alertStep.value = getStep.value
}

const finish = () => {
  const regularTime = new Date(scheduleDtModel.value as string);
  const offsetTime = getZonedTime(regularTime, findTimeZone(scheduleTzSearch.value))

  const finalSchedule: Partial<Schedule> = {
    type: scheduleType.value,
    periodic: schedulePeriodic.value ? dateToCron(regularTime) : undefined,
    nextExecution: !schedulePeriodic.value ? offsetTime.epoch as number / 1000 : undefined,
    timezone: scheduleTzSearch.value
  }

  emit('created', finalSchedule)
  model.value = false;
}

const dateToCron = (date: Date): string => {
  const minutes = date.getMinutes();
  const hours = date.getHours();

  switch (scheduleEvery.value.value) {
    case 'MONTH':
      return `${minutes} ${hours} ${date.getDate()} * *`
    case 'WEEK':
      return `${minutes} ${hours} * * ${date.getDay()}`
    case 'DAY':
      return `${minutes} ${hours} * * *`
    case 'HOUR':
      return `${minutes} * * * *`
    case 'MINUTE':
      return `*/${minutes} * * * *`
  }
}
</script>

<style scoped lang="scss">
.dt-picker-container {
  background-color: $dark;
}

.schedule-selector {
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

#single-periodic-selector {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  p {
    margin: 0;
  }
}

.gray {
  color: gray;
}
</style>

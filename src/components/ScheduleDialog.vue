<template>

  <DialogComponent
    v-model="model"

    icon="alarm_add"
    title="Add Schedule"
    close-button="Cancel"
    :buttons="alertStep == 'DATE' ? ['finish'] : ['next']"
    @closed="clear"

    @next="alertStep = getStep"
    @finish="finish(); clear();"
  >
    <div class="schedule-selector" v-if="alertStep == 'INIT'">
      <div id="single-periodic-selector">
        <p :class="schedulePeriodic ? 'gray' : ''">Single</p>
        <q-toggle
          :model-value="schedulePeriodic"
          :icon="schedulePeriodic ? 'replay' : 'done'"
          size="3rem"
          @click="schedulePeriodic = !schedulePeriodic"
        />
        <p :class="schedulePeriodic ? '' : 'gray'">Periodic</p>
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
        use-input
        clearable
        menu-anchor="bottom start"
        style="width: 15rem"
        input-debounce="0"
        label="Timezone"
        v-model="scheduleTzSearch"
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
      <q-option-group
        v-if="schedulePeriodic"
        v-model="scheduleEvery"
        :options="[
          { label: 'Every Day', value: 'DAY' },
          { label: 'Every Week', value: 'WEEK' },
          { label: 'Every Month', value: 'MONTH' }]"
        color="primary"
        inline
      />
      <q-date dark
        :disable="schedulePeriodic && scheduleEvery == 'DAY'"
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
type ScheduleEvery = 'DAY' | 'WEEK' | 'MONTH'

const model = defineModel<boolean>();
const emit = defineEmits(['created'])

const tz: Array<string> = listTimeZones()

const alertStep         = ref<AlertStep>('INIT')
const scheduleType      = ref<ScheduleType | undefined>(undefined)
const scheduleTzSearch  = ref<string>('')
const scheduleTimezones = ref<Array<string>>(tz)
const schedulePeriodic  = ref<boolean>(false)
const scheduleDtModel   = ref<string | undefined>(undefined)
const scheduleEvery     = ref<ScheduleEvery>('DAY')

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
  scheduleEvery.value = 'DAY'

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

  let variablePart = '* * *';
  if (scheduleEvery.value == 'MONTH') {
    variablePart = `${date.getDate()} * *`
  } else if (scheduleEvery.value == 'WEEK') {
    variablePart = `* * ${date.getDay()}`
  }

  return `${minutes} ${hours} ${variablePart}`;
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

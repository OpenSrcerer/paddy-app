<template>
  <div class="schedule-wrapper">
    <q-badge
      class="schedule-type"
      outline
      :style="`color: ${scheduleColor};`">
      {{ schedule.type }}
    </q-badge>

    <q-knob
      readonly
      v-model="secondsUntil"
      :max="schedule.interval"
      track-color="grey-9"
      center-color="dark"
      show-value
      size="3rem"
      :style="`color: ${scheduleColor};`"
      class="schedule-timeuntil q-ma-md"
      :thickness="0.1"
    >
      <div style="font-size: 0.95rem; text-align: center;">
        {{ timeUntilSplit[0] }}

        <div v-if="timeUntilSplit.length > 1">
          {{ timeUntilSplit[1] }}
        </div>
      </div>
    </q-knob>

    <q-btn
      dense round outline
      icon="close"
      class="schedule-remove-button"
      @click.prevent="emit('delete', schedule.id)"
    />

    <div class="schedule-content">
      <h4 v-if="schedule.periodic">
        {{ cronstrue.toString(schedule.periodic as string, { verbose: false, use24HourTimeFormat: true }) }}
      </h4>
      <h4 v-else>
        {{ new Date(schedule.nextExecution * 1000).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
      </h4>
      <h5>Timezone: <span style="font-weight: 200">{{ schedule.timezone.replace("/", "-") }}</span></h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import cronstrue from 'cronstrue';
import { Schedule } from 'src/backend/schedule/dto/Schedule';
import { computed } from 'vue';
import moment from 'moment/moment';

export interface DaemonComponentProps {
  schedule: Schedule,
}
const props = defineProps<DaemonComponentProps>();
const emit = defineEmits(['delete'])

const scheduleColor = computed(() => {
  if (props.schedule.type == 'ON') return '#c4ff7c'
  else if (props.schedule.type == 'OFF') return '#ff6464'
  else return '#9090ff'
})

const secondsUntil = computed(() => props.schedule.secondsUntil)

const timeUntil = computed (() => {
  const duration = moment.duration(secondsUntil.value, 'seconds')

  // Extract days, hours, minutes, and seconds from the duration
  const years = duration.years()
  const months = duration.months()
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (years > 999) {
    return "rly?"
  } else if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}m`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
})

const timeUntilSplit = computed(() => timeUntil.value.split(' '))
</script>

<style lang="scss">
.schedule-remove-button .q-icon {
  transition: all 100ms ease-in-out;
  color: #ff6464;
}
</style>

<style scoped lang="scss">
h4, h5 {
  margin: 0;
}

@media(max-width: 375px) {
  .schedule-content {
    line-break: anywhere;
  }
}

.schedule-remove-button {
  position: absolute;
  border: 2px #ff6464 solid;
  top: -.75rem;
  right: -.75rem;
  background-color: $dark !important;
  transition: all 100ms ease-in-out;
}

.schedule-remove-button:hover {
  top: -1rem;
}

.q-badge {
  justify-content: center;
}

.schedule-timeuntil {
  position: absolute;
  top: -2rem;
  left: -2rem;
}

.schedule-content {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 1rem;
  text-align: center;
}

.schedule-type {
  height: 30%;
  font-size: 100%;
  font-weight: bold;
  background-color: $dark;
  position: absolute;
  top: -.75rem;
  min-width: 5rem;
  max-height: 1.5rem;
}

.schedule-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: ghostwhite 1px solid;
  border-radius: 1rem;
  margin: 0 auto;
  padding: 1rem 0;
}
</style>

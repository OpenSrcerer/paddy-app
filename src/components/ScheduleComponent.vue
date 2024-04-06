<template>
  <div class="schedule-wrapper">
    <q-badge
      class="schedule-type"
      outline
      :style="`color: ${scheduleColor};`">
      {{ schedule.type }}
    </q-badge>

    <q-btn
      dense round outline
      icon="close"
      class="schedule-remove-button"
      @click.prevent="emit('delete', schedule.id)"
    />

    <div class="schedule-content">
      <h4 v-if="schedule.periodic">
        {{ cronstrue.toString(schedule.periodic as string, { verbose: true }) }}
      </h4>
      <h4 v-else>
        {{ new Date(schedule.single * 1000).toLocaleString() }}
      </h4>
      <h5>Timezone: {{ schedule.timezone }}</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import cronstrue from 'cronstrue';
import { Schedule } from 'src/backend/schedule/dto/Schedule';
import { computed } from 'vue';

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
</script>

<style lang="scss">
.schedule-remove-button .q-icon {
  color: #ff6464;
}
</style>

<style scoped lang="scss">
h4, h5 {
  margin: 0;
}

.schedule-remove-button {
  position: absolute;
  border: 2px #ff6464 solid;
  top: -.75rem;
  right: -.75rem;
  background-color: $dark !important;
}

.q-badge {
  justify-content: center;
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
  cursor: pointer;
  margin: 0 auto;
  width: 50%;
  padding: 1rem 0;
}
</style>

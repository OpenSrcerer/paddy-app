<template>

  <q-scroll-area class="column" id="schedule-scroll">
    <q-pull-to-refresh
      id="schedule-puller"
      @refresh="onRefresh"
      color="ghostwhite"
      icon="autorenew"
    >
      <ScheduleComponent
        v-for="schedule in schedules" :key="schedule.id"
        @delete="deleteSchedule"
        :schedule="schedule"
      />
    </q-pull-to-refresh>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { Schedule } from 'src/backend/schedule/dto/Schedule';
import ScheduleComponent from 'components/ScheduleComponent.vue';

interface OverViewProps {
  schedules: Array<Schedule>
}
const props = withDefaults(defineProps<OverViewProps>(), { schedules: () => [] })
const emit = defineEmits(['reload'])

const onRefresh = (done: () => void) => {
  emit('reload', done)
}

const deleteSchedule = (scheduleId: string) => {
  console.log(scheduleId)
}

watchEffect(() => props.schedules)
</script>

<style lang="scss">
.q-pull-to-refresh__content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
  height: 100%;
}
</style>

<style scoped lang="scss">
.schedule-wrapper:first-child {
  margin-top: 2rem;
}

#schedule-puller {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100vh;
}

#schedule-scroll {
  height: 100vh;
  width: 100%;
}
</style>

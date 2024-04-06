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
      <br>
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

<style scoped lang="scss">
.schedule-wrapper {
  margin-top: 3rem;
  width: 50%;
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

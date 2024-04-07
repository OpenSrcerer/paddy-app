<template>

  <q-scroll-area id="container">
    <q-pull-to-refresh
      v-if="schedules.length"
      id="scroll-container"
      @refresh="onRefresh"
      color="ghostwhite"
      icon="autorenew"
    >
      <ScheduleComponent
        class="fade-in-load"
        v-for="schedule in schedules" :key="schedule.id"
        @delete="deleteSchedule"
        :schedule="schedule"
      />
      <br>
    </q-pull-to-refresh>

    <NoXyzHere v-else title="No schedules here!" caption="Make a new one to get started!"/>

  </q-scroll-area>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { Schedule } from 'src/backend/schedule/dto/Schedule';
import ScheduleComponent from 'components/ScheduleComponent.vue';
import NoXyzHere from 'components/NoXyzHere.vue';

interface OverViewProps {
  schedules: Array<Schedule>
}
const props = withDefaults(defineProps<OverViewProps>(), { schedules: () => [] })
const emit = defineEmits(['reload', 'delete'])

const onRefresh = (done: () => void) => {
  emit('reload', done)
}

const deleteSchedule = (scheduleId: string) => {
  emit('delete', scheduleId)
}

watchEffect(() => props.schedules)
</script>

<style scoped lang="scss">
.schedule-wrapper {
  margin-top: 3rem;
  width: 50%;
}

#scroll-container {
  position: absolute;
  height: 100%;
  width: 100%;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>

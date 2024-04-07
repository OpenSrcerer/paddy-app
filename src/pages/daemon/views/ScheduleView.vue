<template>

  <q-scroll-area class="column" id="schedule-scroll">
    <q-pull-to-refresh
      v-if="schedules.length"
      id="schedule-puller"
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

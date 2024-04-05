<template>
  <q-scroll-area class="column" id="schedule-scroll">
    <div class="schedule-container wrap"
         v-for="schedule in schedules" :key="schedule.id"
         @click="console.log('abc')"
    >
      <ScheduleComponent :schedule="schedule" />
    </div>
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

watchEffect(() => props.schedules)
</script>

<style scoped lang="scss">
#schedule-scroll {
  padding-top: 2rem;
  height: 100vh;
  width: 100%;
  gap: 10px;
}
</style>

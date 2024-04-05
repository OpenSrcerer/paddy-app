<template>
  <div class="schedule-wrapper">
    <h5>Schedule {{ schedule.periodic }}</h5>
  </div>
</template>

<script setup lang="ts">
import { Schedule } from 'src/backend/schedule/dto/Schedule';

export interface DaemonComponentProps {
  schedule: Schedule,
}
const props = defineProps<DaemonComponentProps>();
</script>

<style scoped lang="scss">
.schedule-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: ghostwhite 1px solid;
  border-radius: 1rem;
  cursor: pointer;
  width: 50%;
  margin: 0 auto;
}
</style>

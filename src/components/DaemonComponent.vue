<template>
  <div class="name-chip-wrapper">
    <h4>Daemon {{ daemon.id }}</h4>
    <q-chip outline :style="'color:' + getBadgeColor(daemon)">
      {{ getDaemonStatus(daemon) }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import { Daemon, getBadgeColor, getDaemonStatus } from 'src/backend/daemon/dto/Daemon';

export interface DaemonComponentProps {
  daemon: Daemon
}
const props = defineProps<DaemonComponentProps>();

</script>

<style scoped lang="scss">
h4, p {
  margin: 1rem;
}

.name-chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>

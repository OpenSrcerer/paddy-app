<template>
  <div class="name-chip-wrapper">
    <h4 v-if="!dense" :class="dense ? 'dense' : 'non-dense'">Daemon {{ daemon.id }}</h4>
    <h5 v-else :class="dense ? 'dense' : 'non-dense'">Daemon {{ daemon.id }}</h5>

    <q-chip
      :size="dense ? '0.7rem' : '1rem'" outline
      :style="'color:' + getBadgeColor(daemon)"
    >
      {{ getDaemonStatus(daemon) }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import { Daemon, getBadgeColor, getDaemonStatus } from 'src/backend/daemon/dto/Daemon';

export interface DaemonComponentProps {
  daemon: Daemon,
  dense: boolean,
}
const props = defineProps<DaemonComponentProps>();
</script>

<style scoped lang="scss">
.dense {
  margin: 0;
  padding-right: 0.75rem;
}

.non-dense {
  margin: 1rem;
}

.name-chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>

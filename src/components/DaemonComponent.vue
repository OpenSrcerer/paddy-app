<template>
  <div
    class="name-chip-wrapper"
    v-touch-hold.mouse="onTouchHold"
  >
    <input
      v-if="switchNameMode"
      :class="(!newName || newName.length < 2 || newName.length > 15) ? 'input-form red' : 'input-form'"
      class="input-form"
      v-model="newName"
      :placeholder="`${daemon.name}`"
    >

    <h4 v-if="!dense && !switchNameMode" :class="dense ? 'dense' : 'non-dense'">{{ daemon.name }}</h4>
    <h5 v-else-if="!switchNameMode" :class="dense ? 'dense' : 'non-dense'">{{ daemon.name }}</h5>

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

const switchNameMode = defineModel<boolean>('mode' ,{ required: false });
const newName = defineModel<string>('name' ,{ required: false });

const onTouchHold = () => {
  if (props.dense) {
    switchNameMode.value = true;
  }
}
</script>

<style scoped lang="scss">
.dense {
  margin: 0;
  padding-right: 0.75rem;
}

.non-dense {
  margin: 1rem;
  text-align: center;
}

@media (max-aspect-ratio: 1 / 2) {
  h5.dense {
    font-size: 1rem;
  }
}

.name-chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: relative;
}

.input-form {
  margin: 0 .75rem 0 0;
  max-width: 10rem;
  font-size: 1rem;
}

.red {
  border: 1px red solid;
}

.red:focus-visible, .red:focus {
  outline: 1px red solid;
}

</style>

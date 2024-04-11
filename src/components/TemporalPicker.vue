<template>
  <div id="temporals">
    <p
      v-for="option in options"
      :class="model == option.value ? 'selected' : ''"
      :key="option.label"
      @click="model = option.value"
    >
      {{ option.label }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PowerTemporal } from 'src/backend/stats/StatsPaddyBackendClient';

type LabeledTemporal = { label: string, value: PowerTemporal }

const model = defineModel<PowerTemporal>({ required: true });

const options: Array<LabeledTemporal> = [
  { label: 'Minute', value: 'MINUTE' },
  { label: 'Hour', value: 'HOUR' },
  { label: 'Day', value: 'DAY' },
  { label: 'Week', value: 'WEEK' },
  { label: 'Month', value: 'MONTH' },
  { label: 'Quarter', value: 'QUARTER' },
  { label: 'Year', value: 'YEAR' },
]
</script>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: row;
}

p {
  margin: 0;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px ghostwhite solid;
  border-radius: 1rem;
  transition: all 100ms ease-in-out;
  min-width: 4rem;
}

p:hover, .selected {
  background-color: ghostwhite;
  color: $dark;
  cursor: pointer;
}

p:hover {
  transform: translate(0, -3px);
}

#temporals {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>

<template>
  <div class="statistics-chip">
    <q-badge
      class="schedule-type"
      outline
      :style="`color: ghostwhite;`">
      {{ description }}
    </q-badge>

    <div class="row items-center">
      <h4 v-if="value" style="font-weight: bold">{{ value }}</h4>
      <h4 style="color: #ff4e4e" v-if="trending === 'UP'">🡅</h4>
      <h4 style="color: #8d8d8d" v-else-if="trending === 'SAME'">━</h4>
      <h4 style="color: #b0ff61" v-else-if="trending === 'DOWN'">🡇</h4>
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">

interface StatisticsChipProps {
  value?: string,
  trending?: 'UP' | 'SAME' | 'DOWN' | undefined,
  description: string
}
defineProps<StatisticsChipProps>()

</script>

<style scoped lang="scss">
h4:first-of-type {
  margin: 0;
  padding: 1rem;
}

h4 {
  margin: 0;
  padding: 1rem 1rem 1rem 0;
}

.q-badge {
  position: absolute;
  justify-content: center;
  top: -.75rem;
  height: 30%;
  font-size: 100%;
  font-weight: bold;
  background-color: $dark;
  min-width: 5rem;
  max-height: 1.5rem;
}

.statistics-chip {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border: ghostwhite 1px solid;
  border-radius: 1.5rem;
  min-width: 12rem;
}
</style>

<template>
  <div class="statistics-chip">
    <q-badge
      class="schedule-type"
      outline
      :style="`color: ghostwhite;`">
      {{ description }}
    </q-badge>
    <h4 style="font-weight: bold">{{ value }}</h4>
  </div>
</template>

<script setup lang="ts">

interface StatisticsChipProps {
  value: string,
  description: string
}
defineProps<StatisticsChipProps>()

</script>

<style scoped lang="scss">
h4 {
  margin: 0;
  padding: 1rem;
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

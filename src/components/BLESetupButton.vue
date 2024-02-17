<template>
  <div>
    <button type="button" @click="emit('setupBLE')">
      Inject Credentials
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["setupBLE"])
</script>

<style scoped>

</style>

<template>
  <div>
    <button type="button" @click="emit('setupBle')">
      Inject Credentials
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["setupBle"])
</script>

<style scoped>

</style>

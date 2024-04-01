<template>
  <div id="loading-container">
    <q-icon id="loading-spinner" name="autorenew"/>
    <h3 id="loading-text">Hold your horses...</h3>
  </div>
</template>

<style scoped lang="scss">
#loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#loading-spinner {
  font-size: 8rem;
  animation: loadingRotate 2s linear;
  animation-iteration-count: infinite;
}

#loading-text {
  margin: 0;
  font-size: 1.5rem;
}

@keyframes loadingRotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
<script setup lang="ts">
</script>

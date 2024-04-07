<template>
  <div id="no-xyz">
    <h4><b>{{ title }}</b></h4>
    <q-img src="~assets/webp/nelly_curious.webp"></q-img>
    <h6>{{ caption }}</h6>
  </div>
</template>

<script setup lang="ts">

interface NoXyzHereProps {
  title: string,
  caption: string
}
defineProps<NoXyzHereProps>()

</script>

<style scoped lang="scss">
#no-xyz {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  text-align: center;
}

.q-img {
  min-width: 10rem;
  max-width: 15rem;
}

h4, h6 {
  margin: 0 auto;
}

h6 {
  margin: 1rem 0;
}
</style>

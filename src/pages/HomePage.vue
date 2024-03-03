<template>
  <q-page class="row items-center justify-evenly">
    <div id="container">
      <h5>Your Pads:</h5>

      <button v-for="pad in pads" :key="pad.id" type="button" @click="onPadClick(pad.id)">
        Paddy {{ pad.id }}
      </button>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Pad } from 'src/backend/pad/dto/Pad';
import pad from 'src/backend/pad/PadPaddyBackendClient';
import { useRouter } from 'vue-router';

const router = useRouter()
const pads = ref<Array<Pad>>([])

onBeforeMount(async () => {
  pads.value = await pad.getAllUserPads()
})

const onPadClick = (padId: number) => {
  router.push(`pad/${padId}`)
}

</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

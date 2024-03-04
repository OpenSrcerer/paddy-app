<template>
  <q-page class="row items-center justify-evenly">
    <div id="container">
      <h5>Your Daemons:</h5>

      <button v-for="daemon in daemons" :key="daemon.id" type="button" @click="onDaemonClick(daemon.id)">
        Daemon {{ daemon.id }}
      </button>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Daemon } from 'src/backend/daemon/dto/Daemon';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRouter } from 'vue-router';

const router = useRouter()
const daemons = ref<Array<Daemon>>([])

onBeforeMount(async () => {
  daemons.value = await daemon.getAllUserDaemons()
})

const onDaemonClick = (daemonId: number) => {
  router.push(`daemon/${daemonId}`)
}

</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

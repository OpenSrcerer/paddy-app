<template>
  <div id="container">
    <h4>Your Daemons:</h4>

    <q-scroll-area id="scroll-container">
      <div class="daemon-container"
           v-for="daemon in daemons" :key="daemon.id"
           @click="onDaemonClick(daemon.id)"
      >
        <h3>Daemon {{ daemon.id }}</h3>
      </div>
    </q-scroll-area>
  </div>

  <div id="add-daemon-btn" @click="onAddNew">
    <svg x="0px" y="0px" width="122.875px" height="122.648px" viewBox="0 0 122.875 122.648" xml:space="preserve">
      <g><path fill-rule="evenodd" clip-rule="evenodd" d="M108.993,47.079c7.683-0.059,13.898,6.12,13.882,13.805 c-0.018,7.683-6.26,13.959-13.942,14.019L75.24,75.138l-0.235,33.73c-0.063,7.619-6.338,13.789-14.014,13.78 c-7.678-0.01-13.848-6.197-13.785-13.818l0.233-33.497l-33.558,0.235C6.2,75.628-0.016,69.448,0,61.764 c0.018-7.683,6.261-13.959,13.943-14.018l33.692-0.236l0.236-33.73C47.935,6.161,54.209-0.009,61.885,0 c7.678,0.009,13.848,6.197,13.784,13.818l-0.233,33.497L108.993,47.079L108.993,47.079z"/></g>
    </svg>
  </div>
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

const onAddNew      = ()                 => router.push(`setup`)
const onDaemonClick = (daemonId: number) => router.push(`daemon/${daemonId}`)
</script>

<style scoped lang="scss">
* {
  user-select: none;
}

body {
  overflow-y: hidden;
}

h3 {
  margin: 1rem;
}

#scroll-container {
  height: calc(70vh - 50px);
  width: 50%;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

#add-daemon-btn {
  position: fixed;
  width: 7.5em;
  bottom: 3em;
  right: 3em;
  padding: 1.5em 10em 1em 1.5em;
  border-radius: 5em;
  background-color: ghostwhite;
  fill: black;
  transition: all 150ms ease-in-out;
  transform: scale(0.5);
  cursor: pointer;
  z-index: 4;
}

#add-daemon-btn:hover {
  transform: scale(0.75);
}

.daemon-container {
  border: ghostwhite 1px solid;
  width: 100%;
  cursor: pointer;
}
</style>

<template>
  <div style="height: 100vh" class="column items-center justify-center">
    <h4><b>Welcome to the Paddy App!</b></h4>
    <h6>Log in or sign up to get started!</h6>

    <q-img src="~assets/webp/doggo_heya.webp"/>

    <div id="container">
      <q-btn push to="login">Login</q-btn>
      <q-btn push to="signup">Sign Up</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onBeforeMount } from 'vue';
import { LocalStorage } from 'quasar';
import { LoginCredential } from 'src/backend/session/dto/LoginCredential';
import { useRouter } from 'vue-router';

const router = useRouter()

onBeforeMount(async () => {
  if (LocalStorage.has(LoginCredential.REFRESH_TOKEN)) {
    await router.replace("/home");
  }
})

</script>

<style scoped lang="scss">
h4, h6 {
  text-align: center;
  margin: 0 1rem 0 1rem;
}

h4 {
  margin-bottom: 5px;
}

.q-img {
  min-width: 10rem;
  max-width: 15rem;
}

.q-btn {
  color: ghostwhite;
  border: ghostwhite 1px solid;
}

#container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

#container * {
  min-width: 6rem;
}
</style>

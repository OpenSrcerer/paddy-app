<template>
  <q-page class="row items-center justify-evenly">
    <div id="container">
      <label>Email or Username:</label>
      <input type="text" v-model="emailOrUsernameForm"><br><br>

      <label>Password:</label>
      <input type="password" v-model="passwordForm"><br><br>

      <button type="button" @click="onLogin">Login</button>
    </div>
  </q-page>

  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">Warning</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ alertText }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import session from 'src/backend/session/SessionPaddyBackendClient';
import { useRouter } from 'vue-router';

const router = useRouter()

const emailOrUsernameForm = ref()
const passwordForm = ref()
const alert = ref(false)
const alertText = ref("")

const onLogin = async () => {
  try {
    await session.doLogin(emailOrUsernameForm.value, passwordForm.value)
    await router.replace("/home")
  } catch (ex: any) {
    alertText.value = ex.message
    alert.value = true
  }
}
</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

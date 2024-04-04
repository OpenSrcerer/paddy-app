<template>

  <div style="height: 100vh" class="row items-center justify-evenly">
    <div
      id="container"
      @keydown.enter.prevent="onLogin"
    >
      <div>
        <h5>Email or Username:</h5>
        <input class="input-form" type="text" v-model="emailOrUsernameForm">
      </div>

      <div>
        <h5>Password:</h5>
        <input class="input-form" type="password" v-model="passwordForm">
      </div>

      <q-btn push @click="onLogin">Login</q-btn>
    </div>
  </div>

  <DialogComponent
    v-model="alert"
    title="Warning"
    icon="report_problem"
    close-button="OK"
  >
    <q-card-section class="q-pt-none">
      {{ alertText }}
    </q-card-section>
  </DialogComponent>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import session from 'src/backend/session/SessionPaddyBackendClient';
import { useRouter } from 'vue-router';
import DialogComponent from 'components/DialogComponent.vue';
import MainLayout from 'layouts/MainLayout.vue';

const router = useRouter()

const emailOrUsernameForm = ref()
const passwordForm = ref()

const alert = ref(false)
const alertText = ref("")

const onLogin = async () => {
  try {
    if (!emailOrUsernameForm.value || !passwordForm.value) {
      throw new Error("Please enter both your username and password!")
    }

    await session.doLogin(emailOrUsernameForm.value, passwordForm.value)
    await router.replace("/home")
  } catch (ex: any) {
    alertText.value = ex.message
    alert.value = true
  }
}
</script>

<style lang="scss">
body {
  overflow-y: hidden;
}
</style>

<style scoped lang="scss">
h5 {
  margin: 0;
}

.q-btn {
  color: ghostwhite;
  border: ghostwhite 1px solid;
}

#container {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  gap: 2rem;
}
</style>

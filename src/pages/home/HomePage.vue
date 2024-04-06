<template>

  <MainLayout :action-links="actionLinks">

    <LoadingSpinner v-if="!daemons"/>

    <q-scroll-area
      v-else-if="!!(daemons as Array<Daemon>).length"
      class="column"
      id="container"
    >
      <q-pull-to-refresh
        id="scroll-container"
        @refresh="loadDaemons"
        color="ghostwhite"
        bg-color="black"
        icon="autorenew"
      >
        <div class="daemon-container wrap"
             v-for="daemon in daemons" :key="daemon.id"
             @click="onDaemonClick(daemon.id)"
        >
          <DaemonComponent :dense="false" :daemon="daemon"/>

          <q-toggle
            :model-value="daemon.on"
            icon="bolt"
            size="5rem"
            @click="toggleDaemon(daemon.id)"
          />
        </div>
      </q-pull-to-refresh>
    </q-scroll-area>

    <div v-else style="height: 100%" class="column items-center">
      <h4>No daemons here.</h4>
      <p>Why don't you get some?</p>
    </div>

    <DialogComponent
      v-model="alert"

      :icon="alertIcon"
      :persistent="alertPersistent"
      :title="alertTitle"
      :close-button="alertCloseButton"
      :buttons="alertEventButtons"

      @next="alertOnNext"
      @finish="alertOnNext"
    >
      <div v-if="setupFinish" class="column items-center">
        <p><b>Your Daemon has been successfully configured! Enjoy.</b></p>
        <q-img src="~assets/webp/clyde_fly.webp"></q-img>
        <p>Please allow a couple of minutes for the Daemon to calibrate itself and connect to your Wi-Fi network.</p>
      </div>

      <p v-else-if="(!store.daemon || !store.id) && !alertErrorText">
        Hey, are you ready to setup your new Daemon?
        <br>
        Just press "Next" to get started!
      </p>

      <div v-else-if="!store.wpaType && !alertErrorText">
        <p>
          <b>If you don't know which one to choose, choose "Personal".</b>
          <br>
          Enterprise access points are often common in places like offices or schools, and require a username and a password.
        </p>
        <div class="row justify-center">
          <q-option-group
            v-model="setupWifiType"
            :options="[{ label: 'Personal', value: 'P' }, { label: 'Enterprise', value: 'E' }]"
            color="primary"
            inline
          />
        </div>
      </div>

      <div class="column justify-center items-center" v-else-if="!store.ssid && !alertErrorText">
        <label>Wifi SSID:</label>
        <input class="input-form" type="text" v-model="setupSsid">

        <label v-if="!store.isWifiEnterprise">Wifi Password:</label>
        <input class="input-form" v-if="!store.isWifiEnterprise" type="password" v-model="setupPass">

        <label v-if="store.isWifiEnterprise">Enterprise Username:</label>
        <input class="input-form" v-if="store.isWifiEnterprise" v-model="setupEUsername">

        <label v-if="store.isWifiEnterprise">Enterprise Password:</label>
        <input class="input-form" v-if="store.isWifiEnterprise" type="password" v-model="setupEPassword">
      </div>

      <div v-else-if="store.isComplete && !alertErrorText">
        <p>
          <b>You are almost ready to set up your new Daemon.</b>
          <br><br>
          Once you click "Finish", your daemon will be automatically configured.
        </p>
      </div>

      <p v-if="!!alertErrorText">{{ alertErrorText }}</p>
    </DialogComponent>
  </MainLayout>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Daemon } from 'src/backend/daemon/dto/Daemon';
import daemon from 'src/backend/daemon/DaemonPaddyBackendClient';
import { useRouter } from 'vue-router';
import DaemonComponent from 'components/DaemonComponent.vue';
import DialogComponent from 'components/DialogComponent.vue';
import { SetupStore, useSetupStore } from 'stores/setup';
import { config, disconnect, init } from 'src/bluetooth/BleService';
import { DaemonDevice } from 'src/bluetooth/BleOptions';
import LoadingSpinner from 'components/LoadingSpinner.vue';
import MainLayout from 'layouts/MainLayout.vue';

const router = useRouter()
const store = useSetupStore()
const daemons = ref<Array<Daemon> | undefined>(undefined)

const alert               = ref<boolean>(false)
const alertPersistent     = ref<boolean>(false)
const alertIcon           = ref<string | undefined>(undefined)
const alertTitle          = ref<string | undefined>(undefined)
const alertCloseButton    = ref<string | undefined>(undefined)
const alertErrorText      = ref<string | undefined>(undefined)
const alertEventButtons   = ref<Array<string>>([])
const alertOnNext         = ref<(() => Promise<void>) | undefined>()

const setupWifiType       = ref<SetupStore['wpaType']>('P')
const setupSsid           = ref<string>('');
const setupPass           = ref<string>('');
const setupEUsername      = ref<string>('');
const setupEPassword      = ref<string>('');
const setupFinish         = ref<boolean>(false);

onMounted(async () => await loadDaemons())

const toggleDaemon = async (daemonId: string) => {
  await daemon.toggle(daemonId)
  await loadDaemons()
}
const loadDaemons = async (done: (() => void) | undefined = undefined) => {
  daemons.value = await daemon.getAllUserDaemons()
  if (!!done) done()
}
const onDaemonClick = (daemonId: number) => router.push(`daemon/${daemonId}`)

// ---- Setup Flow ----
const onAddNewBtnClick = () => {
  store.$reset();

  setupWifiType.value = 'P'
  setupSsid.value = ''
  setupPass.value = ''
  setupEUsername.value = ''
  setupEPassword.value = ''
  setupFinish.value = false

  alertPersistent.value = false;
  alertTitle.value = 'Add New Daemon'
  alertIcon.value = 'auto_fix_high'
  alertCloseButton.value = 'cancel'
  alertEventButtons.value = ['next']
  alertErrorText.value = undefined
  alertOnNext.value = onInit

  alert.value = true;
}

// ---- Step 1: Connect to daemon (or fail if BLE is unsupported) ----
const onInit = async () => {
  let device: DaemonDevice;
  try {
    device = await init();
  } catch (e) {
    alertTitle.value = 'Cannot Add New Daemon'
    alertIcon.value = 'error_outline'
    alertErrorText.value = e as string
    alertEventButtons.value = [];
    alertCloseButton.value = "OK";
    alert.value = true;
    return;
  }

  store.daemon = device.daemon
  store.id = device.id

  if (!store.daemon || !store.id) {
    alertTitle.value = 'Failed to add Daemon'
    alertIcon.value = 'error_outline'
    alertErrorText.value = "Daemon provided incorrect characteristics."
    alert.value = true;
    return;
  }

  alertTitle.value = 'Choose Wi-Fi Type'
  alertIcon.value = 'wifi'
  alertOnNext.value = onWifiType
}

// ---- Step 2: User Selected the Wi-Fi Type ----
const onWifiType = async () => {
  store.wpaType = setupWifiType.value

  alertTitle.value = 'Input Wi-Fi Credentials'
  alertOnNext.value = onCredentials;
}

// ---- Step 3: User has input the Wi-Fi Credentials ----
const onCredentials = async () => {
  const personalFieldsComplete = setupSsid.value && setupPass.value
  const enterpriseFieldsComplete = setupSsid.value && setupEPassword.value && setupEUsername.value

  // At least one flow of forms must be completed
  if (!personalFieldsComplete && !enterpriseFieldsComplete) return;

  store.ssid = setupSsid.value
  store.pass = setupPass.value
  store.eUsername = setupEUsername.value
  store.ePassword = setupEPassword.value

  alertTitle.value = 'Finish Setup'
  alertIcon.value = 'auto_fix_high'
  alertEventButtons.value = ['finish']
  alertPersistent.value = true;
  alertOnNext.value = onConfigDaemon;
}

// ---- Step 4: Configure the daemon ----
const onConfigDaemon = async () => {
  const daemonRes = await daemon.createDaemon(store.id as string)
  if (!daemonRes) {
      alertTitle.value = 'Failed to add Daemon'
      alertIcon.value = 'error_outline'
      alertErrorText.value = `We were unable to contact our servers.
        Please check your network connection and try again. Server Response: ${daemonRes}`
      alertEventButtons.value = [];
      alertCloseButton.value = "OK";
      alert.value = true;
      return;
  }

  if (!daemonRes) {
    alertTitle.value = 'Failed to add Daemon'
    alertIcon.value = 'error_outline'
    alertErrorText.value = `We were unable to contact our servers.
        Please check your network connection and try again. Server Response: ${daemonRes}`
    alertEventButtons.value = [];
    alertCloseButton.value = "OK";
    alert.value = true;
    return;
  }

  store.jwt = daemonRes.jwt

  try {
    await config(store) // Push config to Daemon
    await disconnect(store.daemon?.deviceId) // Disconnect
  } catch (e) {
    alertTitle.value = 'Failed to add Daemon'
    alertIcon.value = 'error_outline'
    alertErrorText.value = 'Daemon failed to be configured over BLE. Please reset it and retry.'
    alertEventButtons.value = [];
    alertCloseButton.value = "OK";
    alert.value = true;
    return;
  }

  store.$reset()

  setupFinish.value = true;
  alertEventButtons.value = [];
  alertCloseButton.value = "OK";
  alertPersistent.value = false;

  daemons.value = await daemon.getAllUserDaemons()
}

const actionLinks = [{
  title: 'Add / Recover Daemon',
  caption: 'Add a new daemon to your list, or recover an existing one',
  icon: 'add_circle_outline',
  action: onAddNewBtnClick
}]
</script>

<style lang="scss">
.q-option-group--inline > div {
  margin-right: 1rem;
  margin-left: 1rem;
}

.q-scrollarea__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.q-chip__icon {
  color: inherit;
}

.q-pull-to-refresh__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Stupid component with preset values
.q-pull-to-refresh__puller-container {
  left: 0 !important;
}
</style>

<style scoped lang="scss">
.q-img {
  width: 75%;
}

.daemon-container:last-child {
  margin-bottom: 2rem;
}

.daemon-container {
  max-width: 50%;
  margin: 0 auto;
}

#scroll-container {
  padding-top: 2rem;
  height: 100vh;
  width: 100%;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

#add-daemon-btn:hover {
  transform: scale(1.25);
}

.input-form {
  font-size: 0.9rem;
}

.daemon-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: ghostwhite 1px solid;
  border-radius: 1rem;
  width: 100%;
  cursor: pointer;
}

@media (max-width: 1052px) {
  .daemon-container {
    justify-content: center;
  }
}
</style>

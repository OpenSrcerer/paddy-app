import { defineStore } from 'pinia';
import { BleOptions, DaemonDevice } from 'src/bluetooth/BleOptions';

type SetupStoreMetadata = {
  wpaType: 'PERSONAL' | 'ENTERPRISE'
}

export type SetupStore = Partial<DaemonDevice> & Partial<SetupStoreMetadata> & BleOptions

export const useSetupStore = defineStore('setup', {
  state: () => (<SetupStore> {
    // Daemon Data
    daemon: undefined,
    id: undefined,

    // Metadata
    wpaType: undefined,

    // Configuration Values
    ssid: '',
    pass: '',
    eUsername: '',
    ePassword: '',
    jwt: ''
  }),

  getters: {
    isWifiEnterprise(): boolean {
      return this.wpaType === 'ENTERPRISE'
    },

    getOptions(state): BleOptions {
      return state
    }
  },

  actions: {
  }
});

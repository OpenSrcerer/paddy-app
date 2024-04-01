import { defineStore } from 'pinia';
import { BleOptions, DaemonDevice } from 'src/bluetooth/BleOptions';

type SetupStoreMetadata = {
  wpaType: 'P' | 'E'
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
      return this.wpaType == 'E'
    },


    isComplete(): boolean {
      const daemonComplete = !!this.daemon && !!this.id && !!this.wpaType
      const personalComplete = !!this.ssid && !!this.pass
      const enterpriseComplete = !!this.ssid && !!this.ePassword && !!this.eUsername

      return daemonComplete && (personalComplete || enterpriseComplete);
    },

    getOptions(state): BleOptions {
      return state
    }
  },

  actions: {
  }
});

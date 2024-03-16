import { BleDevice } from '@capacitor-community/bluetooth-le';

export const BLE_MAX_TRANSMISSION_LENGTH = 512;
export const BLE_SERVICE_UUID = '89E34F48-DD3B-427A-A979-BBB0D139ADDA';
export const SERIAL_CHAR_UUID = 'CCA0A6F7-F693-4B6B-87FA-D26C75CBCC20';
export const SSID_CHAR_UUID   = '1638010E-4736-4674-90A9-4CA06DD8DB77';
export const PASS_CHAR_UUID   = '68AF48BE-265D-4144-9913-D76EC1E662EC';
export const E_USERNAME_UUID  = '722BE51F-9B7E-4ED4-93DD-A400711EE2FE';
export const E_PASSWORD_UUID  = '952ADF05-36BE-4FCB-8D5D-FDBB81D7B140';
export const JWT_UUID         = '1EB32940-2512-4E9C-BD17-8FE1F9BCD6F8';
export const RESET_UUID       = '0E98BF59-3940-4FED-8D6F-8BA70A9755D9';

export type BleOption = keyof BleOptions;
export type BleValue = BleOptions[BleOption]

export type DaemonDevice = {
  daemon: BleDevice
  id: string
}

export type BleOptions = {
  ssid: string;
  pass?: string;
  eUsername?: string;
  ePassword?: string;
  jwt?: string;
}

export function getCharFromOption(option: BleOption): string | undefined {
  switch (option) {
    case 'ssid':
      return SSID_CHAR_UUID;
    case 'pass':
      return PASS_CHAR_UUID;
    case 'eUsername':
      return E_USERNAME_UUID;
    case 'ePassword':
      return E_PASSWORD_UUID;
    case 'jwt':
      return JWT_UUID;
    default:
      return undefined
  }
}

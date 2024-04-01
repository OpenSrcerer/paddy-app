import { BleClient, BleDevice, ScanMode } from '@capacitor-community/bluetooth-le';
import {
  BLE_MAX_TRANSMISSION_LENGTH,
  BLE_SERVICE_UUID,
  BleOption,
  DaemonDevice,
  getCharFromOption, RESET_UUID,
  SERIAL_CHAR_UUID, SSID_CHAR_UUID
} from 'src/bluetooth/BleOptions';
import { SetupStore } from 'stores/setup';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export async function init(): Promise<DaemonDevice> {
  const daemon = await connectDaemon();
  const id = await getDeviceId(daemon);

  return { daemon, id }
}

export async function config(store: SetupStore) {
  if (!store.daemon) {
    console.log('[BleService] Daemon was undefined!');
    return;
  }

  await configureDaemon(store.daemon, (deviceId, configSsid) =>
    // Write all other configuration first.
    Object.keys(store)
      .map((option) => ({
        char: getCharFromOption(option as BleOption),
        value: store[option as BleOption]
      }))
      .filter(pair => !!pair.char && (configSsid ? pair.char === SSID_CHAR_UUID : pair.char !== SSID_CHAR_UUID))
      .map(config => writeToChar(deviceId, config.char, config.value as string))
  )
}

export async function disconnect(deviceId: string | undefined) {
  if (!deviceId) {
    console.log('[BleService] Device id was undefined! Ignoring disconnect request.');
    return;
  }

  await BleClient.disconnect(deviceId);
  console.log('[BleService] Disconnected from device:', deviceId);
}

export async function reset(device: DaemonDevice) {
  await writeToChar(device.daemon.deviceId, RESET_UUID, "x");
  await disconnect(device.daemon.deviceId)
}

async function getDeviceId(device: BleDevice): Promise<string> {
  const view = await BleClient.read(device.deviceId, BLE_SERVICE_UUID, SERIAL_CHAR_UUID)
  return textDecoder.decode(view)
}

async function writeToChar(deviceId: string, char: string | undefined, value: string) {
  if (!value || !char) {
    console.log(`[BleService] Skipping write to char <${char}>. Value empty.`);
    return
  }

  let chunks: string[];

  // Split the chunks to be less than the max transmission length
  if (value.length >= BLE_MAX_TRANSMISSION_LENGTH) {

    const chunkCount = Math.ceil(value.length / BLE_MAX_TRANSMISSION_LENGTH);

    chunks = Array.from({ length: chunkCount }, (_, index) => {
      const start = index * BLE_MAX_TRANSMISSION_LENGTH;
      const end = Math.min((index + 1) * BLE_MAX_TRANSMISSION_LENGTH, value.length);
      return value.substring(start, end);
    });

  } else {
    chunks = [value];
  }

  console.log(`[BleService] Writing (${value.length} chars, ${chunks?.length ?? 1} chunk(s)) <${value}> to characteristic <${char}>...`);


  // Write all the chunks in order
  for (const [i, chunk] of chunks.entries()) {
    console.log(`[BleService] Writing chunk (${i + 1} / ${chunks.length})...`);

    const viewChunk = new DataView(textEncoder.encode(chunk).buffer);
    await BleClient.write(deviceId, BLE_SERVICE_UUID, char, viewChunk);
  }
}

async function connectDaemon(): Promise<BleDevice> {
  try {
    await BleClient.initialize();
  } catch (e) {
    throw new Error(
      "Sorry, but your device does not support Bluetooth Low Energy.\n" +
      "Please retry on a device with support."
    )
  }

  console.log('[BleService] Requesting BLE device with capabilities...');
  const device = await BleClient.requestDevice({
    services: [BLE_SERVICE_UUID],
    scanMode: ScanMode.SCAN_MODE_BALANCED
  });

  // connect to device, the onDisconnect callback is optional
  await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
  console.log('[BleService] Connected to BLE device:', JSON.stringify(device));

  return device
}

async function configureDaemon(
  daemon: BleDevice,
  configureLambda: (deviceId: string, configSsid: boolean) => Array<Promise<void>>
) {
  // Configure the device & await the writes IN ORDER
  for (const writeToDaemon of configureLambda(daemon.deviceId, false)) {
    await writeToDaemon;
  }

  // Configure SSID last because it triggers setup
  await Promise.all(configureLambda(daemon.deviceId, true));
}

function onDisconnect(deviceId: string): void {
  console.log(`[BleService] Device ${deviceId} disconnected.`);
}

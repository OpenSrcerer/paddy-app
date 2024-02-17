import { BleClient, ScanMode } from '@capacitor-community/bluetooth-le';

const WIFI_SERVICE = '12345678-1234-1234-1234-123456789012';
const SSID_CHARACTERISTIC = '12345678-1234-1234-1234-123456789013';
const PASS_CHARACTERISTIC = '12345678-1234-1234-1234-123456789014';

const textEncoder = new TextEncoder();

export async function sendSsidAndPass(
  rawSsid: string,
  rawPass: string
): Promise<void> {
  try {
    await BleClient.initialize();

    console.log('requesting device with capabilities...');
    const device = await BleClient.requestDevice({
      services: [WIFI_SERVICE],
      scanMode: ScanMode.SCAN_MODE_BALANCED
    });

    // connect to device, the onDisconnect callback is optional
    await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
    console.log('connected to device', device);

    console.log(rawSsid, rawPass)

    const ssid = new DataView(textEncoder.encode(rawSsid).buffer);
    await BleClient.write(device.deviceId, WIFI_SERVICE, SSID_CHARACTERISTIC, ssid)

    const pass = new DataView(textEncoder.encode(rawPass).buffer);
    await BleClient.write(device.deviceId, WIFI_SERVICE, PASS_CHARACTERISTIC, pass)

    // Disconnect after 1s
    setTimeout(async () => {
      await BleClient.disconnect(device.deviceId);
      console.log('disconnected from device', device);
    }, 10000);
  } catch (error) {
    console.error(error);
  }
}

function onDisconnect(deviceId: string): void {
  console.log(`device ${deviceId} disconnected`);
}

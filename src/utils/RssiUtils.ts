export const getIconNameFromRssi = (rssi: number | undefined) => {
  if (!rssi)
    return 'signal_wifi_statusbar_connected_no_internet_4'
  else if (rssi > -50)
    return 'signal_wifi_statusbar_4_bar'
  else if (rssi > -60)
    return 'network_wifi'
  else if (rssi > -75)
    return 'network_wifi_3_bar'
  else if (rssi > -90)
    return 'network_wifi_2_bar'
  else
    return 'network_wifi_1_bar'
}

export const getPercentValueFromRssi = (rssi: number | undefined) => {
  if (!rssi) return 0

  if (rssi <= -100) return 0;
  if (rssi >= -50) return 100;
  return 2 * (rssi + 100);
}

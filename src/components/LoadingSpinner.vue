<template>
  <div id="loading-container">
    <q-icon id="loading-spinner" name="autorenew"/>
    <h3 id="loading-text">{{ randomQuotes[Math.floor(Math.random() * randomQuotes.length)] }}</h3>
  </div>
</template>

<script setup lang="ts">
const randomQuotes = [
  "Hold tight, power's brewing!",
  "Stay tuned, Paddy's volts are coming!",
  "Keep calm, Paddy's watts are warming!",
  "Charging incoming, brace yourself!",
  "Loading energy, standby mode!",
  "Awaiting power surge, stand by!",
  "Power's revving, stay ready!",
  "Powering up with Paddy, get set, go!",
  "Juicing up, hang tight!",
  "Voltage rising, standby!",
  "Prepare for power influx!",
  "Stay plugged, watts incoming!",
  "Loading volts, hold steady!",
  "Energizing, standby engaged!",
  "Charging ahead, stay alert!",
  "Power loading, patience required!",
  "Watts loading, hold position!",
  "Electrifying soon, standby!",
  "Incoming power boost, standby!",
  "Charging up, standby mode!",
  "Energy loading, standby!",
  "Voltage incoming, brace!",
  "Power surge imminent, standby!",
  "Prepare for electric influx!",
  "Boost incoming, brace for power!",
  "Charging sequence initiated, standby!",
  "Energy buildup, standby engaged!",
  "Wattage incoming, standby!",
  "Loading volts, stay prepared!",
  "Standby for power injection!",
  "Power boost incoming, standby!",
  "Energizing sequence initiated, standby!",
  "Voltage surge incoming, brace!",
  "Power loading, keep steady!",
  "Incoming charge, standby!",
  "Power's on its way, standby!",
  "Standby mode engaged, energy incoming!",
  "Prepare for wattage surge!",
  "Loading power, standby engaged!",
  "Charging sequence underway, standby!",
  "Energy incoming, standby!",
  "Prepare for power onslaught!",
  "Power surge loading, standby!",
  "Voltage loading, stay ready!",
  "Power build-up, brace yourself!",
  "Wattage incoming, prepare!",
  "Standby for energy infusion!",
  "Power's en route, standby!",
  "Charging in progress, standby!",
  "Incoming energy, brace for impact!"
]

</script>


<style scoped lang="scss">
#loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
  line-break: loose;
}

#loading-spinner {
  font-size: 8rem;
  animation: loadingRotate 2s linear;
  animation-iteration-count: infinite;
}

#loading-text {
  margin: 0;
  font-size: 1.5rem;
}

@keyframes loadingRotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <q-page v-if="powers.length" class="container">

    <div class="d-items-container">
      <StatisticsChip
        description="Wi-Fi Strength"
        :value="getDaemonStatus(daemon) == 'Online' ? `${!!getPercentValueFromRssi(daemon.lastRssi) ?
          getPercentValueFromRssi(daemon.lastRssi) + '%' : 'N/A' }` : 'N/A'">
        <WifiStrength
          id="strength"
          size="4rem"
          :rssi="getDaemonStatus(daemon) == 'Online' ? daemon.lastRssi : undefined"
        />
      </StatisticsChip>

      <StatisticsChip
        description="Power Draw"
        :value="powers[powers.length - 1].statistic.toFixed(2) + ' W'"
      />
    </div>

    <div id="power-chart"></div>
  </q-page>

  <NoXyzHere
    v-else
    title="No statistics yet for this daemon!"
    caption="Make sure it is configured correctly."
  />
</template>

<script setup lang="ts">
import ApexCharts from 'apexcharts';
import { onMounted, ref, watch } from 'vue';
import NoXyzHere from 'components/NoXyzHere.vue';
import { PowerStatistic } from 'src/backend/stats/dto/PowerStatistic';
import WifiStrength from 'components/WifiStrength.vue';
import { Daemon, getDaemonStatus } from 'src/backend/daemon/dto/Daemon';
import StatisticsChip from 'components/StatisticsChip.vue';
import { getPercentValueFromRssi } from 'src/utils/RssiUtils';

interface OverViewProps {
  daemon: Daemon,
  powers: Array<PowerStatistic>
}
const props = withDefaults(defineProps<OverViewProps>(), {
  powers: () => []
})

const chart = ref<ApexCharts>()

onMounted(async () => setTimeout(async () => await makeChart(), 500))
watch(() => props.powers, async () => await makeChart())

const makeChart = async () => {
  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      width: '100%',
      type: 'line',
      toolbar: { show: false },
      height: '50%'
    },
    title: {
      text: `Instantaneous Power Draw (W)`,
      floating: false,
      offsetY: 40,
      align: 'center',
      style: {
        fontSize: '1.5rem',
        fontWeight: '300',
        fontFamily: 'Fira Sans',
        color: 'ghostwhite'
      }
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.3)', // Color of the grid lines
      strokeDashArray: 4, // Stroke dash array for dashed lines
      yaxis: {
        lines: {
          show: true // Show horizontal grid lines
        }
      }
    },
    series: [],
    xaxis: {},
  }

  const newChart = new ApexCharts(document.querySelector("#power-chart"), options);
  await newChart.render();
  chart.value = newChart;

  await loadChartData()
}

const loadChartData = async () => {
  await chart.value?.updateOptions({
    series: [{
      name: "Power Draw (W)",
      data: props.powers.map(p => p.statistic.toFixed(1)),
      color: '#aa0aaa'
    }],
    xaxis: {
      categories: props.powers.map(p => new Date(p.temporal * 1000)
        .toLocaleTimeString('en-US', { hour12: false })),
      labels: {
        style: {
          colors: props.powers.map(_ => 'ghostwhite')
        }
      }
    },
    yaxis: {
      labels: {
        maxTicks: 5,
        style: {
          colors: props.powers.map(_ => 'ghostwhite')
        }
      }
    }
  })
}

</script>

<style lang="scss">
</style>

<style scoped lang="scss">
h2 {
  margin: 0;
}

#schedules {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.d-items-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  text-align: center;
}

#power-chart {
  min-width: 80%;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.vertical {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.q-btn {
  min-width: 5rem;
  color: ghostwhite;
  border: ghostwhite 1px solid;
}

.horizontal {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.name-chip-wrapper {
  flex-wrap: nowrap !important;
}

.statistics-chip {
  min-height: 7.5rem;
}
</style>

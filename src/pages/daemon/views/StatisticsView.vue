<template>

  <div
    id="statistics-viewport"
    :style="!init ? 'display: none' : undefined"
  >
    <TemporalPicker
      v-model="model"
      class="picker"
    />

    <div id="dashboard-container" class="fade-in-load">

      <div class="stats-container">
        <StatisticsChip
          description="All-Time Usage"
          :value="`${cumulativeUsage?.statistic?.toFixed(2) ?? 'N/A'} kWh`"
        />

        <StatisticsChip
          :description="`Last ${toTitleCase(model)}'s Usage`"
          :value="`${rollingUsage[rollingUsage.length - 2]?.statistic?.toFixed(2) ?? 'N/A'} kWh`"
          :trending="getTrend(rollingUsage)"
        />

        <StatisticsChip
          :description="`Avg. Power Last ${toTitleCase(model)}`"
          :value="`${averageUsage[averageUsage.length - 2]?.statistic?.toFixed(2) ?? 'N/A'} W`"
          :trending="getTrend(averageUsage)"
        />
      </div>

      <div id="charts-vertical-container">
        <div class="chart-container">
          <div id="average-chart"></div>
        </div>
        <div class="chart-container">
          <div id="rolling-chart"></div>
        </div>
      </div>

    </div>
  </div>

  <LoadingSpinner :style="init ? 'display: none' : undefined"/>
</template>

<script setup lang="ts">
import TemporalPicker from 'components/TemporalPicker.vue';
import { PowerTemporal } from 'src/backend/stats/StatsPaddyBackendClient';
import { PowerStatistic } from 'src/backend/stats/dto/PowerStatistic';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import ApexCharts from 'apexcharts';
import LoadingSpinner from 'components/LoadingSpinner.vue';
import StatisticsChip from 'components/StatisticsChip.vue';

interface StatisticsViewProps {
  cumulativeUsage?: PowerStatistic,
  averageUsage?: Array<PowerStatistic>,
  rollingUsage?: Array<PowerStatistic>
}
const props = withDefaults(defineProps<StatisticsViewProps>(), {
  averageUsage: () => [],
  rollingUsage: () => []
});

const model = defineModel<PowerTemporal>({ required: true })

const rollingChart = ref<ApexCharts>()
const averageChart = ref<ApexCharts>()

const init = ref<boolean>(false)

onMounted(async () =>
  setTimeout(async () => {
    await Promise.all([
      makeRollingChart(), makeAverageChart()
    ])
    init.value = true;
  }, 250)
)
onUnmounted(() => init.value = false)

watch(() => props.rollingUsage, async () => await makeRollingChart())
watch(() => props.averageUsage, async () => await makeAverageChart())

const makeRollingChart = async () => {
  const options = {
    chart: {
      id: 'rolling-chart',
      width: '100%',
      type: 'area',
      toolbar: { show: false },
      height: '100%'
    },
    title: {
      text: `Energy Usage (kWh): ${toTitleCase(model.value)}`,
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

  const newChart = new ApexCharts(document.querySelector("#rolling-chart"), options);
  await newChart.render();
  rollingChart.value = newChart;

  await loadRollingChartData()
}

const loadRollingChartData = async () => {
  await rollingChart.value?.updateOptions({
    chart: { group: 'pwr' },
    series: [
      {
        name: "Usage (kWh)",
        data: props.rollingUsage.map(p => p.statistic.toFixed(5)),
        color: '#0aaa9f'
      }
    ],
    legend: {
      show: true,
      labels: {
        colors: ['ghostwhite', 'ghostwhite']
      }
    },
    xaxis: {
      categories: getChartDateFormatted(props.rollingUsage),
      labels: {
        style: {
          colors: props.rollingUsage.map(_ => 'ghostwhite')
        }
      }
    },
    yaxis: {
      min: 0,
      labels: {
        maxTicks: 5,
        style: {
          colors: props.rollingUsage.map(_ => 'ghostwhite')
        }
      }
    }
  })
}

const makeAverageChart = async () => {
  const options = {
    chart: {
      id: 'average-chart',
      width: '100%',
      type: 'line',
      toolbar: { show: false },
      height: '100%'
    },
    title: {
      text: `Average Power Draw (W): ${toTitleCase(model.value)}`,
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

  const newChart = new ApexCharts(document.querySelector("#average-chart"), options);
  await newChart.render();
  averageChart.value = newChart;

  await loadAverageChartData()
}

const loadAverageChartData = async () => {
  await averageChart.value?.updateOptions({
    series: [
      {
        name: "Average Draw (W)",
        data: props.averageUsage.map(p => p.statistic.toFixed(5)),
        color: '#aa0aaa'
      }
    ],
    legend: {
      show: true,
      labels: {
        colors: ['ghostwhite', 'ghostwhite']
      }
    },
    xaxis: {
      categories: getChartDateFormatted(props.rollingUsage),
      labels: {
        style: {
          colors: props.averageUsage.map(_ => 'ghostwhite')
        }
      }
    },
    yaxis: {
      min: 0,
      labels: {
        maxTicks: 5,
        style: {
          colors: props.averageUsage.map(_ => 'ghostwhite')
        }
      }
    }
  })
}

const getChartDateFormatted = (usage: Array<PowerStatistic>): Array<string> => {
  if (!usage.length) return [new Date().toString()]

  if (model.value == 'YEAR') return [new Date(usage[0].temporal * 1000)
    .getFullYear().toString()]

  if (usage.length == 1) return [new Date(usage[0].temporal * 1000)
    .toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })]

  if (usage[1].temporal - usage[0].temporal > 3600)
    return props.rollingUsage.map(p => new Date(p.temporal * 1000)
      .toLocaleDateString('en-US'));

  return props.rollingUsage.map(p => new Date(p.temporal * 1000)
    .toLocaleTimeString('en-US', { hour12: false }));
}

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const getTrend = (stats: Array<PowerStatistic>) => {
  // Need latest stats, the one before, and the history before that
  // the eldest 2 are compared
  if (stats.length < 3) return undefined;

  const beforeCurrent = stats[stats.length - 1].statistic;
  const beforex2Current = stats[stats.length - 2].statistic;

  const delta = Math.round(beforeCurrent - beforex2Current);

  if (delta > 0) return 'UP';
  else if (delta == 0) return 'SAME';
  else return 'DOWN';
}
</script>

<style scoped lang="scss">
* {
  text-align: center;
}

h4 {
  margin: 0.5rem;
}

#statistics-viewport {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.picker {
  margin-top: 1rem;
  padding: 0 1rem 1rem 1rem;
  border-bottom: 1px ghostwhite solid;
}

#dashboard-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
}

#charts-vertical-container {
  height: 80%;
  min-width: 100%;
  flex-grow: 1;
}

.chart-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 50%;
}

.chart-container > div {
  width: 90%;
}

.stats-container {
  margin: 2rem 1rem 1rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-grow: 1;
}
</style>

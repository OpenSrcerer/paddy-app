<template>
  <q-page v-if="powers.length" class="grid-container">
    <div class="d-items-container">
      <h4>Drawing {{ powers[powers.length - 1].statistic.toFixed(2) }}W</h4>
    </div>

    <div class="horizontal">
      <div id="power-chart"></div>
    </div>
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

interface OverViewProps {
  powers: Array<PowerStatistic>
}
const props = withDefaults(defineProps<OverViewProps>(), {
  powers: () => []
})

const chart = ref<ApexCharts>()

onMounted(async () => await makeChart())
watch(() => props.powers, async () => await makeChart())

const makeChart = async () => {
  const options = {
    chart: {
      width: '100%',
      type: 'line',
      toolbar: { show: false },
      height: '100%'
    },
    title: {
      text: 'Power Draw - 10 Minutes',
      floating: false,
      offsetY: 30,
      align: 'center',
      style: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
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
h3 {
  margin: 0;
}

#power-chart {
  min-width: 80%;
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
  justify-content: center;
  text-align: center;
}

.grid-container {
  display: grid;
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
</style>

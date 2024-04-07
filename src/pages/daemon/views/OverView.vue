<template>
  <q-page v-if="powers.length" class="grid-container">
    <div class="d-items-container">

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
import { Power } from 'src/backend/power/dto/Power';
import NoXyzHere from 'components/NoXyzHere.vue';

interface OverViewProps {
  powers: Array<Power>
}

const props = withDefaults(defineProps<OverViewProps>(), { powers: () => [] })
const chart = ref<ApexCharts>()

onMounted(async () => await makeChart())
watch(() => props.powers, async () => await makeChart())

const makeChart = async () => {
  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      height: '90%'
    },
    title: {
      text: 'Power Draw'
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
    // dataLabels: {
    //   enabled: true,
    //   style: {
    //     colors: ['#ff0000'] // Red color
    //   }
    // },
    series: [],
    xaxis: {},
    noData: { text: 'Loading...' },
  }

  const newChart = new ApexCharts(document.querySelector("#power-chart"), options);
  await newChart.render();
  chart.value = newChart;

  await loadChartData()
}

const loadChartData = async () => {
  await chart.value?.updateOptions({
    series: [{
      name: 'Power Draw (W)',
      data: props.powers.map(p => p.w),
      color: '#aa0aaa'
    }],
    xaxis: {
      categories: props.powers.map(p => new Date(p.timestamp * 1000)
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
h4, h5 {
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.d-items-container > * {
  flex: 1 1 auto;
}

.grid-container {
  display: grid;
  width: 100%;
}

.grid-container > div:nth-of-type(2) {
  width: 100%;
  border-top: ghostwhite 1px solid;
  text-align: center;
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
  padding: 0 1rem 0 1rem;
}

.name-chip-wrapper {
  flex-wrap: nowrap !important;
}
</style>

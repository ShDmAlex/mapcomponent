<template>
  <div class="grid-container second-page">
    <div class="chart-card chart-card-five">
      <div class="card-header">Валовый выпуск, млрд. тенге</div>
      <div class="card-content">
        <div class="road-container" ref="chartContainer">
          <horizontal-stack-bars height="100%" :data-source="grossChartData" />
        </div>
      </div>
    </div>
    <div class="chart-card chart-card-six">
      <div class="card-header">Сельское хозяйство по регионам</div>
      <div class="chart-switcher">
        <label>
          <input type="radio" v-model="localSelectedChart" value="chart1" /> в % к предыдущему году
        </label>
        <label>
          <input type="radio" v-model="localSelectedChart" value="chart2" /> млрд. тг
        </label>
      </div>
      <div class="card-content">
        <div class="road-container">
          <positive-negative-chart height="100%" :data-source="barSixChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HorizontalStackBars from '../charts/HorizontalStackBars.vue';
import PositiveNegativeChart from '../charts/PositiveNegativeChart.vue';

export default {
  name: 'SecondSlide',
  components: {
    HorizontalStackBars,
    PositiveNegativeChart,
  },
  props: {
    grossChartData: Object,
    barSixChartData: Object,
    selectedChart: String,
    sortBy: String,
    sortDesc: Boolean,
  },
  data() {
    return {
      localSelectedChart: this.selectedChart,
    };
  },
  watch: {
    localSelectedChart(newVal) {
      this.$emit('update:selected-chart', newVal);
    },
    selectedChart(newVal) {
      this.localSelectedChart = newVal;
    },
  },
};
</script>
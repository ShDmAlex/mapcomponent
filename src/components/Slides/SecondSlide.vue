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
          <input type="radio" v-model="selectedChart" value="chart1" /> в % к предыдущему году
        </label>
        <label>
          <input type="radio" v-model="selectedChart" value="chart2" /> млрд. тг
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
  data() {
    return {
      sortBy: 'name',
      sortDesc: false,
      selectedChart: 'chart1',
      grossChartData: {
        categories: ['2023', '2022', '2021'],
        colors: ['#8BC34A', '#FFB74D'],
        series: [
          {
            name: 'Растениеводство',
            data: [577.6, 909.4, 679.3],
          },
          {
            name: 'Животноводство',
            data: [179.2, 263, 219.9],
          },
        ],
        customTotals: [['-16.8%', 757.5], ['+12.3%', 1173.6], ['-12.2%', 900]],
      },
      agrocultregion: [
        {
          id: 4,
          name: 'Айыртауский',
          economicData: { percentChange: -8.7, productionVolume: 63.5 },
        },
        {
          id: 5,
          name: 'Акжарский',
          economicData: { percentChange: -57.1, productionVolume: 23.9 },
        },
        {
          id: 10,
          name: 'Аккайынский',
          economicData: { percentChange: 26.1, productionVolume: 53.6 },
        },
        {
          id: 3,
          name: 'им. Г.Мусрепова',
          economicData: { percentChange: 0, productionVolume: 99.0 },
        },
        {
          id: 9,
          name: 'Есильский',
          economicData: { percentChange: 19.6, productionVolume: 62.4 },
        },
        {
          id: 7,
          name: 'Жамбылский',
          economicData: { percentChange: 2.4, productionVolume: 51.0 },
        },
        {
          id: 1,
          name: 'Кызылжарский',
          economicData: { percentChange: 29.4, productionVolume: 84.3 },
        },
        {
          id: 6,
          name: 'М.Жумабаева',
          economicData: { percentChange: -14.2, productionVolume: 65.2 },
        },
        {
          id: 12,
          name: 'Мамлютский',
          economicData: { percentChange: 17.5, productionVolume: 38.1 },
        },
        {
          id: 2,
          name: 'Тайыншинский',
          economicData: { percentChange: 17.5, productionVolume: 38.1 },
        },
        {
          id: 11,
          name: 'Тимирязевский',
          economicData: { percentChange: 10.1, productionVolume: 35.0 },
        },
        {
          id: 13,
          name: 'Уалихановский',
          economicData: { percentChange: -47.0, productionVolume: 24.1 },
        },
        {
          id: 8,
          name: 'Шал акына',
          economicData: { percentChange: -18.5, productionVolume: 38.8 },
        },
        {
          id: '1-city',
          name: 'г. Петропавловск',
          economicData: { percentChange: 11.4, productionVolume: 21.4 },
        },
      ],
    };
  },
  computed: {
    barSixChartData() {
      console.log('Selected chart:', this.selectedChart); 
      const regions = [...this.agrocultregion]; 
      return {
        categories: regions.map(item => item.name),
        series: [{
          data: this.selectedChart === 'chart1'
            ? regions.map(item => item.economicData.percentChange)
            : regions.map(item => item.economicData.productionVolume),
        }],
      };
    },
  },
};
</script>
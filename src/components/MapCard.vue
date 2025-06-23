<template>
  <div class="page-wrapper">
    <v-window
      v-model="currentPage"
      show-arrows
      class="content-window-slider"
      transition="slide-x-transition"
    >
      <template v-slot:prev="{ on, attrs }">
        <v-btn
          dark
          text
          fab
          absolute
          height="40"
          width="40"
          v-bind="attrs"
          v-on="on"
          class="custom-prev-btn"
        >
          <v-icon>fa-chevron-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:next="{ on, attrs }">
        <v-btn
          dark
          text
          fab
          absolute
          height="40"
          width="40"
          v-bind="attrs"
          v-on="on"
          class="custom-next-btn"
        >
          <v-icon>fa-chevron-right</v-icon>
        </v-btn>
      </template>
      <v-window-item>
        <first-slide
          :region-items="regionItems"
          :selected-region-id="selectedRegionId"
          :tooltip-html="tooltipHtml"
          :tooltip-event="tooltipEvent"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :headers="headers"
          :road-chart-data="roadChartData"
          :selected-region="selectedRegion"
          @region-selected="handleRegionSelect"
          @tooltip-show="handleTooltipShow"
        />
      </v-window-item>
      <v-window-item>
        <second-slide
          :gross-chart-data="grossChartData"
          :bar-six-chart-data="barSixChartData"
          :selected-chart="selectedChart"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          @update:selected-chart="selectedChart = $event"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import FirstSlide from './Slides/FirstSlide.vue';
import SecondSlide from './Slides/SecondSlide.vue';


export default {
  name: 'MapCard',
  components: {
    FirstSlide,
    SecondSlide,
    
  },
  data() {
    return {
      currentPage: 0,
      sortBy: 'name',
      sortDesc: false,
      selectedRegionId: null,
      tooltipHtml: '',
      tooltipEvent: null,
      selectedChart: 'chart1',
      headers: [
        { text: 'Регион', value: 'name', sortable: true },
        { text: 'Рождаемость', value: 'fertility', sortable: true },
        { text: 'Смертность', value: 'mortality', sortable: true },
      ],
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
      regionItems: [
        {
          id: 4,
          name: 'Айыртауский район',
          shortName: 'Айыртауский',
          svgClass: 'fil4',
          percentage: '62.5%',
          fertility: { 2023: '11.24', 2024: '9.82' },
          mortality: { 2023: '12.01', 2024: '12.28' },
          economicData: { percentChange: -8.7, productionVolume: 63.5 },
          chartData: {
            maternal: { 2023: 0, 2024: 0 },
            child: { 2023: 0, 2024: 0 },
            infant: { 2023: 0, 2024: 0 },
          },
        },
        {
          id: 5,
          name: 'Акжарский район',
          shortName: 'Акжарский',
          svgClass: 'fil5',
          percentage: '100%',
          fertility: { 2023: '14.11', 2024: '12.06' },
          mortality: { 2023: '9.46', 2024: '8.97' },
          economicData: { percentChange: -57.1, productionVolume: 23.9 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 10,
          name: 'Аккайынский район',
          shortName: 'Аккайынский',
          svgClass: 'fil10',
          percentage: '',
          fertility: { 2023: '9.29', 2024: '7.72' },
          mortality: { 2023: '13.4', 2024: '15.28' },
          economicData: { percentChange: 26.1, productionVolume: 53.6 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 3,
          name: 'Район им. Габита Мусрепова',
          shortName: 'им. Г.Мусрепова',
          svgClass: 'fil3',
          percentage: '100%',
          fertility: { 2023: '9.68', 2024: '8.71' },
          mortality: { 2023: '12.05', 2024: '10.59' },
          economicData: { percentChange: 0, productionVolume: 99.0 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 9,
          name: 'Есильский район',
          shortName: 'Есильский',
          svgClass: 'fil9',
          percentage: '17.1%',
          fertility: { 2023: '9.37', 2024: '9.02' },
          mortality: { 2023: '13.21', 2024: '12.82' },
          economicData: { percentChange: 19.6, productionVolume: 62.4 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '7.14' },
          },
        },
        {
          id: 7,
          name: 'Жамбылский район',
          shortName: 'Жамбылский',
          svgClass: 'fil7',
          percentage: '0%',
          fertility: { 2023: '10.81', 2024: '11.28' },
          mortality: { 2023: '10.76', 2024: '13.03' },
          economicData: { percentChange: 2.4, productionVolume: 51.0 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '6.76' },
          },
        },
        {
          id: 1,
          name: 'Кызылжарский район',
          shortName: 'Кызылжарский',
          svgClass: 'fil1',
          percentage: '76%',
          fertility: { 2023: '9.97', 2024: '9.29' },
          mortality: { 2023: '10.36', 2024: '10.52' },
          economicData: { percentChange: 29.4, productionVolume: 84.3 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '6.17' },
          },
        },
        {
          id: 6,
          name: 'Район Магжана Жумабаева',
          shortName: 'М.Жумабаева',
          svgClass: 'fil6',
          percentage: '36%',
          fertility: { 2023: '9.12', 2024: '10.61' },
          mortality: { 2023: '12.66', 2024: '13.53' },
          economicData: { percentChange: -14.2, productionVolume: 65.2 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '18.96' },
          },
        },
        {
          id: 12,
          name: 'Мамлютский район',
          shortName: 'Мамлютский',
          svgClass: 'fil12',
          percentage: '',
          fertility: { 2023: '10.59', 2024: '10.23' },
          mortality: { 2023: '13.23', 2024: '12.65' },
          economicData: { percentChange: 17.5, productionVolume: 38.1 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '7.63' },
          },
        },
        {
          id: 2,
          name: 'Тайыншинский район',
          shortName: 'Тайыншинский',
          svgClass: 'fil2',
          percentage: '21.7%',
          fertility: { 2023: '10.43', 2024: '10.02' },
          mortality: { 2023: '11.88', 2024: '10.43' },
          economicData: { percentChange: 17.5, productionVolume: 38.1 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '6.83' },
          },
        },
        {
          id: 11,
          name: 'Тимирязевский район',
          shortName: 'Тимирязевский',
          svgClass: 'fil11',
          percentage: '',
          fertility: { 2023: '9.31', 2024: '9.92' },
          mortality: { 2023: '11.46', 2024: '12.58' },
          economicData: { percentChange: 10.1, productionVolume: 35.0 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '14.08' },
          },
        },
        {
          id: 13,
          name: 'Уалихановский район',
          shortName: 'Уалихановский',
          svgClass: 'fil13',
          percentage: '35.3%',
          fertility: { 2023: '16.09', 2024: '14.61' },
          mortality: { 2023: '8.2', 2024: '7.41' },
          economicData: { percentChange: -47.0, productionVolume: 24.1 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 8,
          name: 'Район Шал акына',
          shortName: 'Шал акына',
          svgClass: 'fil8',
          percentage: '100%',
          fertility: { 2023: '11.29', 2024: '11.07' },
          mortality: { 2023: '13.53', 2024: '14.05' },
          economicData: { percentChange: -18.5, productionVolume: 38.8 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: '1-city',
          name: 'г. Петропавловск',
          shortName: 'г. Петропавловск',
          svgClass: 'fnt-city',
          percentage: '○ г. Петропавловск - 87.3%',
          fertility: { 2023: '10.36', 2024: '9.53' },
          mortality: { 2023: '10.14', 2024: '11.22' },
          economicData: { percentChange: 11.4, productionVolume: 21.4 },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '8.21' },
          },
        },
        {
          id: 14,
          name: 'СКО',
          svgClass: 'fil14',
          percentage: '',
          fertility: { 2023: '10.47', 2024: '9.81' },
          mortality: { 2023: '11.08', 2024: '11.52' },
          economicData: { percentChange: 0, productionVolume: 0 },
          chartData: {
            maternal: { 2023: '6.52', 2024: '2.1' },
            child: { 2023: '10.47', 2024: '9.83' },
            infant: { 2023: '8.61', 2024: '6.47' },
          },
        },
      ],
      roadchartConfig: {
        categories: ['Материнская', 'Детская до 5 лет', 'Младенческая до года'],
        colors: ['#f3a100', '#a0c913'],
        years: ['2023', '2024'],
        dataKeys: ['maternal', 'child', 'infant'],
      },
    };
  },
  methods: {
    handleRegionSelect(regionId) {
      this.selectedRegionId = regionId;
    },
    handleTooltipShow({ region, event }) {
      const regionName = region.name;
      const fertility2023 = region.fertility['2023'];
      const fertility2024 = region.fertility['2024'];
      const mortality2023 = region.mortality['2023'];
      const mortality2024 = region.mortality['2024'];

      let fertilityTrend = '';
      let fertilityIconClass = '';
      const fert2023 = parseFloat(fertility2023);
      const fert2024 = parseFloat(fertility2024);
      if (fert2024 < fert2023) {
        fertilityTrend = '<i class="fas fa-caret-down"></i>';
        fertilityIconClass = 'fertility-icon';
      } else {
        fertilityTrend = '<i class="fas fa-caret-up"></i>';
        fertilityIconClass = 'mortality-icon';
      }

      let mortalityTrend = '';
      let mortalityIconClass = '';
      const mortal2023 = parseFloat(mortality2023);
      const mortal2024 = parseFloat(mortality2024);
      if (mortal2024 < mortal2023) {
        mortalityTrend = '<i class="fas fa-caret-down"></i>';
        mortalityIconClass = 'mortality-icon';
      } else {
        mortalityTrend = '<i class="fas fa-caret-up"></i>';
        mortalityIconClass = 'fertility-icon';
      }

      const html = `
        <div class="tooltip-content">
          <div class="tooltip-title">${regionName}</div>
          <div class="tooltip-section">
            <span class="tooltip-label">Рождаемость</span><br>
            <span class="tooltip-year">2023г. - ${fertility2023}</span>
            <div class="tooltip-year-with-icon">
              <span class="tooltip-year">2024г. - ${fertility2024}</span>
              <span class="tooltip-icon ${fertilityIconClass}">${fertilityTrend}</span>
            </div>
          </div>
          <div class="tooltip-section">
            <span class="tooltip-label">Смертность</span><br>
            <span class="tooltip-year">2023г. - ${mortality2023}</span>
            <div class="tooltip-year-with-icon">
              <span class="tooltip-year">2024г. - ${mortality2024}</span>
              <span class="tooltip-icon ${mortalityIconClass}">${mortalityTrend}</span>
            </div>
          </div>
        </div>
      `;

      this.tooltipHtml = String(html);
      this.tooltipEvent = {
        position: {
          x: event.clientX,
          y: event.clientY,
        },
      };
    },
  },
  computed: {
    selectedRegion() {
      return this.regionItems.find(
        (region) => String(region.id) === String(this.selectedRegionId || '14')
      ) || null;
    },
    roadChartData() {
      const { categories, colors, years, dataKeys } = this.roadchartConfig;
      const region = this.selectedRegion;
      const series = years.map(year => ({
        name: year,
        data: dataKeys.map(key => {
          if (!region) return 0;
          const value = region.chartData[key]?.[year];
          return parseFloat(value) || 0;
        }),
      }));

      return {
        categories,
        colors,
        series,
      };
    },
    barSixChartData() {
      const key = this.sortBy;
      const desc = this.sortDesc;
      const regions = this.regionItems
        .filter(item => item.id !== '14' && item.name !== 'СКО' && item.economicData)
        .slice()
        .sort((a, b) => {
          let valA = a[key];
          let valB = b[key];
          if (typeof valA === 'object' && valA !== null) {
            valA = parseFloat(valA['2024']) || 0;
          }
          if (typeof valB === 'object' && valB !== null) {
            valB = parseFloat(valB['2024']) || 0;
          }
          if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
          }
          if (valA < valB) return desc ? 1 : -1;
          if (valA > valB) return desc ? -1 : 1;
          return 0;
        });
      return {
        categories: regions.map(item => item.shortName || item.name),
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
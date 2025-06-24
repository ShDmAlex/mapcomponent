<template>
  <div class="grid-container first-page">
    <div class="chart-card chart-card-first">
      <div class="card-header">Административно-территориальное деление области</div>
      <div class="card-content">
        <map-component
          :region-items="regionItems"
          :path-data-customization-method="customizePathColors"
          :text-data-customization-method="customizePathTexts"
          :zoom-on-select="false"
          :selected-region-id="selectedRegionId"
          :tooltip-html-external="tooltipHtml"
          :tooltip-event="tooltipEvent"
          @region-selected="handleRegionSelect"
          @tooltip-show="handleTooltipShow"
        />
      </div>
    </div>
    <div class="chart-card chart-card-second">
      <div class="card-header">Общий уровень смертности и рождаемости, чел. на 1 тыс. чел.</div>
      <div class="card-content">
        <div class="table-scroll-container">
          <v-data-table
            :headers="headers"
            :items="regionItems"
            :custom-sort="customSort"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            height="calc(20vh - 150px)"
            class="custom-table elevation-1"
            disable-pagination
            hide-default-footer>
            <template slot="item.fertility" slot-scope="{ item }">
              <div class="progress-container">
                <v-progress-linear
                  :value="getFertilityPercent(item)"
                  height="18"
                  color="rgb(76, 175, 80)"
                  rounded
                />
                <div class="progress-label">{{ item.fertility['2024'] }}</div>
              </div>
            </template>
            <template slot="item.mortality" slot-scope="{ item }">
              <div class="progress-container">
                <v-progress-linear
                  :value="getMortalityPercent(item)"
                  height="18"
                  color="rgb(120, 144, 156)"
                  rounded
                />
                <div class="progress-label">{{ item.mortality['2024'] }}</div>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
    <div class="chart-card chart-card-third">
      <div class="card-header">Смертность и рождаемость, чел. на 1 тыс. чел.</div>
      <div class="card-content">
        <div class="stats-container" v-if="selectedRegion">
          <div class="stats-row">
            <div class="stats-year">2023 г.</div>
            <div class="stats-year">2024 г.</div>
          </div>
          <div class="stats-row">
            <div class="stats-item">
              <span class="stats-label">Рождаемость</span>
              <span class="stats-value fertility">
                <count-up
                  :key="`fertility-2023-${selectedRegion.id}`"
                  :end-val="parseFloat(selectedRegion.fertility['2023'])"
                  :options="getCountUpOptions(selectedRegion.fertility['2023'])"
                ></count-up>
              </span>
            </div>
            <div class="stats-icon">
              <v-icon color="#4CAF50" size="75">fas fa-baby-carriage</v-icon>
            </div>
            <div class="stats-item">
              <span class="stats-label">Рождаемость</span>
              <span class="stats-value fertility">
                <count-up
                  :key="`fertility-2024-${selectedRegion.id}`"
                  :end-val="parseFloat(selectedRegion.fertility['2024'])"
                  :options="getCountUpOptions(selectedRegion.fertility['2024'])"
                ></count-up>
              </span>
            </div>
          </div>
          <div class="stats-row">
            <div class="stats-item">
              <span class="stats-label">Смертность</span>
              <span class="stats-value mortality">
                <count-up
                  :key="`mortality-2023-${selectedRegion.id}`"
                  :end-val="parseFloat(selectedRegion.mortality['2023'])"
                  :options="getCountUpOptions(selectedRegion.mortality['2023'])"
                ></count-up>
              </span>
            </div>
            <div class="stats-icon">
              <v-icon color="#78909C" size="75">fas fa-cross</v-icon>
            </div>
            <div class="stats-item">
              <span class="stats-label">Смертность</span>
              <span class="stats-value mortality">
                <count-up
                  :key="`mortality-2024-${selectedRegion.id}`"
                  :end-val="parseFloat(selectedRegion.mortality['2024'])"
                  :options="getCountUpOptions(selectedRegion.mortality['2024'])"
                ></count-up>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-card chart-card-four">
      <div class="card-header">Смертность, чел. на 1 тыс. чел.</div>
      <div class="card-content">
        <div class="road-container">
          <road-chart height="100%" :data-source="roadChartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from '../charts/MapComponent.vue';
import RoadChart from '../charts/RoadChart.vue';
import CountUp from 'vue-countup-v2';

export default {
  name: 'FirstSlide',
  components: {
    MapComponent,
    RoadChart,
    CountUp,
  },
  data() {
    return {
      sortBy: 'name',
      sortDesc: false,
      selectedRegionId: null,
      tooltipHtml: '',
      tooltipEvent: null,
      headers: [
        { text: 'Регион', value: 'name', sortable: true },
        { text: 'Рождаемость', value: 'fertility', sortable: true },
        { text: 'Смертность', value: 'mortality', sortable: true },
      ],
      regionItems: [
        {
          id: 4,
          name: 'Айыртауский район',
          svgClass: 'fil4',
          percentage: '62.5%',
          fertility: { 2023: '11.24', 2024: '9.82' },
          mortality: { 2023: '12.01', 2024: '12.28' },
          chartData: {
            maternal: { 2023: 0, 2024: 0 },
            child: { 2023: 0, 2024: 0 },
            infant: { 2023: 0, 2024: 0 },
          },
        },
        {
          id: 5,
          name: 'Акжарский район',
          svgClass: 'fil5',
          percentage: '100%',
          fertility: { 2023: '14.11', 2024: '12.06' },
          mortality: { 2023: '9.46', 2024: '8.97' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 10,
          name: 'Аккайынский район',
          svgClass: 'fil10',
          percentage: '',
          fertility: { 2023: '9.29', 2024: '7.72' },
          mortality: { 2023: '13.4', 2024: '15.28' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 3,
          name: 'Район им. Габита Мусрепова',
          svgClass: 'fil3',
          percentage: '100%',
          fertility: { 2023: '9.68', 2024: '8.71' },
          mortality: { 2023: '12.05', 2024: '10.59' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 9,
          name: 'Есильский район',
          svgClass: 'fil9',
          percentage: '17.1%',
          fertility: { 2023: '9.37', 2024: '9.02' },
          mortality: { 2023: '13.21', 2024: '12.82' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '7.14' },
          },
        },
        {
          id: 7,
          name: 'Жамбылский район',
          svgClass: 'fil7',
          percentage: '0%',
          fertility: { 2023: '10.81', 2024: '11.28' },
          mortality: { 2023: '10.76', 2024: '13.03' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '6.76' },
          },
        },
        {
          id: 1,
          name: 'Кызылжарский район',
          svgClass: 'fil1',
          percentage: '76%',
          fertility: { 2023: '9.97', 2024: '9.29' },
          mortality: { 2023: '10.36', 2024: '10.52' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '6.17' },
          },
        },
        {
          id: 6,
          name: 'Район Магжана Жумабаева',
          svgClass: 'fil6',
          percentage: '36%',
          fertility: { 2023: '9.12', 2024: '10.61' },
          mortality: { 2023: '12.66', 2024: '13.53' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '18.96' },
          },
        },
        {
          id: 12,
          name: 'Мамлютский район',
          svgClass: 'fil12',
          percentage: '',
          fertility: { 2023: '10.59', 2024: '10.23' },
          mortality: { 2023: '13.23', 2024: '12.65' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '7.63' },
          },
        },
        {
          id: 2,
          name: 'Тайыншинский район',
          svgClass: 'fil2',
          percentage: '21.7%',
          fertility: { 2023: '10.43', 2024: '10.02' },
          mortality: { 2023: '11.88', 2024: '10.43' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '6.83' },
          },
        },
        {
          id: 11,
          name: 'Тимирязевский район',
          svgClass: 'fil11',
          percentage: '',
          fertility: { 2023: '9.31', 2024: '9.92' },
          mortality: { 2023: '11.46', 2024: '12.58' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '14.08' },
          },
        },
        {
          id: 13,
          name: 'Уалихановский район',
          svgClass: 'fil13',
          percentage: '35.3%',
          fertility: { 2023: '16.09', 2024: '14.61' },
          mortality: { 2023: '8.2', 2024: '7.41' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: 8,
          name: 'Район Шал акына',
          svgClass: 'fil8',
          percentage: '100%',
          fertility: { 2023: '11.29', 2024: '11.07' },
          mortality: { 2023: '13.53', 2024: '14.05' },
          chartData: {
            maternal: { 2023: '0', 2024: '0' },
            child: { 2023: '0', 2024: '0' },
            infant: { 2023: '0', 2024: '0' },
          },
        },
        {
          id: '1-city',
          name: 'г. Петропавловск',
          svgClass: 'fnt-city',
          percentage: '○ г. Петропавловск - 87.3%',
          fertility: { 2023: '10.36', 2024: '9.53' },
          mortality: { 2023: '10.14', 2024: '11.22' },
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
    customizePathColors() {
      const styles = {};
      this.regionItems.forEach((region) => {
        const regionId = String(region.id);
        if (region.percentage) {
          const percentage = parseFloat(region.percentage) || 0;
          if (percentage >= 75) {
            styles[regionId] = 'rgb(104, 159, 56)';
          } else if (percentage >= 25) {
            styles[regionId] = 'rgb(51, 105, 30)';
          } else {
            styles[regionId] = 'rgb(124, 179, 66)';
          }
        } else {
          styles[regionId] = 'rgb(189, 189, 189)';
        }
      });
      return styles;
    },
    customizePathTexts() {
      const texts = {};
      this.regionItems.forEach((region) => {
        const regionId = String(region.id);
        texts[regionId] = region.percentage || '';
      });
      return texts;
    },
    getFertilityPercent(item) {
      return (parseFloat(item.fertility['2024']) / 15) * 100;
    },
    getMortalityPercent(item) {
      return (parseFloat(item.mortality['2024']) / 15) * 100;
    },
    getCountUpOptions(value) {
      const numStr = value.toString();
      const decimalIndex = numStr.indexOf('.');
      const decimalPlaces = decimalIndex !== -1 ? numStr.length - decimalIndex - 1 : 0;
      return {
        separator: ' ',
        duration: 2,
        useEasing: true,
        decimalPlaces: decimalPlaces,
        decimal: '.',
      };
    },
    customSort(items, sortBy, sortDesc) {
      if (!sortBy || !sortBy.length) return items;
      const key = sortBy[0];
      const desc = sortDesc[0];
      return items.slice().sort((a, b) => {
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
  },
};
</script>
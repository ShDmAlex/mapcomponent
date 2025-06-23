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
            hide-default-footer
          >
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
  props: {
    regionItems: Array,
    selectedRegionId: [String, Number],
    tooltipHtml: String,
    tooltipEvent: Object,
    sortBy: String,
    sortDesc: Boolean,
    headers: Array,
    roadChartData: Object,
    selectedRegion: Object,
  },
  methods: {
    handleRegionSelect(regionId) {
      this.$emit('region-selected', regionId);
    },
    handleTooltipShow({ region, event }) {
      this.$emit('tooltip-show', { region, event });
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
};
</script>
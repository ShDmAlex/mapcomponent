<template>
  <div ref="chartContainer" :style="{ position: 'relative', height: height + 'px' }">
    <ApexChart
      type="bar"
      :height="height"
      :width="width"
      :options="chartOptions"
      :series="dataSource.series"
    />
   
    <div
      v-for="(label, index) in customLabels"
      :key="index"
      :style="{
        position: 'absolute',
        top: label.top + 'px',
        left: label.left + 'px',
        color: label.color,
        fontSize: '11px',
        fontWeight: '500',
        fontFamily: 'Montserrat-Regular, sans-serif',
        lineHeight: '1.2',
        pointerEvents: 'none',
      }"
    >
      <div>{{ label.change }}</div>
      <div>{{ label.total }}</div>
    </div>
  </div>
</template>


<script>
import ApexChart from 'vue-apexcharts';

export default {
  name: 'ValChart',
  components: { ApexChart },
  props: {
    height: {
      type: [Number, String],
      default: 250,
    },
    width: {
      type: [Number, String],
      default: '95%',
    },
    dataSource: {
      type: Object,
      required: true,
      default: () => ({
        series: [],
        categories: [],
        colors: [],
        percentChanges: [],
      }),
    },
  },
  data() {
    return {
      customLabels: [],
    };
  },
  computed: {
    chartOptions() {
      
      return {
        chart: {
          type: 'bar',
          stacked: true,
          height: this.height,
          animations: {
            enabled: true,
            speed: 800,
          },
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '70%',
            
            dataLabels: {
              position: 'center',
              
              
            },
          },
        },
        dataLabels: {
  enabled: true,
  style: {
    fontSize: '11px',
    fontWeight: 400,
    fontFamily: 'Montserrat-Regular',
  },
        },
        grid: { show: false },
        stroke: { show: false },
        tooltip: {
          shared: false,
          intersect: true,
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const category = w.config.xaxis.categories[dataPointIndex];
            const value = series[seriesIndex][dataPointIndex];
            const color = w.globals.colors[seriesIndex];
            return `
              <div style="padding: 5px; background: ${color}; color: #fff; font-size: 10px;">
                <strong>${category}:</strong> ${value}
              </div>
            `;
          },
        },
        xaxis: {
          categories: this.dataSource.categories,
          labels: {
            style: {
              colors: '#ffffff',
              fontSize: '11px',
            },
          },
          axisBorder: { show: true, color: '#4b3f3f' },
          axisTicks: { show: true, color: '#4b3f3f' },
        },
        yaxis: {
          labels: {
            offsetX: 5,
            style: { colors: '#ffffff' },
          },
          axisBorder: { show: true, color: '#4b3f3f' },
          axisTicks: { show: true, color: '#4b3f3f' },
        },
        legend: {
          position: 'bottom',
          offsetY: -10,
          fontSize: '9px',
          fontFamily: 'Montserrat-Regular, sans-serif',
          markers: {
            width: 10,
            height: 10,
            borderRadius: 10,
            strokeWidth: 0,
          },
          itemMargin: {
            horizontal: 5,
            vertical: 15,
          },
          formatter: (seriesName, opts) => {
            return `<span style="color: ${opts.w.globals.colors[opts.seriesIndex]}">${seriesName}</span>`;
          },
        },
        colors: this.dataSource.colors,
        percentChange: this.dataSource.percentChanges,
        responsive: [
          {
            breakpoint: 1000,
            options: {
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
            },
          },
        ],
      };
    },
  },
  mounted() {
  this.$nextTick(() => {
    this.calculateLabelPositions();
    window.addEventListener('resize', this.calculateLabelPositions);
    const chartEl = this.$refs.chartContainer?.querySelector('.apexcharts-inner');
    if (chartEl) {
      this.mutationObserver = new MutationObserver(() => {
        this.calculateLabelPositions();
      });
      this.mutationObserver.observe(chartEl, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  });
},
beforeDestroy() {
  window.removeEventListener('resize', this.calculateLabelPositions);
  if (this.mutationObserver) {
    this.mutationObserver.disconnect();
  }
},
  watch: {
    dataSource: {
      handler() {
        this.$nextTick(() => {
          this.calculateLabelPositions();
        });
      },
      deep: true,
    },
  },
  methods: {
    calculateLabelPositions() {
      this.$nextTick(() => {
        const chartEl = this.$refs.chartContainer?.querySelector('.apexcharts-inner');
        if (!chartEl) return;

        const yLabels = chartEl.querySelectorAll('.apexcharts-yaxis-texts-g text');
        const barRects = chartEl.querySelectorAll('.apexcharts-bar-series .apexcharts-bar-area');
        const containerRect = this.$refs.chartContainer.getBoundingClientRect();

        if (yLabels.length === 1 || barRects.length === 1) return;

        this.customLabels = this.dataSource.categories.map((category, index) => {
          const labelEl = yLabels[index];
          const labelBox = labelEl?.getBoundingClientRect();
          const top = labelBox ? labelBox.top - containerRect.top - 5 : 0;

          const barRect = barRects[index]?.getBoundingClientRect();
          const left = barRect ? barRect.right - containerRect.left + 5 : 0;

          const percentChange = this.dataSource.percentChanges?.find((item) => item.year === category);
          const change = percentChange?.change || '0%';
          const isNegative = change.startsWith('-');
          const color = isNegative ? '#FF4D4F' : '#52C41A';

          let total = 0;
          this.dataSource.series.forEach((serie) => {
            if (serie.data && typeof serie.data[index] === 'number') {
              total += serie.data[index];
            }
          });

          return {
            top,
            left,
            change,
            total: total.toFixed(2),
            color,
          };
        });
      });
    },
  },
  
};
</script>

<template>
  <div style="position: relative; height: 100%;">
    <ApexChart
      type="bar"
      height="100%"
      :width="width"
      :options="chartOptions"
      :series="dataSource.series"
    />
  </div>
</template>

<script>
import ApexChart from 'vue-apexcharts';

export default {
  name: 'ValChart',
  components: { ApexChart },
  props: {
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
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          stacked: true,
          height: '100%',
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
          offsetX: -6,
          style: {
            fontSize: '11px',
            fontWeight: 400,
            fontFamily: 'Montserrat-Regular',
            colors: ['#ffffff'],
          },
          formatter: (val) => val.toFixed(1),
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
        responsive: [
          {
            breakpoint: 1000,
            options: {
              plotOptions: {
                bar: { horizontal: true },
              },
            },
          },
        ],
      };
    },
  },
};
</script>
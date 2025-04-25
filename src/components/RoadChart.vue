<template>
    <ApexChart
      type="bar"
      :height="height"
      :width="width"
      :options="chartOptions"
      :series="dataSource.series"
    ></ApexChart>
  </template>
  
  <script>
  import ApexChart from 'vue-apexcharts';
  
  export default {
    name: 'RoadChart',
    components: {
      ApexChart,
    },
    props: {
    height: {
      type: [Number, String],
      default: 240,
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    dataSource: {
      type: Object,
      required: true,
      default: () => ({
        series: [],
        categories: [],
        colors: [],
      }),
    },
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          height: this.height,
          animations: {
            enabled: true,
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
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
            colors: ['#ffffff'],
            fontFamily: 'Montserrat-Regular, sans-serif',
          },
        },
        grid: {
          show: false,
        },
        stroke: {
          show: false,
        },
        tooltip: {
          shared: false,
          intersect: true,
          style: {
            fontFamily: 'Montserrat-Regular, sans-serif',
            fontSize: '10px',
          },
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const category = w.config.xaxis.categories[dataPointIndex];
            const value = series[seriesIndex][dataPointIndex];
            const color = w.globals.colors[seriesIndex];
            return `
              <div style="padding: 5px; background: ${color}; color: #fff; border-radius: 0; font-size: 10px; border: none;">
                <strong>${category}:</strong> ${value}
              </div>
            `;
          },
        },
        xaxis: {
          categories: this.dataSource.categories,
          axisBorder: {
            show: true,
            color: '#4b3f3f',
          },
          axisTicks: {
            show: true,
            color: '#4b3f3f',
          },
          labels: {
            style: {
              colors: '#ffffff',
              fontSize: '11px',
            },
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
            color: '#4b3f3f',
          },
          axisTicks: {
            show: true,
            color: '#4b3f3f',
          },
          labels: {
            show: true,
            offsetX: 5,
            formatter: (val) => val,
            style: {
              colors: '#ffffff',
            },
          },
        },
        legend: {
          position: 'bottom',
          offsetY: -10,
          offsetX: 15,
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
};
  </script>
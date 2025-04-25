<template>
    <div class="grid-container">
  <div class="chart-card chart-card-first">
    <div class="card-header">Административно-территориальное деление области</div>
    <div class="card-content">
      <map-component
       :region-items="regionItems"
       :path-data-customization-method="customizePathColors"
       :text-data-customization-method="customizePathTexts"
       
       />     
    </div>
  </div>
</div>
  </template>
<script>

import MapComponent from './MapComponent.vue';

export default {
  name: 'MapCard',
  components: { MapComponent },
  data() {
    return {
          regionItems: [
                {
                  id: 4,
                  name: "Айыртауский район",
                  svgClass: "fil4",
                  percentage: '62.5%',
                  fertility: { 2023: '11.24', 2024: '9.82' },
                  mortality: { 2023: '12.01', 2024: '12.28' },
                },
                {
                  id: 5,
                  name: "Акжарский район",
                  svgClass: "fil5",
                  percentage: '100%',
                  fertility: { 2023: '14.11', 2024: '12.06' },
                  mortality: { 2023: '9.46', 2024: '8.97' },
                },
                {
                  id: 10,
                  name: "Аккайынский район",
                  svgClass: "fil10",
                  percentage: '',
                  fertility: { 2023: '9.29', 2024: '7.72' },
                  mortality: { 2023: '13.4', 2024: '15.28' },
                },
                {
                  id: 3,
                  name: "Район им. Габита Мусрепова",
                  svgClass: "fil3",
                  percentage: '100%',
                  fertility: { 2023: '9.68', 2024: '8.71' },
                  mortality: { 2023: '12.05', 2024: '10.59' },
                },
                {
                  id: 9,
                  name: "Есильский район",
                  svgClass: "fil9",
                  percentage: '17.1%',
                  fertility: { 2023: '9.37', 2024: '9.02' },
                  mortality: { 2023: '13.21', 2024: '12.82' },
                },
                {
                  id: 7,
                  name: "Жамбылский район",
                  svgClass: "fil7",
                  percentage: '0%',
                  fertility: { 2023: '10.81', 2024: '11.28' },
                  mortality: { 2023: '10.76', 2024: '13.03' },
                },
                {
                  id: 1,
                  name: "Кызылжарский район",
                  svgClass: "fil1",
                  percentage: '76%',
                  fertility: { 2023: '9.97', 2024: '9.29' },
                  mortality: { 2023: '10.36', 2024: '10.52' },
                },
                {
                  id: 6,
                  name: "Район Магжана Жумабаева",
                  svgClass: "fil6",
                  percentage: '36%',
                  fertility: { 2023: '9.12', 2024: '10.61' },
                  mortality: { 2023: '12.66', 2024: '13.53' },
                },
                {
                  id: 12,
                  name: "Мамлютский район",
                  svgClass: "fil12",
                  percentage: '',
                  fertility: { 2023: '10.59', 2024: '10.23' },
                  mortality: { 2023: '13.23', 2024: '12.65' },
                },
                {
                  id: 2,
                  name: "Тайыншинский район",
                  svgClass: "fil2",
                  percentage: '21.7%',
                  fertility: { 2023: '10.43', 2024: '10.02' },
                  mortality: { 2023: '11.88', 2024: '10.43' },
                },
                {
                  id: 11,
                  name: "Тимирязевский район",
                  svgClass: "fil11",
                  percentage: '',
                  fertility: { 2023: '9.31', 2024: '9.92' },
                  mortality: { 2023: '11.46', 2024: '12.58' },
                },
                {
                  id: 0,
                  name: "Уалихановский район",
                  svgClass: "fil0",
                  percentage: '35.3%',
                  fertility: { 2023: '16.09', 2024: '14.61' },
                  mortality: { 2023: '8.2', 2024: '7.41' },
                },
                {
                  id: 8,
                  name: "Район Шал акына",
                  svgClass: "fil8",
                  percentage: '100%',
                  fertility: { 2023: '11.29', 2024: '11.07' },
                  mortality: { 2023: '13.53', 2024: '14.05' },
                },
                {
                  id: '1-city',
                  name: "г. Петропавловск",
                  svgClass: "fnt-city",
                  percentage: '○ г. Петропавловск - 87.3%',
                  fertility: { 2023: '', 2024: '' },
                  mortality: { 2023: '', 2024: '' },
                },
            ],
    }
},
methods: {
customizePathColors() {
      const styles = {};
      this.regionItems.forEach((region) => {
        const regionId = String(region.id);
        if (region.percentage) {
          const percentage = parseFloat(region.percentage);
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
  }, 
};
</script>



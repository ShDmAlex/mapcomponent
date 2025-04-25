<template>
  <div id="app">
    
    <PageWithBackground />
    
  </div>
</template>

<script>


import PageWithBackground from '@/components/PageWithBackground.vue';


export default {
  name: 'App',
  components: {
    PageWithBackground,
    
  }
};
</script>

<style>

@font-face {
  font-family: 'Montserrat-Regular'; 
  src: url('@/assets/fonts/Montserrat-Regular.ttf') format('truetype'); 
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'MontserratAlternates-SemiBold';
  src: url('@/assets/fonts/MontserratAlternates-SemiBold.ttf') format('truetype');
}
body {
  background-color: #1f2324; 
  margin: 0;
  font-family: Monserrat-Regular, sans-serif;
  overflow: hidden;
}
::-webkit-scrollbar {
  display: none; /* Скрыть полосу скролла */
}
.region-quota-list::-webkit-scrollbar {
  display: block;
}
.secondary-font{
  font-family: MontserratAlternates-SemiBold, sans-serif;
}
h1 {
  font-family: 'Montserrat-Regular', sans-serif;
}
.apexcharts-text {
  font-family: 'Montserrat-Regular', sans-serif !important;
}
</style>

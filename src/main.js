import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'flag-icon-css/css/flag-icons.min.css';
import VTooltip from 'v-tooltip';
import VueCountUp from 'vue-countup-v2';
import './assets/styles.css'; 


Vue.use(VTooltip, {
  disposeTimeout: 5000000
});
Vue.use(VueCountUp);
Vue.use(VueApexCharts);
Vue.component('ApexChart', VueApexCharts);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

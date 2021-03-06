// Polyfills
import 'core-js/fn/object/entries';

// Patternfly defaults
import './pf-settings/patternfly-settings.js';
import './pf-settings/patternfly-settings-base.js';
import './pf-settings/patternfly-settings-charts.js';
import './pf-settings/patternfly-settings-colors.js';

// Vue plugins
import Vue from 'vue';

import VuePatternFly from 'vue-patternfly';
Vue.use(VuePatternFly);
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VueResize from 'vue-resize-directive';
Vue.directive('resize', VueResize);

import d3Tip from 'd3-tip';
window.d3.tip = d3Tip;

import Cookies from 'js-cookie';
window.Cookies = Cookies;

import axios from 'axios';
window.axios = axios;
Vue.prototype.$http = axios;

import VueStrap from 'vue-strap';
import Select from './components/vue-strap/Select.vue';

for (let [name, component] of Object.entries(VueStrap)) {
  if (name === 'aside') {
    Vue.component('sidebar', component);
  } else if (name === 'input') {
    // Do nothing
  } else if (name === 'option') {
    Vue.component('v-option', component);
  } else if (name === 'select') {
    Vue.component('bs-select', Select);
    Vue.component('v-select', Select);
  } else {
    Vue.component(name, component);
  }
}

import NumberSpinner from './components/vue-strap/NumberSpinner.vue';
Vue.component(NumberSpinner.name, NumberSpinner);

// Components
import DonutChart from './components/c3/DonutChart.vue'
import DonutUtilizationChart from './components/c3/DonutUtilizationChart.vue';
import SingleLineChart from './components/c3/SingleLineChart.vue';
import StackedBarChart from './components/c3/StackedBarChart.vue';
import MultiLineChart from './components/c3/MultiLineChart.vue';
import SparklineChart from './components/c3/SparklineChart.vue';
import UtilizationTrendChart from './components/c3/UtilizationTrendChart.vue';
import TrendDetails from './components/c3/TrendDetails.vue';
import TrendChart from './components/c3/TrendChart.vue';
import UtilizationBarChart from './components/c3/UtilizationBarChart.vue';
import Datatable from './components/datatable/vue-datatable.vue';

Vue.component(DonutChart.name, DonutChart);
Vue.component(DonutUtilizationChart.name, DonutUtilizationChart);
Vue.component(SingleLineChart.name, SingleLineChart);
Vue.component(StackedBarChart.name, StackedBarChart);
Vue.component(MultiLineChart.name, MultiLineChart);
Vue.component(SparklineChart.name, SparklineChart);
Vue.component(UtilizationTrendChart.name, UtilizationTrendChart);
Vue.component(TrendDetails.name, TrendDetails);
Vue.component(TrendChart.name, TrendChart);
Vue.component(UtilizationBarChart.name, UtilizationBarChart);
Vue.component(Datatable.name, Datatable);

const router = new VueRouter({
  routes: window.vertxConsoleRoutes,
  mode: 'abstract'
});

// App
import App from './App.vue'

new Vue(Object.assign(App, {
  el: '#app',
  router
}));

router.replace(router.options.routes[0].path);
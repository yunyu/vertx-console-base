require('./pf-settings/patternfly-settings.js');
require('./pf-settings/patternfly-settings-base.js');
require('./pf-settings/patternfly-settings-charts.js');
require('./pf-settings/patternfly-settings-colors.js');

import Vue from 'vue'


import VuePatternFly from 'vue-patternfly'
import VueRouter from 'vue-router';
import App from './App.vue'

import Home from './pages/Home.vue'
import Logging from './pages/Logging.vue'

Vue.use(VuePatternFly);
Vue.use(VueRouter);

import DonutUtilizationChart from './components/c3/DonutUtilizationChart.vue';
import SingleLineChart from './components/c3/SingleLineChart.vue';
import StackedBarChart from './components/c3/StackedBarChart.vue';
import MultiLineChart from './components/c3/MultiLineChart.vue';
import SparklineChart from './components/c3/SparklineChart.vue';
import UtilizationTrendChart from './components/c3/UtilizationTrendChart.vue';
import TrendDetails from './components/c3/TrendDetails.vue';
import TrendChart from './components/c3/TrendChart.vue';
import UtilizationBarChart from './components/c3/UtilizationBarChart.vue';

Vue.component(DonutUtilizationChart.name, DonutUtilizationChart);
Vue.component(SingleLineChart.name, SingleLineChart);
Vue.component(StackedBarChart.name, StackedBarChart);
Vue.component(MultiLineChart.name, MultiLineChart);
Vue.component(SparklineChart.name, SparklineChart);
Vue.component(UtilizationTrendChart.name, UtilizationTrendChart);
Vue.component(TrendDetails.name, TrendDetails);
Vue.component(TrendChart.name, TrendChart);
Vue.component(UtilizationBarChart.name, UtilizationBarChart);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/logging',
      component: Logging
    }
  ],
  mode: 'abstract'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})  

router.replace('/');
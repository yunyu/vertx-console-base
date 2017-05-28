require('./pf-settings/patternfly-settings.js');
require('./pf-settings/patternfly-settings-base.js');
require('./pf-settings/patternfly-settings-charts.js');
require('./pf-settings/patternfly-settings-colors.js');

import Vue from 'vue'


import VuePatternFly from 'vue-patternfly'
import VueRouter from 'vue-router';
import App from './App.vue'

import Home from './pages/Home.vue'

Vue.use(VuePatternFly);
Vue.use(VueRouter);

import DonutUtilizationChart from './components/c3/DonutUtilizationChart.vue';
import SparklineChart from './components/c3/SparklineChart.vue';

Vue.component(DonutUtilizationChart.name, DonutUtilizationChart);
Vue.component(SparklineChart.name, SparklineChart);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
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
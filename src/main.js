require('./pf-settings/patternfly-settings.js');
require('./pf-settings/patternfly-settings-base.js');
require('./pf-settings/patternfly-settings-charts.js');
require('./pf-settings/patternfly-settings-colors.js');

import Vue from 'vue'

import DonutUtilizationChart from './components/c3/DonutUtilizationChart.vue';

import VuePatternFly from 'vue-patternfly'
import VueRouter from 'vue-router';
import App from './App.vue'

import Home from './pages/Home.vue'

Vue.use(VuePatternFly);
Vue.component(DonutUtilizationChart.name, DonutUtilizationChart);
Vue.use(VueRouter);

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
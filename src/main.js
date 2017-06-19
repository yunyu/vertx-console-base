// Patternfly defaults
require('./pf-settings/patternfly-settings.js');
require('./pf-settings/patternfly-settings-base.js');
require('./pf-settings/patternfly-settings-charts.js');
require('./pf-settings/patternfly-settings-colors.js');

// Vue plugins
import Vue from 'vue'
import VuePatternFly from 'vue-patternfly'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'

Vue.use(VuePatternFly);
Vue.use(VueRouter);
Vue.use(VueResource);

// Components
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

// Routing
import Overview from './pages/metrics/Overview.vue';
import Logging from './pages/logging/Logging.vue';
import Services from './pages/services/Services.vue';

const routerOptions = {
  routes: [
    {
      path: '/',
      component: Overview
    },
    {
      path: '/logging',
      component: Logging
    },
    {
      path: '/services',
      component: Services
    }
  ],
  mode: 'abstract'
};
const router = new VueRouter(routerOptions);

// App
import App from './App.vue'

new Vue(Object.assign(App, {
  el: '#app',
  router
}));

router.replace('/');
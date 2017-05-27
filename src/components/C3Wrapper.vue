<template>
  <div>
  </div>
</template>

<script>
import c3 from 'c3';

export default {
  name: 'pf-chart',
  props: {
    title: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: 'bar',
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    generated: {
      type: Function,
      default() {
        return () => { };
      }
    }
  },
  data() {
    return {
      chart: undefined
    }
  },
  mounted() {
    const c3ChartDefaults = window.patternfly.c3ChartDefaults;
    let config;
    let mappedType;
    switch (this.type) {
      case 'bar':
        config = c3ChartDefaults().getDefaultBarConfig(this.categories);
        mappedType = 'bar';
        break;
      case 'grouped-bar':
        config = c3ChartDefaults().getDefaultGroupedBarConfig();
        mappedType = 'bar';
        break;
      case 'donut':
        config = c3ChartDefaults().getDefaultDonutConfig(this.title);
        mappedType = 'donut';
        break;
    }
    var donutConfig = config;
    donutConfig.color = {
      pattern: ["#EC7A08", "#D1D1D1"]
    };
    donutConfig.data = this.data;
    console.log(JSON.stringify(donutConfig));

    donutConfig.bindto = this.$el;
    this.chart = c3.generate(donutConfig);
    this.generated(this.chart);
  },
  beforeDestroy() {
    this.chart.destroy();
  }
};
</script>

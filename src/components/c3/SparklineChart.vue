<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-sparkline',
    props: {
        tooltipContents: {
            type: Object
        }
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultSparklineConfig();
            if (this.tooltipContents) {
                chartData.tooltip = this.tooltipContents;
            }
            return chartData;
        },
        getC3Data() {
            // No support for shifting data, unfortunately
            // See https://stackoverflow.com/questions/37255628/how-to-have-smooth-horizontal-transition-on-a-c3js-dynamic-chart
            return {
                columns: [
                    this.data.units ? [this.data.units].concat(this.data.values) : this.data.values
                ],
                type: 'area'
            };
        },
        onDataUpdated() {
            this.chart.load(this.chartData.data);
        }
    }
}
</script>

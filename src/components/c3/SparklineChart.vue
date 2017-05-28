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
                x: 'x_',
                columns: [
                    ['x_'].concat(this.data.indices),
                    ['y_'].concat(this.data.values)
                ],
                type: 'area',
                length: 0
            };
        },
        onDataUpdated() {
            this.chart.flow(this.chartData.data);
        }
    }
}
</script>

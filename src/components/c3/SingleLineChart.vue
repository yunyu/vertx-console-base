<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-single-line',
    props: {
        tooltipContents: {
            type: Object
        }
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultSingleLineConfig();
            if (this.tooltipContents) {
                chartData.tooltip = this.tooltipContents;
            }
            return chartData;
        },
        getC3Data() {
            return {
                x: 'x_',
                columns: [
                    ['x_'].concat(this.data.indices),
                    ['y_'].concat(this.data.values)
                ],
                type: 'line',
                length: this.data.retainLength ? 1 : 0,
                duration: 100
            };
        },
        onDataUpdated() {
            // TODO: Implement workaround for https://github.com/c3js/c3/issues/1097
            this.chart.flow(this.chartData.data);
        }
    }
}
</script>

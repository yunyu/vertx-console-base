<script>
import FlowedLine from './FlowedLine.vue';

export default {
    name: 'pf-sparkline',
    extends: FlowedLine,
    props: {
        tooltipContents: {
            type: Object
        },
        maxDisplayed: {
            default: 10
        }
    },
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultSparklineConfig();
            if (this.tooltipContents) {
                chartData.tooltip = this.tooltipContents;
            }
            chartData.transition = { duration: 100 };
            return chartData;
        },
        getC3Data() {
            return {
                x: 'x_',
                columns: [
                    ['x_'].concat(this.data.indices),
                    ['y_'].concat(this.data.values)
                ],
                type: 'area',
                length: this.getC3FlowLength(),
                duration: 100
            };
        }
    }
}
</script>

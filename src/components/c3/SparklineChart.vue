<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-sparkline',
    extends: C3Wrapper,
    props: {
        tooltipContents: {
            type: Object
        },
        maxDisplayed: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            totalDisplayed: 0,
            flowBuffer: []
        }
    },
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultSparklineConfig();
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
                type: 'area',
                length: this.totalDisplayed++ > this.maxDisplayed ? 1 : 0,
                duration: 100
            };
        },
        onDataUpdated() {
            if (document.hidden) {
                this.flowBuffer.push(this.chartData.data);
                while (this.flowBuffer.length > this.maxDisplayed) {
                    this.flowBuffer.shift();
                }
            } else {
                while (this.flowBuffer.length > 0) {
                    this.chart.flow(this.flowBuffer.shift());
                }
                this.chart.flow(this.chartData.data);
            }
        }
    }
}
</script>

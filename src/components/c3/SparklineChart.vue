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
                length: ++this.totalDisplayed > this.maxDisplayed ? 1 : 0,
                duration: 100
            };
        },
        onDataUpdated() {
            if (!this.chart || !this.chartData) {
                return;
            }
            if (document.hidden) {
                this.chartData.data.duration = 0;
                this.flowBuffer.push(this.chartData.data);
                while (this.flowBuffer.length > this.maxDisplayed) {
                    this.flowBuffer.shift();
                }
            } else if (this.flowBuffer.length > 0) {
                const byLength = [];
                while (this.flowBuffer.length > 0) {
                    let bufItem = this.flowBuffer.shift();
                    let itemLen = bufItem.length;
                    if (byLength.length <= itemLen) {
                        byLength.push(bufItem);
                    } else {
                        let existingKey = byLength[itemLen];
                        for (let i = 0; i < existingKey.columns.length; i++) {
                            existingKey.columns[i] = existingKey.columns[i].concat(bufItem.columns[i].slice(-1));
                        }
                    }
                }
                for (let toFlow of byLength) {
                    this.chart.flow(toFlow);
                }
            } else {
                this.chart.flow(this.chartData.data);
            }
        }
    }
}
</script>

<template>
    <div class="line-chart-pf">
    </div>
</template>

<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-single-line',
    props: {
        tooltipContents: {
            type: Object
        },
        maxDisplayed: {
            type: Number,
            default: 30
        }
    },
    extends: C3Wrapper,
    data() {
        return {
            totalDisplayed: 0,
            flowBuffer: []
        }
    },
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultSingleLineConfig();
            if (this.tooltipContents) {
                chartData.tooltip = this.tooltipContents;
            }
            chartData.axis = {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S'
                    }
                }
            };
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
                console.log(JSON.stringify(byLength, null, 4));
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

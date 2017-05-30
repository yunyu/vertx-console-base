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
            if (this.chart && this.chartData) {
                if (document.hidden) {
                    this.flowBuffer.push(this.chartData.data);
                    while (this.flowBuffer.length > this.maxDisplayed) {
                        this.flowBuffer.shift();
                    }
                } else {
                    let i = 0;
                    while (this.flowBuffer.length > 0) {
                        var dataToFlow = this.flowBuffer.shift();
                        dataToFlow.duration = 0;
                        console.log(i);
                        console.log(JSON.stringify(dataToFlow));
                        this.chart.flow(dataToFlow);
                        ++i;
                    }
                    this.chart.flow(this.chartData.data);
                }
            }
        }
    }
}
</script>

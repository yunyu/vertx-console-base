<template>
    <div class="line-chart-pf">
    </div>
</template>

<script>
import FlowedLine from './FlowedLine.vue';

export default {
    name: 'pf-stacked-bar',
    props: {
        tooltipContents: {
            type: Object
        },
        maxDisplayed: {
            default: 30
        }
    },
    extends: FlowedLine,
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultLineConfig();
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
            chartData.transition = { duration: 0 };
            chartData.legend = {
                position: 'right'
            };
            return chartData;
        },
        getC3Data() {
            let c3Data = {
                x: 'x_',
                columns: [
                    ['x_'].concat(this.data.indices)
                ],
                type: 'bar',
                order: null,
                length: this.getC3FlowLength(),
                duration: 100,
                groups: [[]]
            };
            if (this.data.colors) {
                c3Data.colors = this.data.colors;
            }
            const cf = 10;
            let prevValue = 0;
            for (let [k, v] of Object.entries(this.data.values)) {
                c3Data.columns.push([k].concat((v * cf - prevValue * cf) / cf));
                prevValue = v;
                c3Data.groups[0].push(k);
            }
            if (this.data.baseline && this.chart) {
                let yGridData = Object.assign({ class: 'stacked-bar-baseline' }, this.data.baseline);
                this.chart.ygrids([yGridData])
            }
            return c3Data;
        }
    }
}
</script>

<style>
.stacked-bar-baseline line {
    stroke: #000;
}

.stacked-bar-baseline text {
    fill: #000;
}
</style>
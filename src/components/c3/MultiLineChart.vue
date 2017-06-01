<template>
    <div class="line-chart-pf">
    </div>
</template>

<script>
import FlowedLine from './FlowedLine.vue';

export default {
    name: 'pf-multi-line',
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
            chartData.transition = { duration: 0 };
            return chartData;
        },
        getC3Data() {
            let c3Data = {
                x: 'x_',
                columns: [
                    ['x_'].concat(this.data.indices)
                ],
                type: 'line',
                length: this.getC3FlowLength(),
                duration: 100
            };
            for (let [k, v] of Object.entries(this.data.values)) {
                c3Data.columns.push([k].concat(v));
            }
            return c3Data;
        }
    }
}
</script>

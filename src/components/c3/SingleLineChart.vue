<template>
    <div class="line-chart-pf">
    </div>
</template>

<script>
import FlowedLine from './FlowedLine.vue';

export default {
    name: 'pf-single-line',
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
                length: this.getC3FlowLength(),
                duration: 100
            };
        }
    }
}
</script>

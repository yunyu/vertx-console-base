<template>
    <div>
    </div>
</template>

<script>
import c3 from 'c3';

export default {
    name: 'pf-c3chart',

    props: {
        type: {
            type: String,
            default: 'bar',
        },
        title: String,
        categories: Array,
        data: {
            type: Object,
            default: () => { }
        },
        axis: {
            type: Object,
            default: () => { }
        },
        tooltipText: {
            type: Function,
            default: d => Math.round(d[0].ratio * 100) + '% ' + d[0].name
        },
        chartCallback: {
            type: Function,
            default: chart => { }
        }
    },
    mounted() {
        const c3ChartDefaults = window.patternfly.c3ChartDefaults;
        let chartData = {};
        if (this.type === 'donut') {
            chartData = c3ChartDefaults().getDefaultDonutConfig(this.title);
            chartData.tooltip = {
                contents: d => '<span class="donut-tooltip-pf">' + this.tooltipText(d) + '</span>'
            };
        } else if (this.type === 'bar') {
            chartData = c3ChartDefaults().getDefaultBarConfig(this.categories);
        }

        chartData.bindto = this.$el;
        chartData.data = this.data;
        chartData.data.type = this.type;
        if (this.title) {
            chartData[this.type].title = this.title;
        }

        this.chart = c3.generate(chartData);
        this.chartCallback(this.chart);
    },
};
</script>

<style>
.c3-tooltip td {
    color: inherit;
}
</style>
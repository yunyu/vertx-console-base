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
        this.chartData = {};
        if (this.type === 'donut') {
            this.chartData = c3ChartDefaults().getDefaultDonutConfig(this.title);
            this.chartData.tooltip = {
                contents: d => '<span class="donut-tooltip-pf">' + this.tooltipText(d) + '</span>'
            };
        } else if (this.type === 'bar') {
            this.chartData = c3ChartDefaults().getDefaultBarConfig(this.categories);
        }

        this.chartData.bindto = this.$el;
        this.updateData();
        this.chart = c3.generate(this.chartData);
        this.chartCallback(this.chart);
    },
    watch: {
        data() {
            // console.log('updating chartdata')
            this.updateData();
            // console.log(JSON.stringify(this.chartData.data))
            this.chart.load(this.chartData.data);
        }
    },
    methods: {
        updateData() {
            this.chartData.data = this.data;
            this.chartData.data.type = this.type;
        }
    }
};
</script>

<style>
.c3-tooltip td {
    color: inherit;
}
</style>
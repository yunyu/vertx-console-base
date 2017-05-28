<template>
    <div>
    </div>
</template>

<script>
import c3 from 'c3';

export default {
    props: {
        type: String,
        title: String,
        width: Number,
        height: Number,
        data: {
            type: Object,
            default: () => { }
        },
        axis: {
            type: Object,
            default: () => { }
        }
    },
    mounted() {
        this.chartData = this.getDefaults(window.patternfly.c3ChartDefaults);
        this.chartData.bindto = this.$el;
        this.updateData();
        this.chart = c3.generate(this.chartData);
        this.onGenerated(this.chart);
    },
    watch: {
        data() {
            this.updateData();
            this.chart.load(this.chartData.data);
        }
    },
    methods: {
        getDefaults(chartDefaults) {
            throw 'Not implemented';
        },
        updateData() {
            this.chartData.data = this.data;
            this.chartData.data.type = this.type;
        },
        onGenerated(chart) {}
    }
};
</script>

<style>
.c3-tooltip td {
    color: inherit;
}
</style>
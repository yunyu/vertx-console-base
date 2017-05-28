<template>
    <div>
    </div>
</template>

<script>
import c3 from 'c3';

export default {
    props: {
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
        this.bindData();
        this.chart = c3.generate(this.chartData);
        this.onGenerated();
    },
    beforeDestroy() {
        this.chart.destroy();
    },
    watch: {
        data() {
            this.bindData();
            this.chart.load(this.chartData.data);
        }
    },
    methods: {
        getC3Type() { },
        getC3Data() { },
        getDefaults(chartDefaults) { },
        bindData() {
            this.chartData.data = this.getC3Data();
            this.chartData.data.type = this.getC3Type();
        },
        onGenerated() { }
    }
};
</script>

<style>
.c3-tooltip td {
    color: inherit;
}
</style>
<template>
    <div>
    </div>
</template>

<script>
import c3 from 'c3';

export default {
    props: {
        width: Number,
        height: Number,
        data: {
            type: Object,
            default: () => { }
        },
        axis: {
            type: Object,
            default: () => { }
        },
        splitFormattedFn: {
            type: Function,
            default: s => s.split(' ')
        }
    },
    beforeCreate() {
        this.patternfly = window.patternfly;
    },
    mounted() {
        this.totalDisplayed = 0;
        this.buffer = [];
        this.prevHidden = false;
        
        this.chartData = this.getDefaults(this.patternfly.c3ChartDefaults);
        this.chartData.bindto = this.$el;
        if (this.width || this.height) {
            let size = {};
            if (this.width) size.width = this.width;
            if (this.height) size.height = this.height;
            this.chartData.size = size;
        }
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
            this.onDataUpdated()
        }
    },
    methods: {
        bindData() {
            this.chartData.data = this.getC3Data();
        },
        getDefaults(chartDefaults) { },
        getC3Data() { },
        onGenerated() { },
        onDataUpdated() { }
    }
};
</script>

<style>
.c3-tooltip td {
    color: #fff;
}
</style>
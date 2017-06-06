<template>
    <div class="pf-trend-section pf-card-section">
        <div class="col-sm-4 col-md-4">
            <pf-trend-details :data="data" :title="title" :showActualValue="showActualValue"></pf-trend-details>
        </div>
        <div class="col-sm-8 col-md-8">
            <pf-sparkline :tooltipContents="sparklineTooltipContents" :maxDisplayed="historySize" :data="c3SparklineData"></pf-sparkline>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pf-trend',
    props: {
        labelType: {
            type: String,
            default: 'used'
        },
        data: {
            type: Object,
            default: () => { }
        },
        historySize: {
            type: Number
        },
        showActualValue: {
            type: Boolean,
            default: true
        },
        title: String
    },
    data() {
        return {
            sparklineTooltipContents: this.makeTooltipContents(),
            c3SparklineData: { indices: [0], values: [0] }
        }
    },
    methods: {
        makeTooltipContents() {
            let tooltipFn = null;
            let formatFn = this.data.formatFn ? this.data.formatFn : n => n;
            if (this.labelType === 'used' || this.labelType === 'available') {
                tooltipFn = d => '<span class="c3-tooltip-sparkline">' + formatFn(d[0].value) + '</span>';
            } else if (this.labelType === 'none') {
                tooltipFn = d => '';
            }
            return { contents: tooltipFn };
        }
    },
    computed: {
        ratio() {
            return this.filledData.used / this.filledData.total;
        },
        filledData() {
            const filledData = Object.assign({}, this.data);
            if (!this.data.available && this.data.total) {
                filledData.available = this.data.total - this.data.used;
            } else if (!this.data.total && this.data.available) {
                filledData.total = this.data.used + this.data.available;
            }
            return filledData;
        }
    },
    watch: {
        data() {
            this.c3SparklineData = { indices: [new Date()], values: [this.data.value] };
            // console.log(JSON.stringify(this.c3SparklineData));
        }
    }
}
</script>

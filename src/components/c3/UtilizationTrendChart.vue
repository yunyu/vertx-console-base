<template>
    <div>
        <p class="card-pf-utilization-details">
            <span class="card-pf-utilization-card-details-count">{{ labelType === 'available' ? data.formatFn(filledData.used) : data.formatFn(filledData.available) }}</span>
            <span class="card-pf-utilization-card-details-description">
                <span class="card-pf-utilization-card-details-line-1">{{ labelType === 'available' ? 'Used' : 'Available' }}</span>
                <span class="card-pf-utilization-card-details-line-2">of {{ data.formatFn(filledData.total) }}</span>
            </span>
        </p>
        <pf-donut-util ref="donut" :centerLabelType="labelType" :usedColor="donutColor" :data="data">
        </pf-donut-util>
        <pf-sparkline :tooltipContents="sparklineTooltipContents" :maxDisplayed="historySize" :data="c3SparklineData"></pf-sparkline>
    </div>
</template>

<script>
export default {
    name: 'pf-util-trend',
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
        donutColor: String
    },
    data() {
        return {
            sparklineTooltipContents: this.makeTooltipContents(),
            c3SparklineData: { indices: [0], values: [this.data.used] }
        }
    },
    methods: {
        makeTooltipContents() {
            const units = ' ' + this.data.units;
            let tooltipFn = null;
            if (this.labelType === 'used' || this.labelType === 'available') {
                tooltipFn = d => '<span class="c3-tooltip-sparkline">' + d[0].value + units + ' Used' + '</span>';
            } else if (this.labelType === 'none') {
                tooltipFn = d => '';
            }
            return { contents: tooltipFn };
        }
    },
    computed: {
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
            this.c3SparklineData = { indices: [new Date()], values: [this.data.used] };
        }
    }
}
</script>

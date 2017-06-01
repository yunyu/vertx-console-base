<template>
    <div style="overflow: hidden">
        <div class="col-sm-4 col-md-4">
            <div class="trend-compact-details">
                <span v-if="showActualValue">
                    <span class="trend-title-compact-big-pf"> {{ data.used }}</span>
                    <span class="trend-title-compact-small-pf">{{ data.units.trim() }}</span>
                </span>
                <span class="trend-header-compact-pf" v-if="title">{{ title }}</span>
            </div>
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
            if (this.labelType === 'used' || this.labelType === 'available') {
                tooltipFn = d => '<span class="c3-tooltip-sparkline">' + d[0].value + this.data.units + '</span>';
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
            this.c3SparklineData = { indices: [new Date()], values: [this.data.used] };
            console.log(JSON.stringify(this.c3SparklineData));
        }
    }
}
</script>

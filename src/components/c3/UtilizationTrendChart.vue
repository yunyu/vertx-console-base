<template>
    <div>
        <pf-donut-util ref="donut" :centerLabelType="labelType" :data="data">
        </pf-donut-util>
        <pf-sparkline ref="donut" :tooltipContents="sparklineTooltipContents" :data="c3SparklineData"></pf-sparkline>
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
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            timeSeriesData: Array(3).fill(this.data.used),
            sparklineTooltipContents: this.makeTooltipContents()
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
        c3SparklineData() {
            return { values: ['used'].concat(this.timeSeriesData) };
        }
    },
    watch: {
        data() {
            const prev = this.timeSeriesData;
            prev.push(this.data.used);
            if (prev.length > this.historySize) {
                prev.shift();
            }
        }
    }
}
</script>

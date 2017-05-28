<template>
    <div>
        <pf-donut-util ref="donut" :centerLabelType="labelType" :data="data">
        </pf-donut-util>
        <pf-sparkline ref="donut" :tooltipContents="sparklineTooltipContents" :data="timeSeriesData"></pf-sparkline>
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
        }
    },
    data() {
        return {
            timeSeriesData: { units: 'MB used', values: [10, 14, 12, 20, 31, 27, 44, 36, 52, 55, 62, 68, 69, 88, 74, 88, 91] },
            sparklineTooltipContents: this.makeTooltipContents()
        }
    },
    methods: {
        makeTooltipContents() {
            const units = ' ' + this.data.units;
            console.log(this.labelType);
            if (this.labelType === 'used' || this.labelType === 'available') {
                return d => '<span class="c3-tooltip-sparkline">' + d[0] + units + ' Used' + '</span>';
            } else if (this.labelType === 'none') {
                return d => '';
            } else {
                return undefined;
            }
        }
    },
    watch: {
        data() {

        }
    }
}
</script>

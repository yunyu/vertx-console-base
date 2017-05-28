<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-donut-util',
    props: {
        centerLabelType: String,
        tooltipContents: {
            type: Function
        },
        usedColor: String
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            let chartData = chartDefaults().getDefaultDonutConfig('');
            chartData.tooltip = {};
            if (this.tooltipContents) {
                chartData.tooltip.contents = this.tooltipContents;
            } else {
                chartData.tooltip.contents = this.patternfly.pfGetUtilizationDonutTooltipContentsFn('');
            }
            return chartData;
        },
        getC3Data() {
            if (!this.data.available) {
                if (this.data.total) {
                    this.data.available = this.data.total - this.data.used;
                }
            }
            return {
                columns: [
                    ['used', this.data.used],
                    ['available', this.data.available]
                ],
                type: 'donut'
            };
        },
        onGenerated() {
            this.updateCenterLabelText();
        },
        onDataUpdated() {
            this.chart.load(this.chartData.data);
            this.updateCenterLabelText();
        },
        updateCenterLabelText() {
            let centerLabelText = { big: '', small: '' };
            if (this.centerLabelType === 'used') {
                centerLabelText.big = this.data.used;
                centerLabelText.small = this.data.units + ' Used';
            } else if (this.centerLabelType === 'available') {
                centerLabelText.big = this.data.available;
                centerLabelText.small = this.data.units + ' Available';
            } else if (this.centerLabelType === 'percent') {
                centerLabelText.big = Math.round(this.data.used / (this.data.used + this.data.available) * 100.0) + '%';
                centerLabelText.small = 'of ' + (this.data.used + this.data.available) + ' ' + this.data.units;
            }
            this.patternfly.pfSetDonutChartTitle(this.$el, centerLabelText.big, centerLabelText.small);
        }
    }
}
</script>
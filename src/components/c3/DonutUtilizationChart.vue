<script>
import C3Wrapper from './C3Wrapper.vue';
import c3 from 'c3';

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
    methods: {
        getDefaults(chartDefaults) {
            let chartData = chartDefaults().getDefaultDonutConfig('');
            chartData.tooltip = {};
            if (this.tooltipContents) {
                chartData.tooltip.contents = this.tooltipContents;
            } else {
                chartData.tooltip.contents = this.patternfly.pfGetUtilizationDonutTooltipContentsFn('');
            }
            if (this.usedColor) {
                chartData.color.pattern[0] = this.usedColor;
            }
            chartData.transition = { duration: 0 };
            return chartData;
        },
        getC3Data() {
            return {
                columns: [
                    ['used', this.filledData.used],
                    ['available', this.filledData.available]
                ],
                type: 'donut'
            };
        },
        onGenerated() {
            this.updateCenterLabelText();
        },
        onDataUpdated() {
            if (!document.hidden) {
                this.chart.load(this.chartData.data);
                this.updateCenterLabelText();
            }
        },
        updateCenterLabelText() {
            let centerLabelText = { big: '', small: '' };
            if (this.centerLabelType === 'used') {
                const formatted = this.splitFormattedFn(this.data.formatFn(this.filledData.used));
                centerLabelText.big = formatted[0];
                centerLabelText.small = formatted[1] + ' Used';
            } else if (this.centerLabelType === 'available') {
                const formatted = this.splitFormattedFn(this.data.formatFn(this.filledData.available));
                centerLabelText.big = formatted[0];
                centerLabelText.small = formatted[1] + ' Available';
            } else if (this.centerLabelType === 'percent') {
                const formatted = this.splitFormattedFn(this.data.formatFn(this.filledData.total));
                centerLabelText.big = Math.round(this.filledData.used / this.filledData.total * 100.0) + '%';
                centerLabelText.small = 'of ' + formatted;
            }
            this.patternfly.pfSetDonutChartTitle(this.$el, centerLabelText.big, centerLabelText.small);
        }
    }
}
</script>
<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-donut-pct',
    props: {
        centerLabelType: String,
    },
    extends: C3Wrapper,
    mounted() {
        this.tooltipContents = this.patternfly.pfGetUtilizationDonutTooltipContentsFn('');
    },
    methods: {
        getDefaults(chartDefaults) {
            let chartData = chartDefaults().getDefaultDonutConfig(this.title);
            chartData.tooltip = {
                contents: d => this.tooltipContents(d)
            };
            return chartData;
        },
        getC3Type() {
            return 'donut';
        },
        getC3Data() {
            if (!this.data.available) {
                if (this.data.total) {
                    this.data.available = this.data.total - this.data.used;
                } else {
                    throw 'Missing available column'
                }
            }
            return {
                columns: [
                    ['used', this.data.used],
                    ['available', this.data.available]
                ]
            };
        },
        onGenerated() {
            this.updateCenterLabelText();
        },
        onDataUpdated() {
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
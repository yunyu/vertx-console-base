<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-donut-pct',
    props: {
        tooltipText: {
            type: Function,
            default: (d, units) => Math.round(d[0].ratio * 100) + (units ? ' ' + units : '%') + ' ' + d[0].name
        },
        centerLabelType: String,
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            let chartData = chartDefaults().getDefaultDonutConfig(this.title);
            chartData.tooltip = {
                contents: d => '<span class="donut-tooltip-pf">' + this.tooltipText(d, this.data.units) + '</span>'
            };
            return chartData;
        },
        getC3Type() {
            return 'donut';
        },
        getC3Data() {
            return {
                columns: [
                    ['used', this.data.used],
                    ['available', this.data.available]
                ]
            };
        },
        onGenerated() {
        },
        onDataUpdated() {

        },
        getCenterLabelText() {
            let centerLabelText = {};
            if (this.centerLabelType === 'used') {
                centerLabelText.big = this.data.used;
                centerLabelText.small = this.data.units + ' Used';
            } else if (this.centerLabelType === 'available') {
                centerLabelText.big = this.data.available;
                centerLabelText.small = this.data.units + ' Available';
            } else if (this.centerLabelType === 'percent') {
                centerLabelText.big = Math.round(this.data.used / (this.data.used + this.data.available) * 100.0) + '%';
                centerLabelText.smText = 'of ' + (this.data.used + this.data.available) + ' ' + this.data.units;
            }
            return centerLabelText;
        }
    }
}
</script>
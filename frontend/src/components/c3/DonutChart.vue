<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-donut',
    props: {
        legendPosition: String,
        centerText: Object
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            let chartData = chartDefaults().getDefaultDonutConfig();
            chartData.transition = { duration: 0 };
            chartData.tooltip = { show: true };
            if (this.legendPosition) {
                chartData.legend = {
                    show: true,
                    position: this.legendPosition
                };
            }
            chartData.color.pattern = ['#0088ce', '#3f9c35', '#f5c12e', '#ec7a08', '#a30000'];
            return chartData;
        },
        getC3Data() {
            return {
                columns: this.data.columns,
                type: 'donut'
            };
        },
        onGenerated() {
            this.updateCenterText();
        },
        onDataUpdated() {
            if (!document.hidden) {
                this.chart.load(this.chartData.data);
            }
        },
        updateCenterText() {
            if (this.centerText) {
                this.patternfly.pfSetDonutChartTitle(this.$el, this.centerText.big, this.centerText.small);
            }
        }
    },
    watch: {
        centerText() {
            this.updateCenterText();
        }
    }
}
</script>
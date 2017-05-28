<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-sparkline',
    props: {
        tooltipContents: {
            type: Object
        }
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            var chartData = chartDefaults().getDefaultSparklineConfig();
            if (this.tooltipContents) {
                chartData.tooltip = this.tooltipContents;
            }
            return chartData;
        },
        getC3Data() {
            return {
                columns: [
                    this.data.units ? [this.data.units].concat(this.data.values) : this.data.values
                ],
                type: 'area'
            };
        }
    }
}
</script>

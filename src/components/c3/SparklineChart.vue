<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-sparkline',
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            return chartDefaults().getDefaultSparklineConfig();
        },
        getC3Data() {
            return {
                columns: [
                    [this.data.units].concat(this.data.values)
                ],
                type: 'area'
            };
        }
    }
}
</script>

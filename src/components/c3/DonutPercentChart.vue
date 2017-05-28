<script>
import C3Wrapper from './C3Wrapper.vue';

export default {
    name: 'pf-donut-pct',
    props: {
        tooltipText: {
            type: Function,
            default: d => Math.round(d[0].ratio * 100) + '% ' + d[0].name
        }
    },
    extends: C3Wrapper,
    methods: {
        getDefaults(chartDefaults) {
            let chartData = chartDefaults().getDefaultDonutConfig(this.title);
            chartData.tooltip = {
                contents: d => '<span class="donut-tooltip-pf">' + this.tooltipText(d) + '</span>'
            };
            return chartData;
        }
    }
}
</script>
<script>
import UtilizationBarChart from '../../../node_modules/vue-patternfly/src/components/UtilizationBarChart.vue';

export default {
    name: 'pf-utilization-bar-chart',
    extends: UtilizationBarChart,
    props: {
        formatFn: {
            type: Function,
            default: n => n
        }
    },
    computed: {
        footerHTML() {
            if (this.footer) {
                return this.footer;
            }
            switch (this.footerFormat) {
                case 'percent':
                    return '<strong>' + this.percent + '</strong> used';
                default:
                    if (this.inline) {
                        return '<strong>' + this.formatFn(this.value) + '</strong> used';
                    }
                    return '<strong>' + this.formatFn(this.value) + ' of ' + this.formatFn(this.total) + '</strong> used';
            }
        },
    },
};
</script>

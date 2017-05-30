<script>
import C3Wrapper from './C3Wrapper.vue';
const msBetweenFlows = 50;

export default {
    extends: C3Wrapper,
    props: {
        maxDisplayed: {
            type: Number
        }
    },
    data() {
        return {
            totalDisplayed: 0,
            buffer: []
        }
    },
    methods: {
        getC3FlowLength() {
            return ++this.totalDisplayed > this.maxDisplayed ? 1 : 0;
        },
        onDataUpdated() {
            if (!this.chart || !this.chartData) {
                return;
            }
            this.chart.internal.fn.isTabVisible = () => true;
            this.chart.flow(this.chartData.data);
        }
    }
}
</script>
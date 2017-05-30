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
            prevHidden: false,
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

            this.buffer.push(this.chartData.data);
            while (this.buffer.length > this.maxDisplayed) {
                this.buffer.shift();
            }

            // Workaround for https://github.com/c3js/c3/issues/1097
            const hidden = document.hidden;
            if (hidden || this.prevHidden) {
                this.prevHidden = hidden;
                let tmpBuffer = this.buffer.slice();
                let firstEl = tmpBuffer.shift();
                while (tmpBuffer.length > 0) {
                    let bufItem = tmpBuffer.shift();
                    for (let i = 0; i < firstEl.columns.length; ++i) {
                        firstEl.columns[i] = firstEl.columns[i].concat(bufItem.columns[i].slice(-1));
                    }
                }
                this.chart.load(firstEl);
            } else {
                this.chart.flow(this.chartData.data);
            }
        }
    }
}
</script>
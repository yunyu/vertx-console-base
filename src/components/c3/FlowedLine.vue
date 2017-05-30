<script>
import C3Wrapper from './C3Wrapper.vue';
import c3 from 'c3';

export default {
    extends: C3Wrapper,
    props: {
        maxDisplayed: {
            type: Number
        }
    },
    methods: {
        getC3FlowLength() {
            return ++this.totalDisplayed > this.maxDisplayed ? 1 : 0;
        },
        onDataUpdated() {
            this.buffer.push(this.chartData.data);
            while (this.buffer.length > this.maxDisplayed) {
                this.buffer.shift();
            }

            var hidden = document.hidden;

            if (true || !hidden && this.prevHidden) {
                const origDuration = this.chart.internal.config.transition_duration;
                this.chart.internal.config.transition_duration = 0;

                let tmpBuffer = this.buffer.slice();
                let firstEl = { columns: tmpBuffer.shift().columns };
                while (tmpBuffer.length > 0) {
                    let bufItem = tmpBuffer.shift();
                    for (let i = 0; i < firstEl.columns.length; ++i) {
                        firstEl.columns[i] = firstEl.columns[i].concat(bufItem.columns[i].slice(-1));
                    }
                }
                this.chart.load(firstEl);

                this.chart.internal.config.transition_duration = origDuration;
            } else if (this.chart) {
                this.chart.flow(this.chartData.data);
            }

            this.prevHidden = hidden;
        }
    }
}
</script>
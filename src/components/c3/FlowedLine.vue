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

            if (hidden && !this.prevHidden) {
                console.log('DESTROYING')
                this.chart.destroy();
                this.chart = null;
            } else if (!hidden && this.prevHidden) {
                console.log('RESUMING')
                this.chartData.data.columns = [];
                this.chart = c3.generate(this.chartData);

                const origDuration = this.chart.internal.config.transition_duration;
                this.chart.internal.config.transition_duration = 0;

                const tmpBuffer = this.buffer.slice();
                while (tmpBuffer.length > 0) {
                    let bufItem = tmpBuffer.shift();
                    bufItem.length = 0;
                    bufItem.duration = 0;
                    this.chart.flow(bufItem);
                }

                this.chart.internal.config.transition_duration = origDuration;
            } else if (this.chart) {
                this.chart.flow(this.chartData.data);
            }

            this.prevHidden = hidden;
        }
    }
}
</script>
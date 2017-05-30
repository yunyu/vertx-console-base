<script>
import C3Wrapper from './C3Wrapper.vue';

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
            flowBuffer: []
        }
    },
    methods: {
        getC3FlowLength() {
            return ++this.totalDisplayed > this.maxDisplayed ? 1 : 0
        },
        onDataUpdated() {
            if (!this.chart || !this.chartData) {
                return;
            }
            if (document.hidden) {
                this.chartData.data.duration = 0;
                this.flowBuffer.push(this.chartData.data);
                while (this.flowBuffer.length > this.maxDisplayed) {
                    this.flowBuffer.shift();
                }
            } else if (this.flowBuffer.length > 0) {
                const byLength = new Map();
                while (this.flowBuffer.length > 0) {
                    let bufItem = this.flowBuffer.shift();
                    let itemLen = bufItem['length']; // Babel messes this up a bit
                    let existingKey = byLength.get(itemLen);
                    if (!existingKey) {
                        byLength.set(itemLen, bufItem);
                    } else {
                        for (let i = 0; i < existingKey.columns.length; i++) {
                            existingKey.columns[i] = existingKey.columns[i].concat(bufItem.columns[i].slice(-1));
                        }
                        existingKey.length += bufItem.length;
                    }
                }
                // console.log(JSON.stringify([...byLength], null, 4));
                for (let [key, toFlow] of byLength) {
                    this.chart.flow(toFlow);
                }
            } else {
                this.chart.flow(this.chartData.data);
            }
        }
    }
}
</script>
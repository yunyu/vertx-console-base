<template>
    <div class="log-display">
        <div class="log-line" v-for="logElement in logMsgs" v-if="!hiddenStatuses[logElement.logger]">[{{ dateFormat(logElement.date, 'HH:MM:ss') }}] [{{ logElement.level }}] {{ logElement.logger }} - {{ logElement.message }}</div>
    </div>
</template>

<style lang="scss">
.log-display {
    background: #030303;
    color: #d1d1d1;
    font-family: monospace;
    height: 100%;
    overflow-y: scroll;
    padding: 10px;
    display: flex;
    flex-direction: column-reverse;
}
</style>

<script>
import EventBus from 'vertx-eventbus';
import dateFormat from 'dateformat';

export default {
    props: {
        hiddenStatuses: Object,
        eventBusUrl: String
    },
    data() {
        return {
            logMsgs: []
        }
    },
    beforeMount() {
        this.dateFormat = dateFormat;
        this.eb = new EventBus(this.eventBusUrl);
        this.eb.onopen = () => {
            this.eb.registerHandler("vertx.console.logger.default", (e, m) => {
                this.logMsgs.unshift(JSON.parse(m.body));
                if (this.logMsgs.length > 200) {
                    this.logMsgs.pop();
                }
            })
        };
    },
    beforeDestroy() {
        this.eb.close();
    }
}
</script>
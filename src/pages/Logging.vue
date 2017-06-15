<template>
    <div class="logging-page row-no-padding">
        <div class="loggers-wrapper col-md-4">
            <div class="logger-display">
                <div class="loggers-entries">
                    <div class="logger-entry" v-for="logger in loggers">{{ logger.name }} - {{ logger.effectiveLevel }}</div>
                </div>
            </div>
        </div>
        <div class="log-wrapper col-md-8">
            <div class="log-display" ref="logDisplay">
                <div class="log-lines">
                    <div class="log-line" v-for="logElement in logMsgs">[{{ dateFormat(logElement.date, 'HH:MM:ss') }}] [{{ logElement.level }}] {{ logElement.logger }} - {{ logElement.message }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.logging-page,
.loggers-wrapper,
.log-wrapper {
    height: 100%;
}

.logger-display {
    height: 100%;
    overflow-y: scroll;
}

.log-display {
    background: #292e34;
    color: #d1d1d1;
    font-family: monospace;
    height: 100%;
    overflow-y: scroll;
}

.log-lines {
    margin: 10px;
}
</style>


<script>
import EventBus from 'vertx-eventbus';
import dateFormat from 'dateformat';
import Loggers from '../loggers.js';

export default {
    mounted() {
        this.eb = new EventBus('/loggerproxy/'); // wtf webpack isn't proxying this properly
        setTimeout(() => {
            this.eb.registerHandler("vertx.console.logger.default", (e, m) => {
                this.logMsgs.push(JSON.parse(m.body));
                console.log(m.body);
                if (this.logMsgs.length > 250) {
                    this.logMsgs.shift();
                }
                this.$nextTick(() => {
                    var logDisplay = this.$refs.logDisplay;
                    if (logDisplay) {
                        logDisplay.scrollTop = logDisplay.scrollHeight;
                    }
                })
            })
        }, 1000);
        this.loggersCallback = loggers => this.loggers = loggers;
        Loggers.addCallback(this.loggersCallback);
    },
    beforeDestroy() {
        Loggers.removeCallback(this.loggersCallback);
    },
    data() {
        return {
            logMsgs: [],
            dateFormat: dateFormat,
            loggers: []
        }
    }
}
</script>
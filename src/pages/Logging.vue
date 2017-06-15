<template>
    <div class="log-wrapper">
        <div class="log-display" ref="logDisplay">
            <div class="log-lines">
                <div class="log-line" v-for="logElement in logMsgs">[{{ dateFormat(logElement.date, 'HH:MM:ss') }}] [{{ logElement.level }}] {{ logElement.logger }} - {{ logElement.message }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.log-wrapper {
    height: 100%;
}

.log-display {
    background: black;
    color: #ccc;
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

export default {
    mounted() {
        this.eb = new EventBus('/loggerproxy/'); // wtf webpack isn't proxying this properly
        setTimeout(() => {
            this.eb.registerHandler("vertx.console.logger.default", (e, m) => {
                this.logMsgs.push(JSON.parse(m.body));
                console.log(m.body);
                if (this.logMsgs.length > 50) {
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
    },
    data() {
        return {
            logMsgs: [],
            dateFormat: dateFormat
        }
    }
}
</script>
<template>
    <div>
        <div class="page-header">
            <h1>Logging</h1>
        </div>
        <div class="log-header">
            <div class="logger-name">{{ logger }}</div>
            <div class="log-level">{{ logLevel }}</div>
        </div>
        <div class="log-display" id="logDisplay">
            <div class="log-lines">
                <div class="log-line" v-for="logElement in logMsgs">[{{ dateFormat(logElement.date, 'HH:MM:ss') }}] [{{ logElement.level }}] {{ logElement.logger }} - {{ logElement.message }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.log-display {
    background: black;
    color: #ccc;
    font-family: monospace;
    height: 500px;
    overflow-y: scroll;
}

.log-lines {
    padding: 10px;
}

.log-header {
    overflow: hidden;
    padding: 10px;
    border: 1px solid #ddd;
    background-clip: padding-box;
    background-color: #f5f5f5;
    background-image: linear-gradient(to bottom, #fafafa 0, #ededed 100%);
    background-repeat: repeat-x;
}

.logger-name,
.log-level {
    display: inline-block;
    font-size: 16px;
}

.logger-name {
    float: left;
    font-weight: bold;
}

.log-level {
    float: right;
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
                if (this.logMsgs.length > 50) {
                    this.logMsgs.shift();
                }
                var container = this.$el.querySelector("#logDisplay");
                container.scrollTop = container.scrollHeight;
            })
        }, 1000);
    },
    data() {
        return {
            logMsgs: [],
            logger: "Default",
            logLevel: "INFO",
            dateFormat: dateFormat
        }
    }
}
</script>
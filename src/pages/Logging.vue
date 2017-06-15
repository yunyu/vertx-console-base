<template>
    <div class="logging-page row-no-padding">
        <div class="loggers-wrapper col-md-4">
            <div class="toolbar-pf toolbar-pf-actions loggers-toolbar">
                <div class="toolbar-pf-filter">
                    <label for="filter" class="sr-only">Filter</label>
                    <input type="text" id="filter" class="form-control" placeholder="Filter" v-model="filterQuery">
                </div>
            </div>
            <div class="loggers-display">
                <div class="loggers-entries">
    
                    <div class="logger-entry" v-for="logger in filteredLoggers">
                        <div class="logger-entry-checkbox">
                            <input type="checkbox" checked>
                        </div>
                        <div class="logger-entry-name">{{ logger.name }}</div>
                        <div class="logger-entry-level">
                            <select class="btn btn-default">
                                <option value="INFO">INFO</option>
                                <option value="OFF">OFF</option>
                                <option value="ERROR">ERROR</option>
                                <option value="WARN">WARN</option>
                                <option value="DEBUG">DEBUG</option>
                                <option value="TRACE">TRACE</option>
                                <option value="ALL">ALL</option>
                            </select>
                        </div>
    
                    </div>
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

.loggers-toolbar {
    background-color: #f5f5f5;
    padding: 10px 20px;
    margin-bottom: 0px;

    .toolbar-pf-filter {
        min-width: 60%;
    }
}

.loggers-display {
    height: calc(100% - 47px);
    overflow-y: scroll;
    background-color: #fff;

    .loggers-entries {
        .logger-entry {
            padding: 10px;
            margin: 0px 10px;
            border-top: 1px solid #ededed;
            display: flex;

            &:hover {
                background-color: #ededed;
            }

            &:first-child {
                border-top: none;
            }

            .logger-entry-checkbox {
                border-right: 1px solid #d1d1d1;
                padding-right: 10px;
                margin-right: 10px;
                input {
                    margin-top: 6px;
                }
            }

            .logger-entry-name {
                line-height: 24px;
                word-break: break-all;
                padding-right: 10px;
            }

            .logger-entry-level {
                margin-left: auto;
            }
        }
    }
}

.log-display {
    background: #030303;
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
            filterQuery: '',
            loggers: []
        }
    },
    computed: {
        filteredLoggers() {
            if (this.filterQuery.length === 0) {
                return this.loggers;
            } else {
                return this.loggers.filter(el => el.name.toLowerCase().includes(this.filterQuery.toLowerCase()));
            }
        }
    }
}
</script>
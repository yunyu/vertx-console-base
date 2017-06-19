<template>
    <div class="container-fluid">
        <div v-if="metrics">
            <div class="row row-eq-height row-cards-pf">
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Deployed Verticles" :count="getSimpleMetricValue('vertx_verticles')" iconClass="fa fa-cubes">
                    <a href="#" class="add">
                        <span class="pficon pficon-add-circle-o"></span>
                    </a>
                </pf-aggregate-status-card>
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Uptime" iconClass="fa fa-clock-o">
                    <span>{{ uptime }}</span>
                </pf-aggregate-status-card>
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Open Connections" :count="getSimpleMetricValue('.*_open_connections_.*', true)" iconClass="fa fa-exchange">
                    <span class="pficon pficon-ok"></span>
                </pf-aggregate-status-card>
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Load Average" :count="getSimpleMetricValue('os_load_average').toFixed(2)" iconClass="fa fa-hourglass">
                    <span class="pficon pficon-ok"></span>
                </pf-aggregate-status-card>
            </div>
            <div class="row row-eq-height row-cards-pf">
                <div :class="getColumnClass(1)">
                    <pf-card title="Java Heap" :accented="false" :showTitlesSeparator="false">
                        <pf-util-trend labelType="used" donutColor="#EC7A08" :data="javaHeapUsage"></pf-util-trend>
                    </pf-card>
                </div>
                <div :class="getColumnClass(1)">
                    <pf-card class="match-util-trend" title="System Load" :accented="false" :showTitlesSeparator="false">
                        <pf-trend labelType="used" title="CPU Usage" :data="cpuUsage"></pf-trend>
                        <div class="pf-body-separator"></div>
                        <pf-trend labelType="used" title="HTTP Reqs/sec" :data="avgRequestsPerSecond"></pf-trend>
                        <div class="pf-body-separator"></div>
                        <div class="pf-card-section">
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Non-Heap Used" :data="nonHeapUsage"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Total Collections" :data="gcCount"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Total GC Time" :data="gcTotal"></pf-trend-details>
                            </div>
                        </div>
                    </pf-card>
                </div>
                <div :class="getColumnClass(2)">
                    <pf-card class="match-util-trend" title="HTTP Response Times (ms) " :accented="false" :showTitlesSeparator="false">
                        <pf-stacked-bar :height="288" :data="httpRequests"></pf-stacked-bar>
                    </pf-card>
                </div>
            </div>
            <div class="row row-eq-height row-cards-pf">
                <div :class="getColumnClass(1)">
                    <pf-card class="match-util-trend" title="Resources" :accented="false" :showTitlesSeparator="false">
                        <pf-utilization-bar-chart title='Worker Pool' :formatFn="n => n + ' threads'" :value="getSimpleMetricValue('vertx_pools_worker_vert_x_worker_thread_in_use')" :total="getSimpleMetricValue('vertx_pools_worker_vert_x_worker_thread_max_pool_size')" :warning="60" :error="85"></pf-utilization-bar-chart>
                        <!-- <pf-utilization-bar-chart title='Open Files' units='FDs' :value="parseInt(getSimpleMetricValue('process_open_fds'))" :total="parseInt(getSimpleMetricValue('process_max_fds'))" inline :warning="60" :error="85"></pf-utilization-bar-chart> -->
                        <pf-utilization-bar-chart title='Disk Storage' :formatFn="diskUsage.formatFn" :value="diskUsage.used" :total="diskUsage.total" :warning="60" :error="85"></pf-utilization-bar-chart>
                        <div class="pf-body-separator"></div>
                        <div class="pf-card-section">
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Threads Started" :data="simpleFormattedData('jvm_threads_started_total', '0[.]0a')"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Active Threads" :data="simpleFormattedData('jvm_threads_current', '0[.]0a')"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Deadlocked Threads" :data="simpleFormattedData('jvm_threads_deadlocked')"></pf-trend-details>
                            </div>
                        </div>
                        <div class="pf-body-separator noline"></div>
                        <div class="pf-card-section">
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Available CPUs" :data="simpleFormattedData('os_avail_processors')"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Loaded Classes" :data="simpleFormattedData('jvm_classes_loaded_total', '0[.]0a')"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Unloaded Classes" :data="simpleFormattedData('jvm_classes_unloaded_total')"></pf-trend-details>
                            </div>
                        </div>
                    </pf-card>
                </div>
                <div :class="getColumnClass(1)">
                    <pf-card class="match-util-trend" title="Event Bus" :accented="false" :showTitlesSeparator="false">
                        <pf-trend labelType="used" title="Published/sec" :data="eventBusMessagesPublishedPerSecond"></pf-trend>
                        <div class="pf-body-separator"></div>
                        <pf-trend labelType="used" title="Active Handlers" :data="simpleFormattedData('vertx_eventbus_handlers', '0[.]0a')"></pf-trend>
                        <div class="pf-body-separator"></div>
                        <div class="pf-card-section">
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Msgs Delivered" :data="simpleFormattedData('vertx_eventbus_messages_delivered_total', '0[.]0a')"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Msgs Published" :data="simpleFormattedData('vertx_eventbus_messages_published_total', '0[.]0a')"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Reply Failures" :data="simpleFormattedData('vertx_eventbus_messages_reply_failures_total', '0[.]0a')"></pf-trend-details>
                            </div>
                        </div>
                    </pf-card>
                </div>
                <div :class="getColumnClass(2)">
                    <pf-card class="match-util-trend" title="HTTP Requests/sec History" :accented="false" :showTitlesSeparator="false">
                        <pf-multi-line :height="288" :data="httpRequestsRates" chartType="area"></pf-multi-line>
                    </pf-card>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.row-eq-height {
    display: flex;
}

.row-eq-height>.card-pf {
    margin-left: 10px;
    margin-right: 10px;
}

.match-util-trend .card-pf-body {
    height: 308px;
}

.match-util-trend-title .card-pf-body {
    height: 287px;
}

.card-pf-body .pf-body-separator {
    height: 1px;
    background: #d1d1d1;
    margin-top: 24px;
    margin-bottom: 24px;
}

.pf-body-separator.noline {
    background: transparent;
    margin-top: 8px;
    margin-bottom: 8px;
}

.pf-card-section {
    overflow: hidden;
}

.pf-card-section>div {
    padding: 0;
}
</style>

<script>
import prettyMs from 'pretty-ms';
import numeral from 'numeral';

import Metrics from './metrics.js';
Metrics.initialize('/metrics');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'Overview',
    data() {
        return {
            requestedMetrics: [],
            metrics: null,
            numeral: numeral // Allow use with inline fn
        }
    },
    mounted() {
        // Necessary for reactivity
        this.metricsCallback = metrics => {
            this.metrics = metrics;
            // console.log(JSON.stringify(this.metrics, null, 4));
        };
        Metrics.addCallback(this.metricsCallback);
    },
    beforeDestroy() {
        Metrics.removeCallback(this.metricsCallback);
    },
    methods: {
        getColumnClass(width, noCollapse) {
            let collapseStr = noCollapse ? '' : 'col-md-' + 6 * width + ' ';
            return collapseStr + 'col-lg-' + 3 * width;
        },
        getMetricByName(name, isRegex) {
            if (isRegex) {
                let regex = new RegExp(name);
                for (let [k, v] of Object.entries(this.metrics)) {
                    if (regex.test(k)) {
                        return v;
                    }
                }
                return undefined;
            } else {
                return this.metrics[name]
            }
        },
        getSimpleMetricValue(name, isRegex) {
            return parseFloat(this.getMetricByName(name, isRegex).metrics.value);
        },
        simpleFormattedData(key, format) {
            let formatFn;
            if (format) {
                formatFn = n => numeral(n).format(format);
            }
            return {
                value: this.getSimpleMetricValue(key),
                formatFn: formatFn
            }
        }
    },
    // TODO switch to configurable computed props
    computed: {
        diskUsage() {
            return {
                used: this.getSimpleMetricValue('disk_space_bytes_used'),
                total: this.getSimpleMetricValue('disk_space_bytes_max'),
                formatFn: n => numeral(n).format('0.0 b')
            }
        },
        javaHeapUsage() {
            return {
                used: parseFloat(this.getMetricByName('jvm_memory_bytes_used').metrics.area.heap.value),
                total: parseFloat(this.getMetricByName('jvm_memory_bytes_max').metrics.area.heap.value),
                formatFn: n => numeral(n).format('0.0 b')
            }
        },
        gcStats() {
            const gcMetrics = this.getMetricByName('jvm_gc_collection_seconds').metrics.gc;
            let count = 0;
            let sum = 0;
            for (let [k, v] of Object.entries(gcMetrics)) {
                if (v.count) {
                    count += parseFloat(v.count);
                }
                if (v.sum) {
                    sum += parseFloat(v.sum);
                }
            }
            return { count: count, sum: sum };
        },
        gcTotal() {
            return {
                value: this.gcStats.sum,
                formatFn: n => numeral(n).format('0') + ' sec'
            };
        },
        gcCount() {
            return {
                value: this.gcStats.count,
                formatFn: n => numeral(n).format('0[.]0a')
            };
        },
        cpuUsage() {
            return {
                value: this.getSimpleMetricValue('os_system_cpu_load'),
                formatFn: n => numeral(n).format('0.0 %')
            }
        },
        nonHeapUsage() {
            return {
                value: parseFloat(this.getMetricByName('jvm_memory_bytes_used').metrics.area.nonheap.value),
                formatFn: n => numeral(n).format('0.0 b')
            }
        },
        httpRequests() {
            const requestsMetric = this.getMetricByName('vertx_http_servers_.*:\\d+_requests', true);
            const requestsDistMetric = this.getMetricByName('vertx_http_servers_.*_\\d+_requests_dist', true);

            const perc50 = parseFloat(requestsMetric.metrics.quantiles['0.5']);
            const perc95 = parseFloat(requestsMetric.metrics.quantiles['0.95']);
            const perc99 = parseFloat(requestsMetric.metrics.quantiles['0.99']);
            return {
                indices: [new Date()],
                values: {
                    '50th': numeral(perc50 * 1000).format('0.0'),
                    '95th': numeral(perc95 * 1000).format('0.0'),
                    '99th': numeral(perc99 * 1000).format('0.0')
                },
                colors: {
                    '50th': '#7cc2e8',
                    '95th': '#f9d67a',
                    '99th': '#f39c3d'
                },
                baseline: {
                    value: numeral(requestsDistMetric.metrics.stat.mean.value * 1000).format('0.0'),
                    text: 'Overall average'
                }
            }
        },
        httpRequestsRates() {
            const requestsRateMetric = this.getMetricByName('vertx_http_servers_.*_\\d+_requests_rate', true);

            const oneMin = parseFloat(requestsRateMetric.metrics.interval['oneMinute'].value);
            const fiveMin = parseFloat(requestsRateMetric.metrics.interval['fiveMinute'].value);
            const fifteenMin = parseFloat(requestsRateMetric.metrics.interval['fifteenMinute'].value);

            return {
                indices: [new Date()],
                values: {
                    '1 minute': numeral(oneMin).format('0.00'),
                    '5 minutes': numeral(fiveMin).format('0.00'),
                    '15 minutes': numeral(fifteenMin).format('0.00')
                }
            }
        },
        uptime() {
            return prettyMs(Math.floor(Date.now() / 1e3 - this.getSimpleMetricValue('process_start_time_seconds')) * 1e3);
        },
        avgRequestsPerSecond() {
            const totalReqs = this.getMetricByName('vertx_http_servers_.*:\\d+_requests', true).metrics.count;
            let rps;
            if (this.lastTotalReqs === undefined) {
                rps = 0;
            } else {
                rps = totalReqs - this.lastTotalReqs;
            }
            this.lastTotalReqs = totalReqs;
            return {
                value: rps
            };
        },
        eventBusMessagesPublishedPerSecond() {
            const totalPublished = this.getSimpleMetricValue('vertx_eventbus_messages_published_total');
            let mpps;
            if (this.lastTotalPublished === undefined) {
                mpps = 0;
            } else {
                mpps = totalPublished - this.lastTotalPublished;
            }
            this.lastTotalPublished = totalPublished;
            return {
                value: mpps,
                formatFn: n => numeral(n).format('0[.]0a') + ' msgs'
            }
        }
    }
}
</script>

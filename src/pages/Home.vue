<template>
    <div>
        <div class="page-header">
            <h1>Overview</h1>
        </div>
        <div v-if="mappedMetrics">
            <div class="row row-eq-height row-cards-pf">
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Deployed Verticles" :count="parseInt(getSimpleMetricValue('vertx_verticles'))" iconClass="fa fa-cubes">
                    <a href="#" class="add"><span class="pficon pficon-add-circle-o"></span></a>
                </pf-aggregate-status-card>
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Uptime" iconClass="fa fa-clock-o">
                    <span>{{ uptime }}</span>
                </pf-aggregate-status-card>
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Open Connections" :count="parseInt(getSimpleMetricValue('.*_open_connections_.*', true))" iconClass="fa fa-exchange">
                    <span class="pficon pficon-ok"></span>
                </pf-aggregate-status-card>
                <pf-aggregate-status-card :class="getColumnClass(1)" title="Load Average" :count="getSimpleMetricValue('os_load_average')" iconClass="fa fa-hourglass">
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
                        <pf-trend labelType="used" title="Requests/sec" :data="avgRequestsPerSecond"></pf-trend>
                        <div class="pf-body-separator"></div>
                        <div class="pf-card-section">
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Non-Heap Usage" :used="nonHeapUsage.value" :units="nonHeapUsage.units"></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Collections Run" :used="gcStats.count" units=""></pf-trend-details>
                            </div>
                            <div class="col-sm-4 col-md-4">
                                <pf-trend-details title="Time Spent in GCs" :used="gcStats.sum" units="sec"></pf-trend-details>
                            </div>
                        </div>
                    </pf-card>
                </div>
                <!--
                            <div :class="getColumnClass(2)">
                                <pf-card class="match-util-trend" title="Event Bus Messages Published" :accented="false" :showTitlesSeparator="false">
                                    <pf-single-line :height="288" :data="eventBusMessages"></pf-single-line>
                                </pf-card>
                            </div>
                            -->
                <div :class="getColumnClass(2)">
                    <pf-card class="match-util-trend" title="HTTP Response Times (seconds) " :accented="false" :showTitlesSeparator="false">
                        <pf-multi-line :height="288" :data="httpRequests"></pf-multi-line>
                    </pf-card>
                </div>
            </div>
            <div class="row row-eq-height row-cards-pf">
                <div :class="getColumnClass(1)">
                    <pf-card class="match-util-trend" title="Usage Statistics" :accented="false" :showTitlesSeparator="false">
                        <pf-utilization-bar-chart title='Workers' units='threads' :value="parseInt(getSimpleMetricValue('vertx_pools_worker_vert_x_worker_thread_in_use'))" :total="parseInt(getSimpleMetricValue('vertx_pools_worker_vert_x_worker_thread_max_pool_size'))" inline :warning="60" :error="85"></pf-utilization-bar-chart>
                        <!-- <pf-utilization-bar-chart title='Open Files' units='FDs' :value="parseInt(getSimpleMetricValue('process_open_fds'))" :total="parseInt(getSimpleMetricValue('process_max_fds'))" inline :warning="60" :error="85"></pf-utilization-bar-chart> -->
                        <pf-utilization-bar-chart title='Storage' :units='diskUsage.units' :value="diskUsage.used" :total="diskUsage.total" inline :warning="60" :error="85"></pf-utilization-bar-chart>
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
    margin-top: 25px;
    margin-bottom: 25px;
}

.pf-card-section>div {
    padding: 0;
}
</style>

<script>
import Card from 'vue-patternfly';
import UtilizationBarCard from '../cards/UtilizationBarCard.vue'
import Util from '../util.js';
import Metrics from '../metrics.js';
import prettyMs from 'pretty-ms';

function formatBytes(bytes, decimals) {
    if (bytes == 0) return { value: 0, unit: 'Bytes' };
    var k = 1000,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return { value: parseFloat((bytes / Math.pow(k, i))), unit: sizes[i] };
}

function toFixedNumber(x, base) {
    return Math.round(x * base) / base;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    data() {
        return {
            requestedMetrics: [],
            mappedMetrics: null
        }
    },
    mounted() {
        Metrics.addCallback(metrics => {
            let mappedMetrics = {};
            for (let el of metrics) {
                if (el.metrics.length === 1) {
                    el.metrics = el.metrics[0];
                } else if (el.metrics.length > 1) {
                    let sharedLblKey = null;
                    for (let metric of el.metrics) {
                        if (!metric.labels) {
                            sharedLblKey = null;
                            break;
                        }
                        let lblKeys = Object.keys(metric.labels);
                        if (lblKeys.length !== 1) {
                            sharedLblKey = null;
                            break;
                        } else if (sharedLblKey === null) {
                            sharedLblKey = lblKeys[0];
                        } else if (sharedLblKey != lblKeys[0]) {
                            sharedLblKey = null;
                            break;
                        }
                    }
                    if (sharedLblKey !== null) {
                        let mappedSubMetrics = {};
                        for (let metric of el.metrics) {
                            let subMetricKey = metric.labels[sharedLblKey];
                            mappedSubMetrics[subMetricKey] = metric;
                            delete mappedSubMetrics[subMetricKey].labels;
                        }
                        el.metrics = {};
                        el.metrics[sharedLblKey] = mappedSubMetrics;
                    }
                }
                let elName = el.name;
                mappedMetrics[elName] = el;
                delete mappedMetrics[elName].name;
            }
            this.mappedMetrics = mappedMetrics;
            // console.log(JSON.stringify(this.mappedMetrics, null, 4));
        });
    },
    methods: {
        getColumnClass(width) {
            return 'col-md-' + 3 * width;
        },
        getMetricByName(name, isRegex) {
            if (isRegex) {
                let regex = new RegExp(name);
                for (let [k, v] of Object.entries(this.mappedMetrics)) {
                    if (regex.test(k)) {
                        return v;
                    }
                }
                return undefined;
            } else {
                return this.mappedMetrics[name]
            }
        },
        getSimpleMetricValue(name, isRegex) {
            return this.getMetricByName(name, isRegex).metrics.value;
        }
    },
    // TODO switch to configurable computed props
    computed: {
        diskUsage() {
            const diskUsed = parseFloat(this.getMetricByName('disk_space_bytes_used').metrics.value);
            const diskMax = parseFloat(this.getMetricByName('disk_space_bytes_max').metrics.value);
            const formatted = formatBytes(diskUsed);
            return {
                used: toFixedNumber(formatted.value, 1e2),
                total: toFixedNumber(diskMax / diskUsed * formatted.value, 1e2),
                units: formatted.unit
            }
        },
        javaHeapUsage() {
            const heapUsed = parseFloat(this.getMetricByName('jvm_memory_bytes_used').metrics.area.heap.value);
            const heapMax = parseFloat(this.getMetricByName('jvm_memory_bytes_max').metrics.area.heap.value);
            const formatted = formatBytes(heapUsed);
            return {
                used: toFixedNumber(formatted.value, 1e2),
                total: toFixedNumber(heapMax / heapUsed * formatted.value, 1e2),
                units: formatted.unit
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
            return { count: count, sum: toFixedNumber(sum, 1e1) };
        },
        cpuUsage() {
            return {
                used: toFixedNumber(parseFloat(this.getSimpleMetricValue('os_system_cpu_load')) * 100, 1e1),
                units: '%'
            }
        },
        nonHeapUsage() {
            const formatted = formatBytes(parseFloat(this.getMetricByName('jvm_memory_bytes_used').metrics.area.nonheap.value));
            return {
                value: Math.floor(formatted.value),
                units: formatted.unit
            }
        },
        httpRequests() {
            const requestsMetric = this.getMetricByName('vertx_http_servers_.*:\\d+_requests', true);
            // console.log(JSON.stringify(requestsMetric, null, 4));
            const perc50 = parseFloat(requestsMetric.metrics.quantiles['0.5']);
            const perc95 = parseFloat(requestsMetric.metrics.quantiles['0.95']);
            const perc99 = parseFloat(requestsMetric.metrics.quantiles['0.99']);
            return {
                indices: [new Date()],
                values: {
                    '50th': toFixedNumber(perc50, 1e3),
                    '95th': toFixedNumber(perc95, 1e3),
                    '99th': toFixedNumber(perc99, 1e3)
                }
            }
        },
        uptime() {
            return prettyMs(Math.floor(Date.now() / 1e3 - parseFloat(this.getSimpleMetricValue('process_start_time_seconds'))) * 1e3);
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
                used: rps,
                units: ''
            };
        },
        eventBusMessages() {
            return {
                indices: [new Date()],
                values: [parseInt(this.getSimpleMetricValue('vertx_eventbus_messages_published_total'))]
            }
        }
    }
}
</script>

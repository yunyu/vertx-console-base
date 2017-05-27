<template>
    <div>
        <div class="page-header">
            <h1>Overview</h1>
        </div>
        <div class="row row-cards-pf">
            <div :class="getColumnClass(card)" v-for="card in cards">
                <pf-card :title="card.title" :accented="false">
                    <component :is="card.component" :items="card.items"></component>
                </pf-card>
            </div>
        </div>
    </div>
</template>

<script>
import Card from 'vue-patternfly';
import UtilizationBarCard from '../cards/UtilizationBarCard.vue'
import parsePrometheusTextFormat from 'parse-prometheus-text-format';
import Util from '../util.js';

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return { value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), unit: sizes[i] };
}

function toFixedNumber(x, base) {
    return Math.round(x * base) / base;
}

export default {
    data() {
        return {
            cards: [
                {
                    title: 'Graph Card',
                    width: 2,
                    component: UtilizationBarCard,
                    items: [
                    ]
                }
            ],
        }
    },
    created() {
        Util.addGreyBackground();
    },
    destroyed() {
        Util.removeGreyBackground();
    },
    methods: {
        getColumnClass(card) {
            return 'col-md-' + 3 * card.width;
        },
        updateMetrics(url, metrics, cb) {
            var params = metrics.map(el => 'name[]=' + el).join('&');
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url + params, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    cb(parsePrometheusTextFormat(xhr.responseText));
                }
            };
            xhr.send();
        }
    },
    /*
    [
    {
        "name":"jvm_memory_bytes_used",
        "help":"Used bytes of a given JVM memory area.",
        "type":"GAUGE",
        "metrics":[
            {
                "value":"1.8907072E7",
                "labels":{
                "area":"heap"
                }
            },
            {
                "value":"3.3662392E7",
                "labels":{
                "area":"nonheap"
                }
            }
        ]
    },
    {
        "name":"jvm_memory_bytes_max",
        "help":"Max (bytes) of a given JVM memory area.",
        "type":"GAUGE",
        "metrics":[
            {
                "value":"1.894252544E9",
                "labels":{
                "area":"heap"
                }
            },
            {
                "value":"-1.0",
                "labels":{
                "area":"nonheap"
                }
            }
        ]
    }
    ]
    */
    mounted() {
        const updateTask = () => {

            this.updateMetrics('http://localhost:5000/metrics?',
                ['jvm_memory_bytes_used', 'jvm_memory_bytes_max'],
                metrics => {
                    var mappedMetrics = {};
                    metrics.forEach(el => mappedMetrics[el.name] = el);
                    var heapCard = this.cards[0];
                    var usedBytes = mappedMetrics['jvm_memory_bytes_used'];
                    var maxBytes = mappedMetrics['jvm_memory_bytes_max'].metrics[0].value;
                    var formattedMaxBytes = formatBytes(parseFloat(maxBytes));
                    var newItems = [
                        {
                            title: usedBytes.help + ' ' + JSON.stringify(usedBytes.metrics[0].labels),
                            units: formattedMaxBytes.unit,
                            total: formattedMaxBytes.value,
                            value: toFixedNumber(mappedMetrics['jvm_memory_bytes_used'].metrics[0].value / maxBytes * formattedMaxBytes.value, 1e2)
                        },
                        {
                            title: usedBytes.help + ' ' + JSON.stringify(usedBytes.metrics[1].labels),
                            units: formattedMaxBytes.unit,
                            total: formattedMaxBytes.value,
                            value: toFixedNumber(mappedMetrics['jvm_memory_bytes_used'].metrics[1].value / maxBytes * formattedMaxBytes.value, 1e2)
                        }
                    ];
                    heapCard.items = newItems;
                    // console.log(JSON.stringify(heapCard.items));
                }
            );
        };
        updateTask();
        setInterval(updateTask, 1000);
    }
}
</script>
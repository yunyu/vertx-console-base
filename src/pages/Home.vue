<template>
    <div>
        <div class="page-header">
            <h1>Overview</h1>
        </div>
        <div class="row row-eq-height row-cards-pf">
            <pf-aggregate-status-card :class="getColumnClass(1)" title="Deployed Verticle" count="1" iconClass="fa fa-cubes">
                <span class="pficon pficon-ok"></span>
            </pf-aggregate-status-card>
            <pf-aggregate-status-card :class="getColumnClass(1)" title="Available Processors" count="4" iconClass="fa fa-microchip">
                <span class="pficon pficon-ok"></span>
            </pf-aggregate-status-card>
            <pf-aggregate-status-card :class="getColumnClass(1)" title="Open Connections" count="2" iconClass="fa fa-exchange">
                <span class="pficon pficon-ok"></span>
            </pf-aggregate-status-card>
            <pf-aggregate-status-card :class="getColumnClass(1)" title="Pending Messages" count="0" iconClass="fa fa-hourglass">
                <span class="pficon pficon-ok"></span>
            </pf-aggregate-status-card>
        </div>
        <div class="row row-cards-pf">
            <div :class="getColumnClass(1)">
                <pf-card title="Java Heap" :accented="false" :showTitlesSeparator="false">
                    <pf-util-trend labelType="used" donutColor="#EC7A08" :data="donutReactivityTest"></pf-util-trend>
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

.row-eq-height .card-pf {
    margin-left: 10px;
    margin-right: 10px;
}
</style>

<script>
import Card from 'vue-patternfly';
import UtilizationBarCard from '../cards/UtilizationBarCard.vue'
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    data() {
        return {
            cards: [
                {
                    title: 'Java Heap',
                    width: 1,
                    component: UtilizationBarCard,
                    items: [
                    ]
                }
            ],
            donutReactivityTest: {
                used: 0,
                available: 0,
                units: 'MB'
            }
        }
    },
    /*
    created() {
        Util.addGreyBackground();
    },
    beforeDestroy() {
        Util.removeGreyBackground();
    },
    */
    mounted() {
        var updateTestData = () => {
            this.donutReactivityTest.used = getRandomInt(100, 150);
            this.donutReactivityTest.available = 200 - this.donutReactivityTest.used;
            this.issueDeepUpdates();
        };
        updateTestData();
        setInterval(updateTestData, 1000);
    },
    methods: {
        getColumnClass(width) {
            return 'col-md-' + 3 * width;
        },
        issueDeepUpdates() {
            // JS limitation: https://github.com/vuejs/vue/issues/2649#issuecomment-266968941
            this.donutReactivityTest = Object.assign({}, this.donutReactivityTest);
        }
    }
}
</script>


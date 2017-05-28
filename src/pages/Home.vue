<template>
    <div>
        <div class="page-header">
            <h1>Overview</h1>
        </div>
        <div class="row row-cards-pf">
            <div :class="getColumnClass(card)" v-for="card in cards">
                <pf-card :title="card.title" :accented="false" :showTitlesSeparator="false">
                    <component :is="card.component" :items="card.items"></component>
                    <pf-util-trend labelType="used" donutColor="#EC7A08" :data="donutReactivityTest"></pf-util-trend>
                </pf-card>
    
            </div>
        </div>
    </div>
</template>

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
        getColumnClass(card) {
            return 'col-md-' + 3 * card.width;
        },
        issueDeepUpdates() {
            // JS limitation: https://github.com/vuejs/vue/issues/2649#issuecomment-266968941
            this.donutReactivityTest = Object.assign({}, this.donutReactivityTest);
        }
    }
}
</script>
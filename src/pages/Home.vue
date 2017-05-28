<template>
    <div>
        <div class="page-header">
            <h1>Overview</h1>
        </div>
        <div class="row row-cards-pf">
            <div :class="getColumnClass(card)" v-for="card in cards">
                <pf-card :title="card.title" :accented="false" :showTitlesSeparator="false">
                    <component :is="card.component" :items="card.items"></component>
                    <pf-c3chart ref="donut" type="donut" title="used" :data="donutReactivityTest"></pf-c3chart>
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
                    title: 'Graph Card',
                    width: 2,
                    component: UtilizationBarCard,
                    items: [
                    ]
                }
            ],
            donutReactivityTest: {
                type: 'donut',
                columns: [
                    ['Used', 123],
                    ['Available', 74]
                ],
                groups: [
                    ['used', 'available']
                ]
            }
        }
    },
    created() {
        Util.addGreyBackground();
    },
    destroyed() {
        Util.removeGreyBackground();
    },
    mounted() {
        setInterval(() => {
            this.donutReactivityTest.columns[0][1] = getRandomInt(100, 150);
            this.donutReactivityTest.columns[1][1] = getRandomInt(50, 80);
            this.donutReactivityTest = Object.assign({}, this.donutReactivityTest);
            // console.log(JSON.stringify(this.donutReactivityTest.columns));
            // console.log('updated donut data');
        }, 1000);
    },
    methods: {
        getColumnClass(card) {
            return 'col-md-' + 3 * card.width;
        }
    }
}
</script>
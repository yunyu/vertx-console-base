<template>
    <div class="trend-compact-details">
        <span v-if="showActualValue">
            <template v-if="data.formatFn">
                <span :class="'trend-title-compact-' + textSize + '-pf'"> {{ formatted[0] }}</span>
                <span class="trend-title-compact-small-pf" v-if="formatted.length > 1">{{ formatted[1] }}</span>
            </template>
            <template v-else>
                <span :class="'trend-title-compact-' + textSize + '-pf'"> {{ data.value }}</span>
            </template>
        </span>
        <span class="trend-header-compact-pf" v-if="title">{{ title }}</span>
    </div>
</template>

<style>
.trend-title-compact-medium-pf {
  font-size: 26px;
  font-weight: 300;
  line-height: 1;
}

@media (min-width: 1200px) and (max-width: 1600px) {
    .trend-header-compact-pf {
        font-size: 11px;
    }

    .trend-title-compact-medium-pf {
        font-size: 22px;
    }

    .trend-title-compact-big-pf {
        font-size: 28px;
    }
}
</style>

<script>
export default {
    name: 'pf-trend-details',
    props: {
        data: Object,
        title: String,
        textSize: {
            type: String,
            default: 'medium'
        },
        showActualValue: {
            type: Boolean,
            default: true
        },
        splitFormattedFn: {
            type: Function,
            default: s => s.split(' ')
        }
    },
    computed: {
        formatted() {
            return this.splitFormattedFn(this.data.formatFn(this.data.value));
        }
    }
}
</script>

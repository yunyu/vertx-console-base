<template>
    <div class="trend-compact-details">
        <span v-if="showActualValue">
            <div v-if="data.formatFn">
                <span class="trend-title-compact-big-pf"> {{ formatted[0] }}</span>
                <span class="trend-title-compact-small-pf" v-if="formatted.length > 1">{{ formatted[1] }}</span>
            </div>
            <div v-else>
                <span class="trend-title-compact-big-pf"> {{ data.value }}</span>
            </div>
        </span>
        <span class="trend-header-compact-pf" v-if="title">{{ title }}</span>
    </div>
</template>

<script>
export default {
    name: 'pf-trend-details',
    props: {
        data: Object,
        title: String,
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

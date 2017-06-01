<template>
    <div class="trend-compact-details">
        <span v-if="showActualValue">
            <span class="trend-title-compact-big-pf"> {{ used }}</span>
            <span class="trend-title-compact-small-pf">{{ units }}</span>
        </span>
        <span class="trend-header-compact-pf" v-if="title">{{ title }}</span>
    </div>
</template>
  

<script>
export default {
    name: 'pf-trend-details',
    props: {
        used: Number,
        units: String,
        title: String,
        showActualValue: {
            type: Boolean,
            default: true
        }
    }
}
</script>

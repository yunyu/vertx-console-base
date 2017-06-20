<template>
    <div class="table-view-pf-btn">
        <button class="btn btn-default" :class="{ disabled: !hasMetadata }">{{ hasMetadata ? 'View' : 'None' }}</button>
    </div>
</template>

<script>
export default {
    props: {
        row: Object
    },
    options: {
        asPlainText(row) {
            return '';
        }
    },
    computed: {
        hasMetadata() {
            return this.row.metadata !== undefined && Object.keys(this.row.metadata).length > 0;
        }
    }
}
</script>

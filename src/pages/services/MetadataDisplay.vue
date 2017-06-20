<template>
    <div class="table-view-pf-btn metadata-display">
        <vs-dropdown v-if="hasMetadata" class="dropdown dropdown-kebab-pf">
            <div slot="button">View</div>
            <div slot="dropdown-menu" class="dropdown-menu dropdown-menu-right dropdown-menu-container">
                <code>{{ rowString }}</code>
            </div>
        </vs-dropdown>
        <button v-else class="btn btn-default disabled">None</button>
    </div>
</template>

<style lang="scss">
.metadata-display > .btn-group {
    width: 100%;
    height: 100%;

    .btn .caret {
        display: none;
    }

    .dropdown-menu-container {
        padding: 10px;
    }

    code {
        white-space: pre;
        background: none;
        padding: 0;
    }
}
</style>

<script>
export default {
    props: {
        row: Object
    },
    options: {
        asPlainText(row) {
            return this.rowString;
        }
    },
    computed: {
        hasMetadata() {
            return this.row.metadata !== undefined && Object.keys(this.row.metadata).length > 0;
        },
        rowString() {
            return JSON.stringify(this.row.metadata, null, 4);
        }
    }
}
</script>

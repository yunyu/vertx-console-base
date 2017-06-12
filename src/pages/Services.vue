<template>
    <div>
        <datatable :columns="tableColumns" :data="tableRows" filterable paginate></datatable>
    </div>
</template>

<style lang="scss">
    .table thead .glyphicon {
        color: #aaa;
    }
</style>

<script>
import Services from '../services.js';

export default {
    mounted() {
        Services.addCallback(services => this.tableRows = services);
        console.log(this.tableColumns);
    },
    data() {
        return {
            tableColumns: [
                { label: 'Name', field: 'name' },
                { label: 'Status', field: 'status' },
                { label: 'Type', field: 'type' },
                { label: 'Endpoint', field: 'location.endpoint' },
                { label: 'Registration', field: 'registration' }
            ],
            tableRows: []
        }
    }
}
</script>

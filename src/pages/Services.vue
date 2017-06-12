<template>
    <div>
        <div class="page-header">
            <h1>Services</h1>
        </div>
        <datatable :columns="tableColumns" :data="tableRows" filterable paginate></datatable>
    </div>
</template>

<style lang="scss">
.table thead .glyphicon {
    color: #aaa;
}

.table-above .col-xs-12, .table-below .col-xs-12 {
    padding-left: 6px;
    padding-bottom: 16px;
}

table.table {
    border: 1px solid #ddd;
    background: white;
}

.table-below .btn-group {
    vertical-align: top;
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

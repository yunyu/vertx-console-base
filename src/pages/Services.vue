<template>
    <div>
        <div class="page-header">
            <h1>Services</h1>
        </div>
        <datatable :columns="tableColumns" :data="tableRows" filterable paginate></datatable>
    </div>
</template>

<script>
import Services from '../services.js';

export default {
    mounted() {
        Services.addCallback(services => this.tableRows = services);
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

<template>
    <div class="container-fluid">
        <div class="page-header">
            <h1>Services</h1>
        </div>
        <datatable :columns="tableColumns" :data="tableRows" filterable paginate></datatable>
    </div>
</template>

<script>
import Services from './services.js';

Services.initialize('/discovery');

export default {
    name: 'Services',
    mounted() {
        this.servicesCallback = services => this.tableRows = services;
        Services.addCallback(this.servicesCallback);
    },
    beforeDestroy() {
        Services.removeCallback(this.servicesCallback);
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
